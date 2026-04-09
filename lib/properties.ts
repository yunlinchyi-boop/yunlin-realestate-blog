import propertiesData from '@/content/properties.json';

export type Property = {
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
