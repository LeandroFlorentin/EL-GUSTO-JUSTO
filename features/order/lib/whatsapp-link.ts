const WHATSAPP_PHONE_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_PHONE_NUMBER;

export const buildWhatsAppLink = (message: string) => {
  return `https://wa.me/${WHATSAPP_PHONE_NUMBER}?text=${encodeURIComponent(message)}`;
};
