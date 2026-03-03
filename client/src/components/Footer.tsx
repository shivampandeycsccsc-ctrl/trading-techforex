import { Link } from "wouter";
import { Lock, Shield, CheckCircle2, Instagram, Twitter, Send } from "lucide-react";

const footerLinks = [
  {
    title: "Programs",
    links: [
      { label: "Starter Pack", href: "/education" },
      { label: "Pro Trader Course", href: "/education" },
      { label: "Elite Mentorship", href: "/education" },
      { label: "Live Sessions", href: "/education" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Trading Books", href: "/books" },
      { label: "Trading Tools", href: "/tools" },
      { label: "Market Analysis", href: "/markets" },
      { label: "Free Webinars", href: "/education" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About Shivam", href: "/contact" },
      { label: "Student Results", href: "/" },
      { label: "Contact Us", href: "/contact" },
    ],
  },
];

// Social media with official brand colors
const socials = [
  {
    icon: Instagram,
    href: "https://www.instagram.com/charts.pattern",
    label: "Instagram",
    defaultColor: "text-pink-500",
    hoverColor: "hover:text-pink-400",
  },
  {
    icon: Send,
    href: "https://t.me/techf0rex",
    label: "Telegram",
    defaultColor: "text-sky-500",
    hoverColor: "hover:text-sky-400",
  },
  {
    icon: Twitter,  // Using Twitter icon for X (formerly Twitter)
    href: "https://x.com/techforexvip?s=21",
    label: "X",
    defaultColor: "text-sky-500",
    hoverColor: "hover:text-sky-400",
  },
];

export function Footer() {
  return (
    <footer className="bg-[#050d18] border-t border-white/[0.05]">
      <div className="container mx-auto px-4 py-16">
        {/* Main grid */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 md:gap-10 mb-12">
          {/* Brand */}
          <div className="col-span-2 md:col-span-2">
            <div className="flex items-center gap-3 mb-5">
              <img
                src="/techforex_logo.webp"
                alt="TechForex"
                className="h-10 w-auto"
                onError={(e) => { e.currentTarget.style.display = 'none'; }}
              />
              <span className="text-xl font-black text-white tracking-tight">
                Tech<span className="text-blue-400">Forex</span>
              </span>
            </div>
            <p className="text-slate-500 text-sm max-w-sm leading-relaxed mb-7">
              India's premier forex & stock trading education platform. Learn from a professional with 9+ years of proven market experience.
            </p>

            {/* Social Links – now with brand colors */}
            <div className="flex gap-3">
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className={`w-9 h-9 rounded-xl bg-white/[0.04] border border-white/[0.07] flex items-center justify-center ${s.defaultColor} ${s.hoverColor} hover:border-white/20 transition-all`}
                >
                  <s.icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Link Columns */}
          {footerLinks.map((col) => (
            <div key={col.title}>
              <h4 className="text-white font-black text-xs uppercase tracking-widest mb-5">{col.title}</h4>
              <ul className="space-y-3">
                {col.links.map((link) => (
                  <li key={link.label}>
                    {link.href.startsWith('http') ? (
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-slate-500 text-sm hover:text-blue-400 transition-colors"
                      >
                        {link.label}
                      </a>
                    ) : (
                      <Link href={link.href}>
                        <span className="text-slate-500 text-sm hover:text-blue-400 transition-colors cursor-pointer">
                          {link.label}
                        </span>
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-white/[0.05]">
          <div className="flex flex-wrap gap-y-4 justify-between items-center mb-5">
            <div className="text-slate-600 text-xs font-medium">Dubai, U.A.E</div>
            <p className="text-slate-700 text-xs">
              © {new Date().getFullYear()} TechForex. All rights reserved.
            </p>
          </div>
          <p className="text-slate-700 text-xs leading-relaxed">
            <Link href="/terms">
              <span className="underline hover:text-blue-400 cursor-pointer">Terms & Conditions</span>
            </Link> – Includes risk disclaimer and non‑refundable policy.
          </p>
        </div>
      </div>
    </footer>
  );
}
