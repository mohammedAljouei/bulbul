import { AuthError } from '@supabase/supabase-js';

export function formatPhoneToEmail(phone: string): string {
  // Remove any non-digit characters
  const cleanPhone = phone.replace(/\D/g, '');
  
  // Add Saudi prefix if not present
  const fullPhone = cleanPhone.startsWith('966') 
    ? cleanPhone 
    : cleanPhone.startsWith('0')
      ? `966${cleanPhone.slice(1)}`
      : `966${cleanPhone}`;
      
  return `${fullPhone}@example.com`;
}

export function isValidSaudiPhone(phone: string): boolean {
  const cleanPhone = phone.replace(/\D/g, '');
  
  // Check if it's a valid Saudi number format
  // Allows: 05XXXXXXXX or 5XXXXXXXX
  return /^(0?5\d{8})$/.test(cleanPhone);
}

export function getAuthErrorMessage(error: AuthError): string {
  switch (error.message) {
    case 'Invalid login credentials':
      return 'رقم الجوال أو كلمة المرور غير صحيحة';
    case 'User already registered':
      return 'رقم الجوال مسجل مسبقاً';
    default:
      return 'حدث خطأ غير متوقع';
  }
}