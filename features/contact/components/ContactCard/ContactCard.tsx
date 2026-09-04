import { ArrowUpRight } from 'lucide-react';
import type { ContactCardProps } from './ContactCard.types';

const ContactCard = ({ channel }: ContactCardProps) => {
  const Icon = channel.icon;

  return (
    <div className="group relative flex flex-col justify-between rounded-2xl border border-border/80 bg-background p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-md">
      <div>
        <div className="flex items-center justify-between gap-2">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-foreground text-accent transition-colors group-hover:text-primary-foreground">
            <Icon className="h-6 w-6" />
          </div>
          {channel.badge && (
            <span className="rounded-full bg-primary/15 px-3 py-1 text-xs font-medium text-primary">
              {channel.badge}
            </span>
          )}
        </div>

        <h3 className="mt-5 font-serif text-2xl text-foreground">{channel.title}</h3>
        <p className="mt-1 text-sm font-semibold text-primary">{channel.value}</p>
        <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{channel.description}</p>
      </div>

      <div className="mt-6 pt-4 border-t border-border/50">
        <a
          href={channel.href}
          target={channel.isExternal ? '_blank' : undefined}
          rel={channel.isExternal ? 'noopener noreferrer' : undefined}
          className="inline-flex items-center gap-2 text-sm font-medium text-foreground transition-colors hover:text-primary"
        >
          <span>{channel.actionText}</span>
          <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </a>
      </div>
    </div>
  );
};

export default ContactCard;
