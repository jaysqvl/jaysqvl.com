'use client';

import { useEffect, useState, type MouseEvent } from 'react';
import { Menu, X } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/theme-toggle';

const navItems = [
  { name: 'Projects', href: '#projects' },
  { name: 'Homelab', href: '#lab' },
  { name: 'Experience', href: '#experience' },
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

  const handleInternalNav = (event: MouseEvent<HTMLAnchorElement>, href: string) => {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    setMobileMenuOpen(false);
    const element = document.querySelector(href);

    if (!element) {
      return;
    }

    event.preventDefault();
    window.scrollTo({
      top: element.getBoundingClientRect().top + window.scrollY - 80,
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth',
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
        <Link
          href="/"
          className="group flex items-center gap-3 text-left"
          aria-label="Jay Esquivel Jr., home"
        >
          <span className="grid size-8 place-items-center rounded-md border border-border bg-card text-xs font-semibold tracking-[0.18em] text-foreground">
            JQ
          </span>
          <span className="hidden leading-none sm:block">
            <span className="block text-sm font-semibold tracking-[0.18em]">JAYSQVL</span>
            <span className="block pt-1 font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
              Vancouver, BC
            </span>
          </span>
        </Link>

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
                <Link
                  key={item.name}
                  href={`/${item.href}`}
                  onClick={(event) => handleInternalNav(event, item.href)}
                  className="rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                >
                  {item.name}
                </Link>
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
            aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-navigation"
          >
            {mobileMenuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </Button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="border-t border-border bg-background/96 backdrop-blur-xl md:hidden">
          <nav id="mobile-navigation" className="section-shell grid gap-2 py-4" aria-label="Mobile navigation">
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
                <Link
                  key={item.name}
                  href={`/${item.href}`}
                  onClick={(event) => handleInternalNav(event, item.href)}
                  className="rounded-md px-3 py-3 text-left text-base text-foreground"
                >
                  {item.name}
                </Link>
              )
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
