export interface NavItem {
  label: string;
  href: string;
}

export interface NavBarProps {
  className?: string;
  onNavigate?: () => void;
}
