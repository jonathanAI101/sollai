// 开票主体 (Company)
export interface Company {
  id: string;
  name: string;           // 公司全称
  shortCode: string;      // 简码，用于发票编号
  taxNumber: string;      // 税号
  address: string;        // 地址
  phone: string;          // 电话
  bankName: string;       // 开户行
  bankAccount: string;    // 银行账号
  logo?: string;          // Logo base64
  invoiceCounter: number; // 发票计数器
  isDefault: boolean;     // 是否默认主体
  createdAt: number;
  updatedAt: number;
}

// 客户 (Customer)
export interface Customer {
  id: string;
  name: string;           // 公司名
  taxNumber: string;      // 税号
  address: string;        // 地址
  phone: string;          // 电话
  bankName: string;       // 开户行
  bankAccount: string;    // 银行账号
  contactPerson: string;  // 联系人
  email: string;          // 邮箱
  tags: string[];         // 标签: VIP, 常用, 待跟进
  createdAt: number;
  updatedAt: number;
}

// 产品/服务 (Product)
export interface Product {
  id: string;
  name: string;           // 名称
  category: ProductCategory; // 分类
  unit: string;           // 单位
  price: number;          // 默认单价
  taxRate: TaxRate;       // 默认税率
  taxCode: string;        // 商品编码
  createdAt: number;
  updatedAt: number;
}

// 发票项目
export interface InvoiceItem {
  id: string;
  productId?: string;     // 关联产品ID（可选，手动输入时为空）
  name: string;
  quantity: number;
  unit: string;
  price: number;
  taxRate: TaxRate;
  amount: number;         // 金额(不含税)
  taxAmount: number;      // 税额
}

// 发票状态
export type InvoiceStatus = 'draft' | 'issued' | 'paid' | 'void';

// 发票 (Invoice)
export interface Invoice {
  id: string;
  invoiceNumber: string;  // 发票编号: SOLL-202501-0001
  companyId: string;      // 开票主体ID
  customerId: string;     // 客户ID
  items: InvoiceItem[];
  subtotal: number;       // 合计金额(不含税)
  totalTax: number;       // 合计税额
  total: number;          // 价税合计
  status: InvoiceStatus;
  paymentMethod: string;  // 付款方式
  remark: string;         // 备注
  issueDate: number;      // 开票日期
  createdAt: number;
  updatedAt: number;
}

// 税率类型
export type TaxRate = 0.13 | 0.09 | 0.06 | 0.03 | 0.01 | 0;

// 产品分类
export type ProductCategory =
  | '软件服务'
  | '技术咨询'
  | '硬件销售'
  | '设计服务'
  | '其他';

// 客户标签
export type CustomerTag = 'VIP' | '常用' | '待跟进' | '新客户';

// 付款方式
export type PaymentMethod =
  | '银行转账'
  | '支付宝'
  | '微信支付'
  | '现金'
  | '其他';
