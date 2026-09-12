'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { nav } from '../data/nav';
import { events } from '../data/events';

export default function Header() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const menuRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const close = () => { setOpen(false); triggerRef.current?.focus(); };

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => { if (event.key === 'Escape') close(); };
    document.addEventListener('keydown', onKeyDown);
    const first = menuRef.current?.querySelector<HTMLElement>('a, button');
    first?.focus();
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [open]);

  const isActive = (href: string) => href === '/' ? pathname === '/' : pathname.startsWith(href);
  return <>
    <div className="bg-ink text-ivory text-center py-2 text-xs">Next event · {events[0].title} · {events[0].date}</div>
    <header className="sticky top-0 z-20 bg-ivory/95 backdrop-blur border-b border-ink/10">
      <div className="container flex items-center justify-between h-20">
        <Link href="/" className="font-serif text-2xl focus-ring" aria-label="Krean Jewels home">KREAN</Link>
        <button ref={triggerRef} aria-expanded={open} aria-controls="primary-navigation" aria-label={open ? 'Close menu' : 'Open menu'} onClick={() => setOpen(!open)} className="md:hidden focus-ring p-2" type="button">
          <span className="sr-only">{open ? 'Close menu' : 'Open menu'}</span><svg aria-hidden="true" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d={open ? 'M6 6l12 12M18 6L6 18' : 'M3 6h18M3 12h18M3 18h18'} /></svg>
        </button>
        <nav ref={menuRef} id="primary-navigation" aria-label="Primary navigation" className={`${open ? 'block' : 'hidden'} md:block absolute md:static left-0 right-0 top-20 bg-ivory md:bg-transparent p-6 md:p-0 shadow-md md:shadow-none`}>
          <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">{nav.map(n => <Link className={`focus-ring ${isActive(n.href) ? 'underline underline-offset-8' : ''}`} aria-current={isActive(n.href) ? 'page' : undefined} onClick={() => setOpen(false)} key={n.href} href={n.href}>{n.label}</Link>)}<Link href="/contact" className="btn focus-ring" onClick={() => setOpen(false)}>Enquire</Link></div>
        </nav>
      </div>
    </header>
  </>;
}
