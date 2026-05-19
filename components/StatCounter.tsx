'use client';

import { useEffect, useRef, useState } from 'react';
import { useInView } from 'motion/react';

interface StatCounterProps {
  /** 目標數字，純文字（如 "42"）；非數字（如 "免費"）原樣顯示 */
  value: string;
  label: string;
  suffix?: string;
}

function useCountUp(target: number, duration = 1500, active: boolean) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!active || target === 0) return;
    const start = performance.now();
    let raf: number;

    function tick(now: number) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // easeOutExpo
      const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      setCount(Math.round(eased * target));
      if (progress < 1) raf = requestAnimationFrame(tick);
    }

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [active, target, duration]);

  return count;
}

export default function StatCounter({ value, label, suffix = '' }: StatCounterProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-40px' });

  const numericTarget = parseInt(value.replace(/[^\d]/g, ''), 10);
  const isNumeric = !isNaN(numericTarget) && String(numericTarget) === value.replace(/[^\d]/g, '');
  const plus = value.includes('+');

  const count = useCountUp(isNumeric ? numericTarget : 0, 1400, inView && isNumeric);

  const display = isNumeric
    ? `${count}${plus ? '+' : ''}${suffix}`
    : value;

  return (
    <div ref={ref} className="text-center py-5">
      <p style={{
        color: '#FFFFFF',
        fontSize: 'clamp(1.2rem, 3vw, 1.8rem)',
        fontWeight: 700,
        fontFamily: 'var(--font-playfair)',
        marginBottom: 2,
        transition: 'opacity 0.3s',
      }}>
        {display}
      </p>
      <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.7rem', letterSpacing: '0.1em' }}>
        {label}
      </p>
    </div>
  );
}
