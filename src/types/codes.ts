
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
    id: 'nfpa-101',
    region: 'USA',
    name: 'NFPA 101',
    description: 'Life Safety Code',
    category: 'Safety'
  },
  {
    id: 'si-5281',
    region: 'ISRAEL',
    name: 'SI 5281',
    description: 'Israeli Sustainable Building Standard',
    category: 'Sustainability'
  },
  {
    id: 'si-1918',
    region: 'ISRAEL',
    name: 'SI 1918',
    description: 'Israeli Earthquake Resistance Standard',
    category: 'Structural'
  },
  {
    id: 'si-1045',
    region: 'ISRAEL',
    name: 'SI 1045',
    description: 'Thermal Insulation of Buildings',
    category: 'Energy'
  }
];
