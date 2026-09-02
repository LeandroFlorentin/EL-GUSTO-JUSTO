import { navData } from './data/navbar.data';
import type { NavBarProps } from './NavBar.types';

const NavBar = ({ className, onNavigate }: NavBarProps) => {
  return (
    <nav className={className}>
      {navData.map((item) => (
        <a
          key={item.href}
          href={item.href}
          onClick={onNavigate}
          className="
            relative
            font-sans
            text-base
            font-semibold
            text-foreground
            transition-colors
            duration-200

            after:absolute
            after:-bottom-2
            after:left-0
            after:h-px
            after:w-0
            after:bg-accent
            after:transition-all
            after:duration-200

            hover:text-accent
            hover:after:w-full
          "
        >
          {item.label}
        </a>
      ))}
    </nav>
  );
};

export default NavBar;
