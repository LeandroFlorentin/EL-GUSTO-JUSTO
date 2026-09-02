'use client';

import { usePathname } from 'next/navigation';
import { navData } from './data/navbar.data';
import type { NavBarProps } from './NavBar.types';

const NavBar = ({ className, onNavigate }: NavBarProps) => {
  const pathname = usePathname();

  return (
    <nav className={className}>
      {navData.map((item) => {
        const isActive = pathname === item.href;

        return (
          <a
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            aria-current={isActive ? 'page' : undefined}
            className={`
              relative
              font-sans
              text-base
              font-semibold
              transition-colors
              duration-200

              after:absolute
              after:-bottom-2
              after:left-0
              after:h-px
              after:bg-accent
              after:transition-all
              after:duration-200

              hover:text-accent
              hover:after:w-full

              ${isActive ? 'text-accent after:w-full' : 'text-foreground after:w-0'}
            `}
          >
            {item.label}
          </a>
        );
      })}
    </nav>
  );
};

export default NavBar;
