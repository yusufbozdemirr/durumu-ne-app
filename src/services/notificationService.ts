export const notificationService = {
  /**
   * Check if native HTML5 notifications are supported in this browser
   */
  isSupported(): boolean {
    return typeof window !== 'undefined' && 'Notification' in window;
  },

  /**
   * Get current browser notification permission
   */
  getPermission(): NotificationPermission | 'unsupported' {
    if (!this.isSupported()) return 'unsupported';
    return Notification.permission;
  },

  /**
   * Check if this device has already registered for local notifications for this specific vehicle
   */
  isSubscribedForVehicle(publicToken: string): boolean {
    if (!this.isSupported()) return false;
    const saved = localStorage.getItem(`durumu_ne_local_notify_${publicToken}`);
    return Boolean(saved && Notification.permission === 'granted');
  },

  /**
   * Request permission for native browser notifications
   */
  async requestPermission(publicToken: string): Promise<{
    success: boolean;
    error?: string;
    permissionDenied?: boolean;
  }> {
    if (!this.isSupported()) {
      return { success: false, error: 'Tarayıcınız bildirimleri desteklemiyor.' };
    }

    try {
      const permission = await Notification.requestPermission();
      if (permission !== 'granted') {
        return {
          success: false,
          permissionDenied: true,
          error: 'Bildirim izni verilmedi. Tarayıcı adres çubuğundaki kilit simgesinden izin verebilirsiniz.',
        };
      }

      // Save preference
      localStorage.setItem(`durumu_ne_local_notify_${publicToken}`, 'true');

      // Attempt to register dummy service worker for mobile support (not required for desktop)
      if ('serviceWorker' in navigator) {
        try {
          await navigator.serviceWorker.register('/sw.js', { scope: '/' });
        } catch (e) {
          console.warn("SW registration failed (non-critical)", e);
        }
      }

      return { success: true };
    } catch (err: any) {
      console.error('Bildirim izni istenirken hata:', err);
      return {
        success: false,
        error: err?.message || 'Bildirim aboneliği gerçekleştirilemedi.',
      };
    }
  },

  /**
   * Send a local native notification
   */
  sendLocalNotification(title: string, body: string, icon: string = '/logo.png') {
    if (this.isSupported() && Notification.permission === 'granted') {
      try {
        if ('serviceWorker' in navigator) {
          navigator.serviceWorker.getRegistration().then(reg => {
            if (reg) {
              reg.showNotification(title, {
                body,
                icon,
                badge: '/favicon.png',
                vibrate: [200, 100, 200]
              });
            } else {
              this._fallbackNativeNotification(title, body, icon);
            }
          }).catch(() => this._fallbackNativeNotification(title, body, icon));
        } else {
          this._fallbackNativeNotification(title, body, icon);
        }
      } catch (e) {
        console.warn("Notification trigger error", e);
        this._fallbackNativeNotification(title, body, icon);
      }
    }
  },

  _fallbackNativeNotification(title: string, body: string, icon: string) {
    try {
      const notification = new Notification(title, { body, icon });
      notification.onclick = () => {
        window.focus();
        notification.close();
      };
    } catch (err) {
      console.warn("Fallback notification failed (likely mobile without SW)", err);
    }
  }
};
