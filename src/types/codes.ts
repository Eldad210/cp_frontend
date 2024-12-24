export type RegionCode = 'USA' | 'ISRAEL' | 'EUROPE';

export interface CodeStandard {
  id: string;
  region: RegionCode;
  name: string;
  description: string;
  category: string;
}

export const codeStandards: CodeStandard[] = [
  {
    id: 'ibc-2021',
    region: 'USA',
    name: 'IBC 2021',
    description: 'International Building Code 2021',
    category: 'Building'
  },
  {
    id: 'ada-2010',
    region: 'USA',
    name: 'ADA 2010',
    description: 'Americans with Disabilities Act Standards',
    category: 'Accessibility'
  },
  {
    id: 'si-5281',
    region: 'ISRAEL',
    name: 'SI 5281',
    description: 'Israeli Sustainable Building Standard',
    category: 'Sustainability'
  },
  {
    id: 'en-1990',
    region: 'EUROPE',
    name: 'Eurocode 0',
    description: 'European Structural Design Standards',
    category: 'Structural'
  }
];