export type AboutData = {
  company: string;
  area: string;
  traffic: string;
  school: string;
  phone: string;
  address: string;
  updatedAt: string;
};

const FALLBACK: AboutData = {
  company:
    '群義房屋雲林雲科加盟店，不論住家、店面、辦公、廠房、土地等買賣租賃，皆提供專業仲介服務。' +
    '我們秉持著專業與熱忱、堅持給客人最用心與最迅速的服務，提供完整成交資訊，誠實告知房屋瑕疵，' +
    '提供客戶專業分析與規劃。感謝貴賓的支持與信任，我們始終當作一份責任。',
  area:
    '各大賣場聚集，斗六成大醫院、星巴克、社口商圈、家樂福、特力屋、HOLA 等，' +
    '匯集本區熱鬧繁華，食衣住行育樂生活機能一應俱全。',
  traffic:
    '雲科加盟店位於斗六市中正路312號，公司位在社口重劃區，緊鄰斗六交通重道大學路。' +
    '距離古坑國道3號約8-9分鐘路程，公司門口預留6個停車位，歡迎蒞臨指導。',
  school: '公司位於斗六市區中間地段，附近有雲林國小、鎮南國小、斗六國小、雲林國中、雲林科技大學。',
  phone: '05-5362808',
  address: '640 雲林縣斗六市中正路312號',
  updatedAt: new Date().toISOString().split('T')[0],
};

export async function getAboutData(): Promise<AboutData> {
  try {
    const res = await fetch('https://www.chyi.com.tw/store/055362808', {
      next: { revalidate: 86400 }, // 每24小時重新抓取
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; YunlinBlog/1.0)',
      },
    });

    if (!res.ok) return FALLBACK;

    const html = await res.text();

    // 解析各區塊
    const extract = (before: string, after: string): string => {
      const regex = new RegExp(
        before.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') +
          '([\\s\\S]*?)' +
          after.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'),
        'i'
      );
      const m = html.match(regex);
      return m ? m[1].replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim() : '';
    };

    // 用 title tag 找各段落（根據官網 h3 文字）
    const sections = html.split(/<h3[^>]*>/i);
    const getText = (keyword: string): string => {
      const section = sections.find((s) => s.includes(keyword));
      if (!section) return '';
      const afterTitle = section.replace(/^[^<]*<\/h3>/i, '');
      return afterTitle
        .replace(/<[^>]+>/g, ' ')
        .replace(/\s+/g, ' ')
        .trim()
        .substring(0, 400);
    };

    return {
      company: getText('公司簡介') || FALLBACK.company,
      area: getText('商圈簡介') || FALLBACK.area,
      traffic: getText('交通狀況') || FALLBACK.traffic,
      school: getText('學校社區') || FALLBACK.school,
      phone: FALLBACK.phone,
      address: FALLBACK.address,
      updatedAt: new Date().toISOString().split('T')[0],
    };
  } catch {
    return FALLBACK;
  }
}
