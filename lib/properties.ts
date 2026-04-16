import propertiesData from '@/content/properties.json';

export type Property = {
  no: string;
  title: string;
  price: string;
  addr: string;
  unit_price: string;
  layout: string;
  build_ping: string;
  land_ping: string;
  age: string;
  type: string;
  category: string;
  img: string;
  link: string;
};

export function getProperties(): Property[] {
  return (propertiesData as { items: Property[] }).items ?? [];
}

export function getPropertyTypes(): string[] {
  const items = getProperties();
  const types = Array.from(new Set(items.map((i) => i.type).filter(Boolean)));
  return ['全部', ...types];
}

export function getPropertySlug(p: Property): string {
  return p.no; // e.g. "2594-917645W"
}

export function getPropertyBySlug(slug: string): Property | null {
  return getProperties().find((p) => p.no === slug) ?? null;
}
