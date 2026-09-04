import { WhatsAppIcon } from '@/shared/components/icons/WhatsAppIcon';
import { buildWhatsAppLink } from '@/shared/lib/whatsapp-link';

const WhatsAppTrigger = () => {
  return (
    <a
      href={buildWhatsAppLink()}
      target="_blank"
      rel="noreferrer"
      aria-label="Hablar por WhatsApp"
      className="flex items-center gap-2 rounded-full bg-accent px-5 py-3 font-sans text-sm font-semibold text-foreground shadow-lg transition-transform hover:-translate-y-0.5"
    >
      <WhatsAppIcon aria-hidden="true" />
    </a>
  );
};

export default WhatsAppTrigger;
