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
    'landing.badge': 'AI 达人营销平台',
    'landing.hero.title': '让全球达人为你带货',
    'landing.hero.subtitle': 'AI 自动匹配达人、管理合作、追踪效果。从找人到出单，一个平台全搞定。',
    'landing.cta.start': '免费试用',
    'landing.cta.learn': '看看案例',
    'landing.cta.title': '你的下一个爆款，可能就差一个对的达人',
    'landing.cta.subtitle': '让 AI 帮你找到他。',
    'landing.trust.ai': '100万+ 达人库',
    'landing.trust.global': '覆盖 50+ 国家',
    'landing.trust.fast': 'AI 智能匹配',
    'landing.social.title': '已有品牌通过 SollAI 合作达人',
    'landing.social.brands': '个品牌',
    'landing.social.campaigns': '次达人合作',
    'landing.social.countries': '个国家',
    'landing.social.roi': '平均 ROI',
    'landing.features.title': '达人营销的四大难题，AI 帮你解决',
    'landing.feature1.title': '找不到合适的达人？',
    'landing.feature1.desc': '100万+ 全球达人库，AI 根据品牌调性、受众画像、历史表现智能匹配，精准找到带货王。',
    'landing.feature2.title': '沟通管理太累？',
    'landing.feature2.desc': '批量邀约、合同管理、内容审核、佣金结算，一个后台全搞定。从 1 个达人到 1000 个，效率不变。',
    'landing.feature3.title': '效果难追踪？',
    'landing.feature3.desc': '每个达人带来多少点击、转化、销售额，实时可见。用数据说话，只为效果付费。',
    'landing.feature4.title': '线下活动也能玩转',
    'landing.feature4.desc': '快闪店、品牌活动、行业展会，AI 帮你匹配本地达人到场助阵，线上线下流量联动。',
    'landing.howItWorks.title': '三步开启达人营销',
    'landing.step1.title': '发布需求',
    'landing.step1.desc': '告诉 AI 你的产品和目标',
    'landing.step2.title': 'AI 匹配',
    'landing.step2.desc': '智能推荐最合适的达人',
    'landing.step3.title': '合作出单',
    'landing.step3.desc': '达人带货，你坐等收钱',
    'landing.footer.privacy': 'SollAI · AI 驱动的全球达人营销平台',

    // Navigation
    'nav.dashboard': '仪表盘',
    'nav.creators': '达人',
    'nav.merchants': '商家',
    'nav.invoice': '发票',
    'nav.settlement': '结算',
    'nav.settings': '设置',

    // Dashboard
    'dashboard.title': '仪表盘',
    'dashboard.totalCreators': '达人总数',
    'dashboard.totalMerchants': '商家总数',
    'dashboard.pendingInvoices': '待处理发票',
    'dashboard.monthlyRevenue': '本月收入',
    'dashboard.recentActivity': '最近活动',
    'dashboard.upcomingEvents': '即将进行',
    'dashboard.noActivity': '暂无活动',
    'dashboard.noEvents': '暂无事件',

    // Creators
    'creators.title': '达人管理',
    'creators.add': '添加达人',
    'creators.searchPlaceholder': '搜索达人名称、账号...',
    'creators.name': '达人',
    'creators.platform': '平台',
    'creators.followers': '粉丝数',
    'creators.category': '类目',
    'creators.status': '状态',

    // Merchants
    'merchants.title': '商家管理',
    'merchants.add': '添加商家',
    'merchants.searchPlaceholder': '搜索商家名称...',
    'merchants.campaigns': '个活动',

    // Settlement
    'settlement.title': '结算管理',
    'settlement.totalPaid': '已结算',
    'settlement.pending': '待结算',
    'settlement.processing': '处理中',
    'settlement.creator': '达人',
    'settlement.campaign': '活动',
    'settlement.amount': '金额',
    'settlement.date': '日期',
    'settlement.status': '状态',

    // Common
    'common.add': '添加',
    'common.filter': '筛选',
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
    'invoice.title': '发票管理',
    'invoice.create': '创建发票',
    'invoice.searchPlaceholder': '搜索发票号、达人、商家...',
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
    'invoice.creator': '达人',
    'invoice.merchant': '商家',
    'invoice.campaign': '活动',
    'invoice.description': '描述',
    'invoice.descriptionPlaceholder': '服务描述...',
    'invoice.amount': '金额',
    'invoice.dueDate': '到期日',
    'invoice.currency': '货币',
    'invoice.selectCreator': '选择达人...',
    'invoice.selectMerchant': '选择商家...',
    'invoice.campaignPlaceholder': '活动名称...',
    'invoice.remarkPlaceholder': '备注（可选）...',
    'invoice.status': '状态',
    'invoice.actions': '操作',
    'invoice.selectCompany': '选择开票主体',
    'invoice.selectCustomer': '点击选择或搜索客户',
    'invoice.noCompany': '请先在设置中添加开票主体',
    'invoice.emptyItems': '点击"添加项目"从产品库选择，或"手动添加"',

    // Invoice Stats
    'invoice.stats.total': '总金额',
    'invoice.stats.paid': '已支付',
    'invoice.stats.pending': '待处理',
    'invoice.stats.overdue': '已逾期',

    // Invoice PDF
    'invoice.from': '开票方',
    'invoice.to': '开票给',
    'invoice.billTo': '开票给',
    'invoice.address': '地址',
    'invoice.city': '城市',
    'invoice.quantity': '数量',
    'invoice.rate': '单价',
    'invoice.paidToDate': '已付',
    'invoice.balance': '余额',
    'invoice.notes': '发票备注',
    'invoice.issueDate': '开票日期',
    'invoice.downloadPdf': '下载 PDF',

    // Invoice Status
    'invoice.status.paid': '已支付',
    'invoice.status.pending': '待处理',
    'invoice.status.overdue': '已逾期',
    'invoice.status.draft': '草稿',
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
    'customer.emptyHint': '添加您的第一个客户',
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
    'about.description': 'AI 驱动的全球达人营销平台，帮助品牌连接全球创作者，实现营销目标。',

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
    'landing.badge': 'AI Influencer Marketing',
    'landing.hero.title': 'Let Global Creators Sell for You',
    'landing.hero.subtitle': 'AI matches creators, manages partnerships, tracks performance. From discovery to sales, all in one platform.',
    'landing.cta.start': 'Start Free',
    'landing.cta.learn': 'See Case Studies',
    'landing.cta.title': 'Your next viral product is one creator away',
    'landing.cta.subtitle': 'Let AI find them for you.',
    'landing.trust.ai': '1M+ Creator Database',
    'landing.trust.global': '50+ Countries',
    'landing.trust.fast': 'AI Smart Matching',
    'landing.social.title': 'Brands already using SollAI',
    'landing.social.brands': 'Brands',
    'landing.social.campaigns': 'Creator Collabs',
    'landing.social.countries': 'Countries',
    'landing.social.roi': 'Avg ROI',
    'landing.features.title': 'Four Creator Marketing Challenges, Solved by AI',
    'landing.feature1.title': "Can't find the right creators?",
    'landing.feature1.desc': '1M+ global creators. AI matches based on brand fit, audience, past performance. Find your perfect partner instantly.',
    'landing.feature2.title': 'Managing creators is exhausting?',
    'landing.feature2.desc': 'Outreach, contracts, content review, payments — all in one place. Scale from 1 to 1000 creators without extra effort.',
    'landing.feature3.title': 'Hard to track results?',
    'landing.feature3.desc': 'See clicks, conversions, sales from each creator in real-time. Data-driven decisions, pay only for results.',
    'landing.feature4.title': 'Offline events? We got you.',
    'landing.feature4.desc': 'Pop-ups, brand events, trade shows — AI matches local creators to join on-site. Connect online and offline traffic.',
    'landing.howItWorks.title': 'Start Creator Marketing in 3 Steps',
    'landing.step1.title': 'Post Brief',
    'landing.step1.desc': 'Tell AI your product and goals',
    'landing.step2.title': 'AI Matches',
    'landing.step2.desc': 'Get recommended creators instantly',
    'landing.step3.title': 'Creators Sell',
    'landing.step3.desc': 'They promote, you collect revenue',
    'landing.footer.privacy': 'SollAI · AI-Powered Global Creator Marketing Platform',

    // Navigation
    'nav.dashboard': 'Dashboard',
    'nav.creators': 'Creators',
    'nav.merchants': 'Merchants',
    'nav.invoice': 'Invoice',
    'nav.settlement': 'Settlement',
    'nav.settings': 'Settings',

    // Dashboard
    'dashboard.title': 'Dashboard',
    'dashboard.totalCreators': 'Total Creators',
    'dashboard.totalMerchants': 'Total Merchants',
    'dashboard.pendingInvoices': 'Pending Invoices',
    'dashboard.monthlyRevenue': 'Monthly Revenue',
    'dashboard.recentActivity': 'Recent Activity',
    'dashboard.upcomingEvents': 'Upcoming Events',
    'dashboard.noActivity': 'No activity yet',
    'dashboard.noEvents': 'No events yet',

    // Creators
    'creators.title': 'Creator Management',
    'creators.add': 'Add Creator',
    'creators.searchPlaceholder': 'Search by name, handle...',
    'creators.name': 'Creator',
    'creators.platform': 'Platform',
    'creators.followers': 'Followers',
    'creators.category': 'Category',
    'creators.status': 'Status',

    // Merchants
    'merchants.title': 'Merchant Management',
    'merchants.add': 'Add Merchant',
    'merchants.searchPlaceholder': 'Search merchant name...',
    'merchants.campaigns': 'campaigns',

    // Settlement
    'settlement.title': 'Settlement',
    'settlement.totalPaid': 'Total Paid',
    'settlement.pending': 'Pending',
    'settlement.processing': 'Processing',
    'settlement.creator': 'Creator',
    'settlement.campaign': 'Campaign',
    'settlement.amount': 'Amount',
    'settlement.date': 'Date',
    'settlement.status': 'Status',

    // Common
    'common.add': 'Add',
    'common.filter': 'Filter',
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
    'invoice.title': 'Invoice Management',
    'invoice.create': 'Create Invoice',
    'invoice.searchPlaceholder': 'Search invoice, creator, merchant...',
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
    'invoice.creator': 'Creator',
    'invoice.merchant': 'Merchant',
    'invoice.campaign': 'Campaign',
    'invoice.description': 'Description',
    'invoice.descriptionPlaceholder': 'Service description...',
    'invoice.amount': 'Amount',
    'invoice.dueDate': 'Due Date',
    'invoice.currency': 'Currency',
    'invoice.selectCreator': 'Select creator...',
    'invoice.selectMerchant': 'Select merchant...',
    'invoice.campaignPlaceholder': 'Campaign name...',
    'invoice.remarkPlaceholder': 'Optional notes...',
    'invoice.status': 'Status',
    'invoice.actions': 'Actions',
    'invoice.selectCompany': 'Select Company',
    'invoice.selectCustomer': 'Click to select or search customer',
    'invoice.noCompany': 'Please add a company in settings first',
    'invoice.emptyItems': 'Click "Add Item" to select from products, or "Manual Add"',

    // Invoice Stats
    'invoice.stats.total': 'Total Amount',
    'invoice.stats.paid': 'Paid',
    'invoice.stats.pending': 'Pending',
    'invoice.stats.overdue': 'Overdue',

    // Invoice PDF
    'invoice.from': 'From',
    'invoice.to': 'To',
    'invoice.billTo': 'Bill To',
    'invoice.address': 'Address',
    'invoice.city': 'City',
    'invoice.quantity': 'Quantity',
    'invoice.rate': 'Rate',
    'invoice.paidToDate': 'Paid to Date',
    'invoice.balance': 'Balance',
    'invoice.notes': 'Invoice Note',
    'invoice.issueDate': 'Issue Date',
    'invoice.downloadPdf': 'Download PDF',

    // Invoice Status
    'invoice.status.paid': 'Paid',
    'invoice.status.pending': 'Pending',
    'invoice.status.overdue': 'Overdue',
    'invoice.status.draft': 'Draft',
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
    'customer.emptyHint': 'Add your first customer',
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
    'about.description': 'AI-powered global creator marketing platform, helping brands connect with creators worldwide.',

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
