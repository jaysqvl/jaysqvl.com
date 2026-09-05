import { ArrowUpRight, FileText, GitBranch, Link2, Mail } from 'lucide-react';

const links = [
  { label: 'Email', href: 'mailto:jaysqvl@gmail.com', icon: Mail },
  { label: 'GitHub', href: 'https://github.com/jaysqvl', icon: GitBranch },
  { label: 'LinkedIn', href: 'https://linkedin.com/in/jaysqvl/', icon: Link2 },
  { label: 'Résumé', href: '/resume.pdf', icon: FileText },
];

export default function Contact() {
  return (
    <section id="contact" className="section-band border-b-0">
      <div className="section-shell">
        <div className="grid gap-8 lg:grid-cols-[1fr_0.7fr] lg:items-start">
          <div>
            <h2 className="section-title">Get in touch</h2>
            <p className="mt-5 max-w-xl leading-7 text-muted-foreground">
              Have a project in mind, or want to talk about something I’m working on? Send me an email.
            </p>
          </div>
          <div className="grid gap-x-8 sm:grid-cols-2">
            {links.map((link) => {
              const Icon = link.icon;
              const opensNewTab = link.href.startsWith('http') || link.href.endsWith('.pdf');

              return (
                <a
                  key={link.label}
                  href={link.href}
                  target={opensNewTab ? '_blank' : undefined}
                  rel={opensNewTab ? 'noopener noreferrer' : undefined}
                  className="flex items-center justify-between gap-4 border-b border-border py-4 text-muted-foreground transition-colors hover:text-foreground"
                >
                  <span className="flex items-center gap-3">
                    <Icon className="size-4" aria-hidden="true" />
                    <span className="font-medium">{link.label}</span>
                  </span>
                  <ArrowUpRight className="size-4" aria-hidden="true" />
                </a>
              );
            })}
          </div>
        </div>
        <footer className="mt-16 border-t border-border pt-6 text-sm text-muted-foreground">
          Jay Esquivel Jr.
        </footer>
      </div>
    </section>
  );
}
