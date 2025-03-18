
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
    category: 'Fire'
  },
  {
    id: 'nec-2020',
    region: 'USA',
    name: 'NEC 2020',
    description: 'National Electrical Code',
    category: 'Electrical'
  },
  {
    id: 'asme-a17.1',
    region: 'USA',
    name: 'ASME A17.1',
    description: 'Safety Code for Elevators and Escalators',
    category: 'Elevator'
  },
  {
    id: 'ifgc-2021',
    region: 'USA',
    name: 'IFGC 2021',
    description: 'International Fuel Gas Code',
    category: 'Fuel Gas'
  },
  {
    id: 'igcc-2021',
    region: 'USA',
    name: 'IgCC 2021',
    description: 'International Green Construction Code',
    category: 'Green'
  },
  {
    id: 'imc-2021',
    region: 'USA',
    name: 'IMC 2021',
    description: 'International Mechanical Code',
    category: 'Mechanical Code'
  },
  {
    id: 'fgc-2021',
    region: 'USA',
    name: 'FGC 2021',
    description: 'Facility Guidelines for Hospitals and Healthcare Facilities',
    category: 'Medical Facilities'
  },
  {
    id: 'ashrae-90.1',
    region: 'USA',
    name: 'ASHRAE 90.1',
    description: 'Energy Standard for Buildings',
    category: 'Performance'
  },
  {
    id: 'ipc-2021',
    region: 'USA',
    name: 'IPC 2021',
    description: 'International Plumbing Code',
    category: 'Plumbing'
  },
  {
    id: 'irc-2021',
    region: 'USA',
    name: 'IRC 2021',
    description: 'International Residential Code',
    category: 'Residential'
  },
  {
    id: 'asce-7',
    region: 'USA',
    name: 'ASCE 7',
    description: 'Minimum Design Loads for Buildings and Other Structures',
    category: 'Structural'
  },
  {
    id: 'si-5281',
    region: 'ISRAEL',
    name: 'SI 5281',
    description: 'Israeli Sustainable Building Standard',
    category: 'Green'
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
    category: 'Performance'
  },
  {
    id: 'si-4466',
    region: 'ISRAEL',
    name: 'SI 4466',
    description: 'Steel for Reinforcement of Concrete',
    category: 'Building'
  },
  {
    id: 'si-1604',
    region: 'ISRAEL',
    name: 'SI 1604',
    description: 'Electrical Installations - National Electrical Code',
    category: 'Electrical'
  },
  {
    id: 'si-1596',
    region: 'ISRAEL',
    name: 'SI 1596',
    description: 'Fire Safety Code for Residential Buildings',
    category: 'Fire'
  },
  {
    id: 'si-158',
    region: 'ISRAEL',
    name: 'SI 158',
    description: 'Plumbing Installation Requirements',
    category: 'Plumbing'
  }
];
