/**
 * Firebase Error Translator for DURUMU NE?
 * Maps all Firebase Authentication and Cloud Firestore error codes to clean, user-friendly Turkish messages.
 * Logs the raw error to console.error for debugging.
 */

export function getTurkishErrorMessage(error: any): string {
  // Always log raw error to console for real debugging as requested
  console.error('Firebase error:', error);

  if (!error) {
    return 'Beklenmeyen bir hata oluştu. Lütfen tekrar deneyin.';
  }

  const code = error?.code || '';
  const rawMessage = error?.message || '';

  // 1. Firebase Authentication Error Codes
  switch (code) {
    case 'auth/email-already-in-use':
      return 'Bu e-posta adresi zaten kullanımda.';

    case 'auth/invalid-email':
      return 'Geçersiz e-posta adresi.';

    case 'auth/weak-password':
      return 'Şifre en az 6 karakter olmalıdır.';

    case 'auth/user-not-found':
      return 'Bu kullanıcı hesabı bulunamadı.';

    case 'auth/wrong-password':
    case 'auth/invalid-credential':
      return 'E-posta veya şifre hatalı.';

    case 'auth/too-many-requests':
      return 'Çok fazla başarısız giriş denemesi yapıldı. Lütfen daha sonra tekrar deneyin.';

    case 'auth/network-request-failed':
      return 'İnternet bağlantısı nedeniyle işlem gerçekleştirilemedi.';

    case 'auth/user-disabled':
      return 'Bu kullanıcı hesabı devre dışı bırakılmıştır.';

    case 'auth/operation-not-allowed':
      return 'Bu giriş yöntemi sistemde aktif değil.';

    // 2. Cloud Firestore Error Codes
    case 'permission-denied':
      return 'Bu işlemi gerçekleştirmek için yetkiniz bulunmuyor.';

    case 'failed-precondition':
      return 'Firebase işlemi için gerekli koşullar sağlanamadı.';

    case 'unavailable':
      return 'Firebase servisine şu anda ulaşılamıyor. Lütfen tekrar deneyin.';

    case 'not-found':
      return 'İstenen Firebase verisi bulunamadı.';

    case 'already-exists':
      return 'Bu kayıt zaten mevcut.';

    case 'deadline-exceeded':
      return 'İşlem zaman aşımına uğradı. Lütfen internet bağlantınızı kontrol edip tekrar deneyin.';

    case 'resource-exhausted':
      return 'İstek kotası aşıldı. Lütfen bir süre sonra tekrar deneyin.';

    case 'cancelled':
      return 'İşlem iptal edildi.';
  }

  // 3. Fallback for custom or permission-denied substring
  if (
    rawMessage.includes('Missing or insufficient permissions') ||
    rawMessage.includes('permission-denied')
  ) {
    return 'Bu işlemi gerçekleştirmek için yetkiniz bulunmuyor.';
  }

  // If a custom friendly message was explicitly thrown in our code
  if (rawMessage && !rawMessage.includes('Firebase:')) {
    return rawMessage;
  }

  return 'Firebase işlemi sırasında beklenmeyen bir hata oluştu. Lütfen tekrar deneyin.';
}
