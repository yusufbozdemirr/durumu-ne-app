import { onDocumentUpdated } from 'firebase-functions/v2/firestore';
import { onCall, HttpsError } from 'firebase-functions/v2/https';
import * as admin from 'firebase-admin';

// Initialize Firebase Admin (uses Google Cloud default service credentials automatically)
if (!admin.apps.length) {
  admin.initializeApp();
}

const db = admin.firestore();
const messaging = admin.messaging();

// Turkish status mapping matching "Durumu Ne?" standards
const STATUS_LABELS: Record<string, string> = {
  received: 'Araç Kabul Edildi',
  diagnosis: 'Arıza Tespiti',
  waiting_parts: 'Parça Bekleniyor',
  repair: 'İşlem Yapılıyor',
  testing: 'Test Aşamasında',
  ready: 'Araç Hazır',
};

/**
 * Trigger: Runs automatically when a vehicle's public tracking document updates.
 * Sends Web Push notifications to all subscribed customer devices if status actually changed.
 */
export const onVehicleStatusChanged = onDocumentUpdated(
  {
    document: 'publicVehicles/{publicToken}',
    region: 'europe-west1',
  },
  async (event) => {
    const beforeData = event.data?.before.data();
    const afterData = event.data?.after.data();

    if (!beforeData || !afterData) {
      console.log('Veri bulunamadı, atlanıyor.');
      return;
    }

    const oldStatus = beforeData.currentStatus;
    const newStatus = afterData.currentStatus;

    // 1. Check if status actually changed (e.g. diagnosis -> repair)
    // Redundant updates (repair -> repair) are skipped!
    if (oldStatus === newStatus) {
      console.log(`[FCM] Durum değişmedi (${oldStatus} -> ${newStatus}), bildirim gönderilmiyor.`);
      return;
    }

    const publicToken = event.params.publicToken;
    const plate = afterData.plate || 'Aracınız';
    const statusLabel = STATUS_LABELS[newStatus] || newStatus;

    // 2. Prepare user-friendly Turkish notification text
    const title = 'Durumu Ne?';
    let body = '';
    if (newStatus === 'ready') {
      body = `${plate} plakalı aracınız hazır. Teslim alabilirsiniz.`;
    } else {
      body = `${plate} plakalı aracınızın durumu '${statusLabel}' olarak güncellendi.`;
    }

    // 3. Query active FCM tokens for this vehicle
    const tokensSnapshot = await db
      .collection('publicVehicles')
      .doc(publicToken)
      .collection('notificationTokens')
      .where('active', '==', true)
      .get();

    if (tokensSnapshot.empty) {
      console.log(`[FCM] ${publicToken} (${plate}) için kayıtlı aktif bildirim cihazı yok.`);
      return;
    }

    const tokens: string[] = [];
    const tokenDocMap = new Map<string, string>(); // token -> docId for cleanup

    tokensSnapshot.forEach((docSnapshot) => {
      const data = docSnapshot.data();
      if (data.token && typeof data.token === 'string') {
        tokens.push(data.token);
        tokenDocMap.set(data.token, docSnapshot.id);
      }
    });

    if (tokens.length === 0) {
      return;
    }

    const targetUrl = `/takip/${publicToken}`;

    // 4. Construct FCM Multicast payload with WebPush specific options
    const message: admin.messaging.MulticastMessage = {
      tokens,
      notification: {
        title,
        body,
      },
      data: {
        title,
        body,
        publicToken,
        newStatus,
        url: targetUrl,
      },
      webpush: {
        notification: {
          title,
          body,
          icon: '/logo.png',
          badge: '/favicon.png',
          tag: `vehicle-${publicToken}`,
          renotify: true,
        },
        fcmOptions: {
          link: targetUrl,
        },
      },
    };

    console.log(`[FCM] ${tokens.length} aboneye bildirim gönderiliyor:`, {
      plate,
      oldStatus,
      newStatus,
      body,
    });

    const response = await messaging.sendEachForMulticast(message);
    console.log(`[FCM] Sonuç: Başarılı: ${response.successCount}, Hatalı: ${response.failureCount}`);

    // 5. Cleanup expired / invalid tokens
    const staleDocIds: string[] = [];
    response.responses.forEach((resp, idx) => {
      if (!resp.success) {
        const errCode = resp.error?.code;
        console.warn(`[FCM] Token hatası [${idx}]:`, errCode, resp.error?.message);
        if (
          errCode === 'messaging/registration-token-not-registered' ||
          errCode === 'messaging/invalid-registration-token' ||
          errCode === 'messaging/invalid-argument'
        ) {
          const badToken = tokens[idx];
          const docId = tokenDocMap.get(badToken);
          if (docId) staleDocIds.push(docId);
        }
      }
    });

    if (staleDocIds.length > 0) {
      const batch = db.batch();
      staleDocIds.forEach((docId) => {
        const ref = db
          .collection('publicVehicles')
          .doc(publicToken)
          .collection('notificationTokens')
          .doc(docId);
        batch.update(ref, {
          active: false,
          deactivatedReason: 'unregistered_token',
          updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        });
      });
      await batch.commit();
      console.log(`[FCM] ${staleDocIds.length} geçersiz/silinmiş token pasife alındı.`);
    }
  }
);

/**
 * Callable Function: Test or manually trigger a notification from the business panel.
 * Only authenticated business owners or admins can call this.
 */
export const sendVehicleNotificationManual = onCall(
  {
    region: 'europe-west1',
  },
  async (request) => {
    if (!request.auth) {
      throw new HttpsError('unauthenticated', 'Bu işlem için giriş yapılması gerekir.');
    }

    const { publicToken, customTitle, customBody } = request.data || {};
    if (!publicToken || typeof publicToken !== 'string') {
      throw new HttpsError('invalid-argument', 'publicToken parametresi zorunludur.');
    }

    const vehicleDoc = await db.collection('publicVehicles').doc(publicToken).get();
    if (!vehicleDoc.exists) {
      throw new HttpsError('not-found', 'Araç takip kaydı bulunamadı.');
    }

    const vehicle = vehicleDoc.data()!;
    const plate = vehicle.plate || 'Aracınız';

    const tokensSnapshot = await db
      .collection('publicVehicles')
      .doc(publicToken)
      .collection('notificationTokens')
      .where('active', '==', true)
      .get();

    if (tokensSnapshot.empty) {
      return { success: true, sentCount: 0, message: 'Bu araç için kayıtlı aktif cihaz yok.' };
    }

    const tokens: string[] = [];
    tokensSnapshot.forEach((doc) => {
      const t = doc.data().token;
      if (t) tokens.push(t);
    });

    const title = customTitle || 'Durumu Ne?';
    const body = customBody || `${plate} plakalı aracınız hakkında yeni bir bilgi paylaşıldı.`;

    const message: admin.messaging.MulticastMessage = {
      tokens,
      notification: { title, body },
      data: {
        title,
        body,
        publicToken,
        url: `/takip/${publicToken}`,
      },
      webpush: {
        notification: {
          title,
          body,
          icon: '/logo.png',
          badge: '/favicon.png',
        },
        fcmOptions: {
          link: `/takip/${publicToken}`,
        },
      },
    };

    const response = await messaging.sendEachForMulticast(message);
    return {
      success: true,
      sentCount: response.successCount,
      failureCount: response.failureCount,
    };
  }
);
