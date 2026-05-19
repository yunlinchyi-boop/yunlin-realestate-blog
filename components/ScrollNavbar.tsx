'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import MobileNav from './MobileNav';

export default function ScrollNavbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  return (
    <header
      className="sticky top-0 z-50"
      style={{
        background: '#3CB83C',
        backdropFilter: 'blur(8px)',
        boxShadow: scrolled ? '0 2px 20px rgba(0,0,0,0.2)' : 'none',
        transition: 'box-shadow 0.3s ease',
      }}
    >
      <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
        <Link href="/" className="flex items-center">
          <Image
            src="/images/logo-chyi.png"
            alt="群義房屋"
            width={200}
            height={68}
            style={{ objectFit: 'contain', height: 58, width: 'auto' }}
            priority
          />
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          <Link href="/blog" className="nav-link-white">房市專欄</Link>
          <Link href="/about" className="nav-link-white">關於我們</Link>
          <a href="tel:055362808" className="btn-consult-red">立即諮詢</a>
        </nav>

        <MobileNav />
      </div>
    </header>
  );
}
