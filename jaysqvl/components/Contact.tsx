import { FileText, GitBranch, Link2, Mail, Send } from 'lucide-react';

const links = [
  {
    label: 'Email',
    href: 'mailto:jaysqvl@gmail.com',
    icon: Mail,
  },
  {
    label: 'GitHub',
    href: 'https://github.com/jaysqvl',
    icon: GitBranch,
  },
  {
    label: 'LinkedIn',
    href: 'https://linkedin.com/in/jaysqvl/',
    icon: Link2,
  },
  {
    label: 'Resume PDF',
    href: '/resume.pdf',
    icon: FileText,
  },
];

export default function Contact() {
  return (
    <section id="contact" className="section-band border-b-0">
      <div className="section-shell">
        <div className="panel overflow-hidden">
          <div className="grid gap-8 p-5 sm:p-8 lg:grid-cols-[0.78fr_1fr] lg:items-center">
            <div>
              <div className="section-kicker">
                <Send className="size-4" />
                contact
              </div>
              <h2 className="section-title">Send the signal directly.</h2>
              <p className="mt-5 max-w-xl leading-7 text-muted-foreground">
                No fake contact form, no pretend chatbot. The useful paths are right here for work, collaboration,
                questions, or a quick hello.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {links.map((link) => {
                const Icon = link.icon;
                const isExternal = link.href.startsWith('http');

                return (
                  <a
                    key={link.label}
                    href={link.href}
                    target={isExternal || link.href.endsWith('.pdf') ? '_blank' : undefined}
                    rel={isExternal || link.href.endsWith('.pdf') ? 'noopener noreferrer' : undefined}
                    className="group flex items-center justify-between rounded-md border border-border bg-background/45 p-4 transition-colors hover:bg-muted"
                  >
                    <span className="flex items-center gap-3">
                      <span className="grid size-9 place-items-center rounded-md border border-border bg-card">
                        <Icon className="size-4" />
                      </span>
                      <span className="font-medium">{link.label}</span>
                    </span>
                    <span className="text-muted-foreground transition-transform group-hover:translate-x-0.5">/</span>
                  </a>
                );
              })}
            </div>
          </div>

          <div className="border-t border-border bg-muted/32 px-5 py-4 sm:px-8">
            <p className="font-mono text-xs uppercase tracking-[0.18em] text-muted-foreground">
              jaysqvl.com / built with Next.js / deployed on Vercel
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
