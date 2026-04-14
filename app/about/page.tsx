import { getAboutData } from '@/lib/about';
import type { Metadata } from 'next';

export const revalidate = 86400;

export const metadata: Metadata = {
  title: '關於我們',
  description: '群義房屋雲林雲科加盟店公司簡介、商圈介紹與交通資訊。',
};

export default async function AboutPage() {
  const about = await getAboutData();

  const sections = [
    { en: 'Company', zh: '公司簡介', content: about.company },
    { en: 'District', zh: '商圈簡介', content: about.area },
    { en: 'Transportation', zh: '交通狀況', content: about.traffic },
    ...(about.school ? [{ en: 'Community', zh: '學校社區', content: about.school }] : []),
  ];

  return (
    <main style={{ background: 'var(--luxury-black)', color: 'var(--luxury-cream)', minHeight: '100vh' }}>

      <section className="border-b py-20 px-6 text-center" style={{ borderColor: 'var(--luxury-border)' }}>
        <p className="text-xs tracking-[0.4em] uppercase mb-4"
          style={{ color: 'var(--luxury-gold)', fontFamily: 'var(--font-playfair)', fontStyle: 'italic' }}>
          About Us
        </p>
        <h1 className="text-3xl font-semibold tracking-wider mb-3"
          style={{ color: 'var(--luxury-cream)', fontFamily: 'var(--font-playfair)' }}>
          關於我們
        </h1>
        <span style={{ display: 'block', width: 36, height: 1, background: 'var(--luxury-gold)', margin: '0 auto 16px' }} />
        <p className="text-xs" style={{ color: 'var(--luxury-muted)' }}>資料同步自官網・最後更新：{about.updatedAt}</p>
      </section>

      <div className="max-w-4xl mx-auto py-16 px-6 space-y-6">
        {sections.map(({ en, zh, content }) => (
          <section key={zh} className="p-8" style={{ border: '1px solid var(--luxury-border)', background: 'var(--luxury-card)' }}>
            <p className="text-xs tracking-[0.3em] uppercase mb-1"
              style={{ color: 'var(--luxury-gold)', fontFamily: 'var(--font-playfair)', fontStyle: 'italic' }}>{en}</p>
            <h2 className="text-lg font-semibold mb-3 tracking-wider"
              style={{ color: 'var(--luxury-cream)', fontFamily: 'var(--font-playfair)' }}>{zh}</h2>
            <span style={{ display: 'block', width: 28, height: 1, background: 'var(--luxury-gold)', marginBottom: 16 }} />
            <p className="text-sm leading-loose" style={{ color: '#C0B89A' }}>{content}</p>
          </section>
        ))}

        <section className="p-10 text-center" style={{ border: '1px solid var(--luxury-gold)', background: 'var(--luxury-dark)' }}>
          <p className="text-xs tracking-[0.4em] uppercase mb-2"
            style={{ color: 'var(--luxury-gold)', fontFamily: 'var(--font-playfair)', fontStyle: 'italic' }}>Contact</p>
          <h2 className="text-lg font-semibold mb-4 tracking-wider"
            style={{ color: 'var(--luxury-cream)', fontFamily: 'var(--font-playfair)' }}>聯絡資訊</h2>
          <span style={{ display: 'block', width: 28, height: 1, background: 'var(--luxury-gold)', margin: '0 auto 20px' }} />
          <div className="space-y-2 text-sm mb-8" style={{ color: '#C0B89A' }}>
            <p>紅火房屋仲介有限公司</p>
            <p style={{ color: 'var(--luxury-muted)', fontSize: '0.7rem' }}>經紀人證號：113雲縣字第00302號</p>
            <p>{about.phone}</p>
            <p>{about.address}</p>
          </div>
          <a href={`tel:${about.phone.replace(/-/g, '')}`}
            className="inline-block text-xs tracking-[0.25em] uppercase px-10 py-3 border transition-all duration-300 hover:bg-[#C9A84C] hover:text-black"
            style={{ borderColor: 'var(--luxury-gold)', color: 'var(--luxury-gold)' }}>
            立即諮詢
          </a>
        </section>
      </div>
    </main>
  );
}
