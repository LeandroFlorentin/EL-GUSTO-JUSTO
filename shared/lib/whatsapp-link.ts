const WHATSAPP_PHONE_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_PHONE_NUMBER || '5491100000000';

export const buildWhatsAppLink = (message?: string) => {
  const baseUrl = `https://wa.me/${WHATSAPP_PHONE_NUMBER}`;

  return message ? `${baseUrl}?text=${encodeURIComponent(message)}` : baseUrl;
};
