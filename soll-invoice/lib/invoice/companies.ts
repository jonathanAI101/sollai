export interface FromCompany {
  id: string;
  name: string;
  legalName?: string;
  address: string;
  city: string;
  state?: string;
  postalCode: string;
  country: string;
  email: string;
  phone?: string;
  bankName: string;
  bankAccount: string;
  bankRouting?: string;
  swiftCode?: string;
  taxId?: string;
  logo?: string;
}

export const FROM_COMPANIES: FromCompany[] = [
  {
    id: 'sollai-us',
    name: 'SollAI',
    legalName: 'SollAI Inc.',
    address: '1234 Main Street, Apt 5B',
    city: 'San Francisco',
    state: 'CA',
    postalCode: '94105',
    country: 'United States',
    email: 'billing@sollai.com',
    phone: '+1 (555) 123-4567',
    bankName: 'First National Bank',
    bankAccount: '1234567890',
    bankRouting: '021000021',
    taxId: 'US-12345678',
  },
  {
    id: 'starry-horizon-hk',
    name: 'STARRY HORIZON LIMITED',
    legalName: 'STARRY HORIZON LIMITED',
    address: '1/F WAH HUNG CTR, 41 HUNG TO RD',
    city: 'KWUN TONG',
    state: 'KOWLOON',
    postalCode: '000000',
    country: 'Hong Kong SAR China',
    email: 'billing@starryhorizon.com',
    phone: '+852 1234 5678',
    bankName: 'HSBC Hong Kong',
    bankAccount: '123-456789-001',
    swiftCode: 'HSBCHKHHHKH',
  },
  {
    id: 'mercury-labs-sc',
    name: 'Mercury Labs LIMITED',
    legalName: 'Mercury Labs LIMITED',
    address: '306 Victoria House, Victoria',
    city: 'Mahe',
    state: '',
    postalCode: '000000',
    country: 'Seychelles',
    email: 'billing@mercurylabs.sc',
    phone: '+248 123 4567',
    bankName: 'Seychelles International Bank',
    bankAccount: 'SC-9876543210',
    swiftCode: 'SIBKSCSC',
  },
];

export function getCompanyById(id: string): FromCompany | undefined {
  return FROM_COMPANIES.find(c => c.id === id);
}

export const DEFAULT_FROM_COMPANY = FROM_COMPANIES[0];

export function formatCompanyAddress(company: FromCompany): string[] {
  const lines: string[] = [];
  lines.push(company.address);

  const cityLine = [company.city, company.state, company.postalCode]
    .filter(Boolean)
    .join(', ');
  if (cityLine) lines.push(cityLine);

  lines.push(company.country);
  return lines;
}
