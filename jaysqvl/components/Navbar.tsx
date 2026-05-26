'use client';

import { useEffect, useState } from 'react';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/theme-toggle';

const navItems = [
  { name: 'Lab', href: '#lab' },
  { name: 'Work', href: '#experience' },
  { name: 'Projects', href: '#projects' },
  { name: 'Resume', href: '/resume.pdf', external: true },
  { name: 'Contact', href: '#contact' },
];

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 24);

    handleScroll();
    window.addEventListener('scroll', handleScroll);

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleInternalNav = (href: string) => {
    setMobileMenuOpen(false);
    const element = document.querySelector(href);

    if (!element) {
      return;
    }

    window.scrollTo({
      top: element.getBoundingClientRect().top + window.scrollY - 80,
      behavior: 'smooth',
    });
  };

  return (
    <header
      className={`fixed left-0 right-0 top-0 z-50 border-b transition-colors duration-300 ${
        isScrolled
          ? 'border-border bg-background/88 shadow-sm backdrop-blur-xl'
          : 'border-transparent bg-background/45 backdrop-blur-sm'
      }`}
    >
      <div className="section-shell flex h-16 items-center justify-between">
        <button
          type="button"
          className="group flex items-center gap-3 text-left"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          aria-label="Scroll to top"
        >
          <span className="grid size-8 place-items-center rounded-md border border-border bg-card text-xs font-semibold tracking-[0.18em] text-foreground">
            JQ
          </span>
          <span className="hidden leading-none sm:block">
            <span className="block text-sm font-semibold tracking-[0.18em]">JAYSQVL</span>
            <span className="block pt-1 font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
              portfolio / lab
            </span>
          </span>
        </button>

        <div className="hidden items-center gap-2 md:flex">
          <nav className="flex items-center gap-1" aria-label="Primary navigation">
            {navItems.map((item) =>
              item.external ? (
                <a
                  key={item.name}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                >
                  {item.name}
                </a>
              ) : (
                <button
                  key={item.name}
                  type="button"
                  onClick={() => handleInternalNav(item.href)}
                  className="rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                >
                  {item.name}
                </button>
              )
            )}
          </nav>
          <ThemeToggle />
        </div>

        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle />
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMobileMenuOpen((open) => !open)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </Button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="border-t border-border bg-background/96 backdrop-blur-xl md:hidden">
          <nav className="section-shell grid gap-2 py-4" aria-label="Mobile navigation">
            {navItems.map((item) =>
              item.external ? (
                <a
                  key={item.name}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-md px-3 py-3 text-base text-foreground"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.name}
                </a>
              ) : (
                <button
                  key={item.name}
                  type="button"
                  onClick={() => handleInternalNav(item.href)}
                  className="rounded-md px-3 py-3 text-left text-base text-foreground"
                >
                  {item.name}
                </button>
              )
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
