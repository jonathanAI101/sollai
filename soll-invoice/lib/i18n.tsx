'use client';

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';

type Language = 'zh' | 'en';

interface I18nContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
  zh: {
    // Landing Page
    'landing.login': '登录',
    'landing.badge': 'AI 驱动的智能开票',
    'landing.hero.title': '3 分钟完成专业发票',
    'landing.hero.subtitle': '告别繁琐的开票流程。智能填充、自动计算、一键导出 PDF，让开票变得简单高效。',
    'landing.cta.start': '免费开始',
    'landing.cta.learn': '了解更多',
    'landing.cta.title': '现在就开始使用',
    'landing.cta.subtitle': '无需注册，打开即用。你的数据完全存储在本地，安全可控。',
    'landing.trust.free': '永久免费',
    'landing.trust.noCard': '无需绑卡',
    'landing.trust.local': '数据本地存储',
    'landing.social.title': '已有用户信赖我们',
    'landing.social.invoices': '张发票已生成',
    'landing.social.countries': '个国家和地区',
    'landing.social.uptime': '系统可用性',
    'landing.social.rating': '用户评分',
    'landing.features.title': '为什么选择 SollAI',
    'landing.features.subtitle': '专为中小企业和自由职业者设计，简单、快速、安全',
    'landing.feature1.title': '秒级开票',
    'landing.feature1.desc': '预设客户和产品信息，智能填充表单，3 分钟内完成一张专业发票。',
    'landing.feature2.title': '隐私优先',
    'landing.feature2.desc': '所有数据存储在你的设备上，不上传任何服务器，你完全掌控自己的数据。',
    'landing.feature3.title': '多语言支持',
    'landing.feature3.desc': '支持中英文切换，满足跨境业务需求，让你的发票走向全球。',
    'landing.howItWorks.title': '三步完成开票',
    'landing.step1.title': '添加信息',
    'landing.step1.desc': '设置你的公司信息和常用客户',
    'landing.step2.title': '创建发票',
    'landing.step2.desc': '选择客户，添加产品，自动计算',
    'landing.step3.title': '导出分享',
    'landing.step3.desc': '一键生成 PDF，发送给客户',
    'landing.footer.privacy': '数据安全存储在本地',

    // Navigation
    'nav.invoice': '开票',
    'nav.customers': '客户',
    'nav.products': '产品',
    'nav.history': '历史',
    'nav.settings': '设置',

    // Common
    'common.add': '添加',
    'common.edit': '编辑',
    'common.delete': '删除',
    'common.save': '保存',
    'common.cancel': '取消',
    'common.confirm': '确认',
    'common.search': '搜索',
    'common.all': '全部',
    'common.loading': '加载中...',
    'common.noData': '暂无数据',
    'common.close': '关闭',
    'common.import': '导入',
    'common.export': '导出',

    // Invoice
    'invoice.title': '快速开票',
    'invoice.new': '新建发票',
    'invoice.seller': '销售方',
    'invoice.buyer': '购买方',
    'invoice.items': '开票项目',
    'invoice.addItem': '添加项目',
    'invoice.manualAdd': '手动添加',
    'invoice.subtotal': '合计金额',
    'invoice.tax': '合计税额',
    'invoice.total': '价税合计',
    'invoice.paymentMethod': '付款方式',
    'invoice.remark': '备注',
    'invoice.saveDraft': '保存草稿',
    'invoice.preview': '预览',
    'invoice.submit': '确认开票',
    'invoice.number': '发票编号',
    'invoice.selectCompany': '选择开票主体',
    'invoice.selectCustomer': '点击选择或搜索客户',
    'invoice.noCompany': '请先在设置中添加开票主体',
    'invoice.emptyItems': '点击"添加项目"从产品库选择，或"手动添加"',

    // Invoice Status
    'status.draft': '草稿',
    'status.issued': '已开票',
    'status.paid': '已付款',
    'status.void': '已作废',

    // Customer
    'customer.title': '客户管理',
    'customer.add': '添加客户',
    'customer.name': '客户名称',
    'customer.taxNumber': '税号',
    'customer.contact': '联系人',
    'customer.phone': '联系电话',
    'customer.email': '邮箱',
    'customer.address': '地址',
    'customer.bank': '开户行',
    'customer.bankAccount': '银行账号',
    'customer.tags': '标签',
    'customer.empty': '暂无客户',
    'customer.emptyHint': '添加您的第一个客户，方便快速开票',
    'customer.searchPlaceholder': '搜索客户名称、税号...',

    // Customer Tags
    'tag.vip': 'VIP',
    'tag.frequent': '常用',
    'tag.followUp': '待跟进',
    'tag.new': '新客户',

    // Product
    'product.title': '产品管理',
    'product.add': '添加产品',
    'product.name': '产品名称',
    'product.category': '分类',
    'product.unit': '单位',
    'product.price': '默认单价',
    'product.taxRate': '税率',
    'product.taxCode': '商品编码',
    'product.empty': '暂无产品',
    'product.emptyHint': '添加常用产品，开票时可快速选择',
    'product.searchPlaceholder': '搜索产品名称...',
    'product.duplicate': '复制',

    // Product Categories
    'category.software': '软件服务',
    'category.consulting': '技术咨询',
    'category.hardware': '硬件销售',
    'category.design': '设计服务',
    'category.other': '其他',

    // History
    'history.title': '发票历史',
    'history.filter': '筛选',
    'history.thisMonth': '本月开票',
    'history.monthAmount': '本月金额',
    'history.paidCount': '已付款',
    'history.unpaidCount': '待付款',
    'history.empty': '暂无发票记录',
    'history.emptyHint': '您开具的发票会显示在这里',
    'history.searchPlaceholder': '搜索发票号、客户名...',
    'history.download': '下载 PDF',
    'history.print': '打印',
    'history.sendEmail': '发送邮件',
    'history.copyNew': '复制为新发票',
    'history.markPaid': '标记为已付款',
    'history.markIssued': '确认开票',
    'history.markVoid': '作废',

    // Settings
    'settings.title': '公司设置',
    'settings.company': '开票主体',
    'settings.companyHint': '个主体',
    'settings.addCompany': '添加主体',
    'settings.editCompany': '编辑开票主体',
    'settings.companyName': '公司全称',
    'settings.shortCode': '简码',
    'settings.shortCodeHint': '用于生成发票编号',
    'settings.logo': 'Logo',
    'settings.uploadLogo': '上传 Logo',
    'settings.changeLogo': '更换 Logo',
    'settings.logoHint': '支持 JPG、PNG，最大 500KB',
    'settings.setDefault': '设为默认',
    'settings.default': '默认',
    'settings.maxCompanies': '最多可添加 3 个开票主体',
    'settings.emptyCompany': '添加开票主体',
    'settings.emptyCompanyHint': '设置您的公司信息，包括名称、税号、银行账户等',

    // Data Management
    'data.title': '数据管理',
    'data.export': '导出数据',
    'data.exportHint': '备份所有数据到 JSON 文件',
    'data.import': '导入数据',
    'data.importHint': '从 JSON 文件恢复数据',

    // About
    'about.title': '关于',
    'about.version': '版本',
    'about.description': '一款简约高效的快速开票工具，数据完全存储在本地，保护您的隐私安全。',

    // Theme
    'theme.title': '主题',
    'theme.light': '浅色',
    'theme.dark': '深色',
    'theme.system': '跟随系统',

    // Language
    'language.title': '语言',

    // Delete Confirmation
    'delete.title': '确认删除',
    'delete.message': '确定要删除吗？此操作无法撤销。',
    'delete.company': '确定要删除此开票主体吗？此操作无法撤销。',
    'delete.customer': '确定要删除此客户吗？此操作无法撤销。',
    'delete.product': '确定要删除此产品吗？此操作无法撤销。',
    'delete.invoice': '确定要删除此发票吗？此操作无法撤销。',

    // Success Messages
    'success.draftSaved': '草稿已保存',
    'success.invoiceCreated': '发票已创建',
    'success.continue': '继续开票',
    'success.viewHistory': '查看历史',

    // Payment Methods
    'payment.bankTransfer': '银行转账',
    'payment.alipay': '支付宝',
    'payment.wechat': '微信支付',
    'payment.cash': '现金',
    'payment.other': '其他',

    // Units
    'unit.item': '项',
    'unit.time': '次',
    'unit.piece': '个',
    'unit.set': '套',
    'unit.unit': '件',
    'unit.device': '台',
    'unit.hour': '小时',
    'unit.day': '天',
    'unit.month': '月',
    'unit.year': '年',
  },
  en: {
    // Landing Page
    'landing.login': 'Log in',
    'landing.badge': 'AI-Powered Smart Invoicing',
    'landing.hero.title': 'Professional Invoices in 3 Minutes',
    'landing.hero.subtitle': 'Say goodbye to tedious invoicing. Smart autofill, automatic calculations, one-click PDF export. Invoicing made simple.',
    'landing.cta.start': 'Start Free',
    'landing.cta.learn': 'Learn More',
    'landing.cta.title': 'Start Using Now',
    'landing.cta.subtitle': 'No signup required. Your data stays on your device, safe and secure.',
    'landing.trust.free': 'Free Forever',
    'landing.trust.noCard': 'No Credit Card',
    'landing.trust.local': 'Local Storage',
    'landing.social.title': 'Trusted by users worldwide',
    'landing.social.invoices': 'Invoices Created',
    'landing.social.countries': 'Countries',
    'landing.social.uptime': 'Uptime',
    'landing.social.rating': 'User Rating',
    'landing.features.title': 'Why Choose SollAI',
    'landing.features.subtitle': 'Built for SMBs and freelancers. Simple, fast, and secure.',
    'landing.feature1.title': 'Lightning Fast',
    'landing.feature1.desc': 'Pre-set customers and products, smart form autofill. Create professional invoices in under 3 minutes.',
    'landing.feature2.title': 'Privacy First',
    'landing.feature2.desc': 'All data stored on your device. No servers, no uploads. You own your data completely.',
    'landing.feature3.title': 'Multi-language',
    'landing.feature3.desc': 'Switch between languages seamlessly. Perfect for international business needs.',
    'landing.howItWorks.title': 'Three Steps to Invoice',
    'landing.step1.title': 'Add Info',
    'landing.step1.desc': 'Set up your company and customers',
    'landing.step2.title': 'Create Invoice',
    'landing.step2.desc': 'Select customer, add items, auto-calculate',
    'landing.step3.title': 'Export & Share',
    'landing.step3.desc': 'Generate PDF and send to clients',
    'landing.footer.privacy': 'Your data stays on your device',

    // Navigation
    'nav.invoice': 'Invoice',
    'nav.customers': 'Customers',
    'nav.products': 'Products',
    'nav.history': 'History',
    'nav.settings': 'Settings',

    // Common
    'common.add': 'Add',
    'common.edit': 'Edit',
    'common.delete': 'Delete',
    'common.save': 'Save',
    'common.cancel': 'Cancel',
    'common.confirm': 'Confirm',
    'common.search': 'Search',
    'common.all': 'All',
    'common.loading': 'Loading...',
    'common.noData': 'No data',
    'common.close': 'Close',
    'common.import': 'Import',
    'common.export': 'Export',

    // Invoice
    'invoice.title': 'Quick Invoice',
    'invoice.new': 'New Invoice',
    'invoice.seller': 'Seller',
    'invoice.buyer': 'Buyer',
    'invoice.items': 'Invoice Items',
    'invoice.addItem': 'Add Item',
    'invoice.manualAdd': 'Manual Add',
    'invoice.subtotal': 'Subtotal',
    'invoice.tax': 'Total Tax',
    'invoice.total': 'Grand Total',
    'invoice.paymentMethod': 'Payment Method',
    'invoice.remark': 'Remark',
    'invoice.saveDraft': 'Save Draft',
    'invoice.preview': 'Preview',
    'invoice.submit': 'Create Invoice',
    'invoice.number': 'Invoice No.',
    'invoice.selectCompany': 'Select Company',
    'invoice.selectCustomer': 'Click to select or search customer',
    'invoice.noCompany': 'Please add a company in settings first',
    'invoice.emptyItems': 'Click "Add Item" to select from products, or "Manual Add"',

    // Invoice Status
    'status.draft': 'Draft',
    'status.issued': 'Issued',
    'status.paid': 'Paid',
    'status.void': 'Void',

    // Customer
    'customer.title': 'Customer Management',
    'customer.add': 'Add Customer',
    'customer.name': 'Customer Name',
    'customer.taxNumber': 'Tax ID',
    'customer.contact': 'Contact Person',
    'customer.phone': 'Phone',
    'customer.email': 'Email',
    'customer.address': 'Address',
    'customer.bank': 'Bank',
    'customer.bankAccount': 'Bank Account',
    'customer.tags': 'Tags',
    'customer.empty': 'No customers',
    'customer.emptyHint': 'Add your first customer for quick invoicing',
    'customer.searchPlaceholder': 'Search by name, tax ID...',

    // Customer Tags
    'tag.vip': 'VIP',
    'tag.frequent': 'Frequent',
    'tag.followUp': 'Follow Up',
    'tag.new': 'New',

    // Product
    'product.title': 'Product Management',
    'product.add': 'Add Product',
    'product.name': 'Product Name',
    'product.category': 'Category',
    'product.unit': 'Unit',
    'product.price': 'Default Price',
    'product.taxRate': 'Tax Rate',
    'product.taxCode': 'Tax Code',
    'product.empty': 'No products',
    'product.emptyHint': 'Add products for quick selection when invoicing',
    'product.searchPlaceholder': 'Search product name...',
    'product.duplicate': 'Duplicate',

    // Product Categories
    'category.software': 'Software Service',
    'category.consulting': 'Consulting',
    'category.hardware': 'Hardware Sales',
    'category.design': 'Design Service',
    'category.other': 'Other',

    // History
    'history.title': 'Invoice History',
    'history.filter': 'Filter',
    'history.thisMonth': 'This Month',
    'history.monthAmount': 'Month Amount',
    'history.paidCount': 'Paid',
    'history.unpaidCount': 'Unpaid',
    'history.empty': 'No invoice records',
    'history.emptyHint': 'Your invoices will appear here',
    'history.searchPlaceholder': 'Search invoice no., customer...',
    'history.download': 'Download PDF',
    'history.print': 'Print',
    'history.sendEmail': 'Send Email',
    'history.copyNew': 'Copy as New',
    'history.markPaid': 'Mark as Paid',
    'history.markIssued': 'Mark as Issued',
    'history.markVoid': 'Void',

    // Settings
    'settings.title': 'Company Settings',
    'settings.company': 'Billing Company',
    'settings.companyHint': 'companies',
    'settings.addCompany': 'Add Company',
    'settings.editCompany': 'Edit Company',
    'settings.companyName': 'Company Name',
    'settings.shortCode': 'Short Code',
    'settings.shortCodeHint': 'Used for invoice number',
    'settings.logo': 'Logo',
    'settings.uploadLogo': 'Upload Logo',
    'settings.changeLogo': 'Change Logo',
    'settings.logoHint': 'JPG, PNG supported, max 500KB',
    'settings.setDefault': 'Set Default',
    'settings.default': 'Default',
    'settings.maxCompanies': 'Maximum 3 companies allowed',
    'settings.emptyCompany': 'Add Billing Company',
    'settings.emptyCompanyHint': 'Set up your company info including name, tax ID, bank account',

    // Data Management
    'data.title': 'Data Management',
    'data.export': 'Export Data',
    'data.exportHint': 'Backup all data to JSON file',
    'data.import': 'Import Data',
    'data.importHint': 'Restore data from JSON file',

    // About
    'about.title': 'About',
    'about.version': 'Version',
    'about.description': 'A simple and efficient invoicing tool. All data is stored locally for your privacy.',

    // Theme
    'theme.title': 'Theme',
    'theme.light': 'Light',
    'theme.dark': 'Dark',
    'theme.system': 'System',

    // Language
    'language.title': 'Language',

    // Delete Confirmation
    'delete.title': 'Confirm Delete',
    'delete.message': 'Are you sure? This action cannot be undone.',
    'delete.company': 'Delete this company? This action cannot be undone.',
    'delete.customer': 'Delete this customer? This action cannot be undone.',
    'delete.product': 'Delete this product? This action cannot be undone.',
    'delete.invoice': 'Delete this invoice? This action cannot be undone.',

    // Success Messages
    'success.draftSaved': 'Draft Saved',
    'success.invoiceCreated': 'Invoice Created',
    'success.continue': 'Continue',
    'success.viewHistory': 'View History',

    // Payment Methods
    'payment.bankTransfer': 'Bank Transfer',
    'payment.alipay': 'Alipay',
    'payment.wechat': 'WeChat Pay',
    'payment.cash': 'Cash',
    'payment.other': 'Other',

    // Units
    'unit.item': 'Item',
    'unit.time': 'Time',
    'unit.piece': 'Piece',
    'unit.set': 'Set',
    'unit.unit': 'Unit',
    'unit.device': 'Device',
    'unit.hour': 'Hour',
    'unit.day': 'Day',
    'unit.month': 'Month',
    'unit.year': 'Year',
  },
};

const I18nContext = createContext<I18nContextType | undefined>(undefined);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>('en');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const stored = localStorage.getItem('language') as Language | null;
    if (stored) {
      setLanguageState(stored);
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('language', lang);
  };

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  if (!mounted) {
    return <>{children}</>;
  }

  return (
    <I18nContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </I18nContext.Provider>
  );
}

// Default fallback for SSR/SSG
const defaultContext: I18nContextType = {
  language: 'zh',
  setLanguage: () => {},
  t: (key: string) => translations.zh[key] || key,
};

export function useI18n() {
  const context = useContext(I18nContext);
  // Return default context during SSR/SSG
  if (!context) {
    return defaultContext;
  }
  return context;
}
