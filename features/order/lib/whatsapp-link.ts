export const WHATSAPP_PHONE_NUMBER = '5491161792902';

export const buildWhatsAppLink = (message: string) => {
  return `https://wa.me/${WHATSAPP_PHONE_NUMBER}?text=${encodeURIComponent(message)}`;
};
