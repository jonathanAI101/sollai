import type { TaxRate, ProductCategory, CustomerTag, PaymentMethod, InvoiceStatus } from './types';

// 税率选项
export const TAX_RATES: { value: TaxRate; label: string }[] = [
  { value: 0.13, label: '13%' },
  { value: 0.09, label: '9%' },
  { value: 0.06, label: '6%' },
  { value: 0.03, label: '3%' },
  { value: 0.01, label: '1%' },
  { value: 0, label: '0%' },
];

// 产品分类选项
export const PRODUCT_CATEGORIES: ProductCategory[] = [
  '软件服务',
  '技术咨询',
  '硬件销售',
  '设计服务',
  '其他',
];

// 客户标签选项
export const CUSTOMER_TAGS: CustomerTag[] = [
  'VIP',
  '常用',
  '待跟进',
  '新客户',
];

// 付款方式选项
export const PAYMENT_METHODS: PaymentMethod[] = [
  '银行转账',
  '支付宝',
  '微信支付',
  '现金',
  '其他',
];

// 发票状态选项
export const INVOICE_STATUSES: { value: InvoiceStatus; label: string; color: string }[] = [
  { value: 'draft', label: '草稿', color: 'bg-zinc-100 text-zinc-600' },
  { value: 'issued', label: '已开票', color: 'bg-blue-100 text-blue-600' },
  { value: 'paid', label: '已付款', color: 'bg-green-100 text-green-600' },
  { value: 'void', label: '已作废', color: 'bg-red-100 text-red-600' },
];

// 常用单位
export const COMMON_UNITS: string[] = [
  '项',
  '次',
  '个',
  '套',
  '件',
  '台',
  '小时',
  '天',
  '月',
  '年',
];

// 最大开票主体数量
export const MAX_COMPANIES = 3;

// 导航菜单
export const NAV_ITEMS = [
  { href: '/', label: '开票', icon: 'FileText' },
  { href: '/customers', label: '客户', icon: 'Users' },
  { href: '/products', label: '产品', icon: 'Package' },
  { href: '/history', label: '历史', icon: 'Clock' },
  { href: '/settings', label: '设置', icon: 'Settings' },
] as const;
