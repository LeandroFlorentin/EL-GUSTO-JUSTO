'use client';
import { Menu, X } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';

import NavBar from '../NavBar/NavBar';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <>
      <header className="h-20 w-full md:h-30">
        <div className="grid h-full grid-cols-12 items-center px-4 md:px-8">
          {/* Logo */}
          <div className="col-span-8 flex items-center gap-3 md:col-span-2 md:flex-col md:justify-center md:gap-0">
            <Image src="/logo.png" alt="Logo" width={40} height={40} className="h-10 w-10 md:h-15 md:w-15" />

            <div className="flex flex-col md:items-center">
              <h3 className="font-serif text-base font-bold text-foreground md:text-xl">SABOR&ESTILO</h3>

              <h5 className="font-serif text-xs font-semibold text-foreground md:text-sm">Catering</h5>
            </div>
          </div>

          {/* Desktop nav */}
          <NavBar className="col-span-10 hidden items-center justify-center gap-10 md:flex" />

          {/* Mobile button */}
          <div className="col-span-4 flex justify-end md:hidden">
            <button
              type="button"
              onClick={() => setIsMenuOpen(true)}
              aria-label="Abrir menú"
              className="text-foreground"
            >
              <Menu size={28} />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-50 flex flex-col bg-background md:hidden">
          <div className="flex items-center justify-between p-5">
            <div className="flex items-center gap-3">
              <Image src="/logo.png" alt="Logo" width={40} height={40} className="h-10 w-10" />

              <div>
                <h3 className="font-serif font-bold text-foreground">SABOR&ESTILO</h3>

                <p className="font-serif text-xs text-foreground">Catering</p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsMenuOpen(false)}
              aria-label="Cerrar menú"
              className="text-foreground"
            >
              <X size={28} />
            </button>
          </div>

          <NavBar
            className="flex flex-1 flex-col items-center justify-center gap-8"
            onNavigate={() => setIsMenuOpen(false)}
          />
        </div>
      )}
    </>
  );
};

export default Header;
