
export type RegionCode = 'USA' | 'ISRAEL';

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
  }
];
