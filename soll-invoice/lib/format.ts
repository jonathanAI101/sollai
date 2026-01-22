// 格式化金额（人民币）
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('zh-CN', {
    style: 'currency',
    currency: 'CNY',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

// 格式化数字（千分位）
export function formatNumber(num: number, decimals: number = 2): string {
  return new Intl.NumberFormat('zh-CN', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(num);
}

// 格式化日期
export function formatDate(timestamp: number): string {
  return new Intl.DateTimeFormat('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(new Date(timestamp));
}

// 格式化日期时间
export function formatDateTime(timestamp: number): string {
  return new Intl.DateTimeFormat('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(timestamp));
}

// 生成发票编号
export function generateInvoiceNumber(shortCode: string, counter: number): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const seq = String(counter).padStart(4, '0');
  return `${shortCode}-${year}${month}-${seq}`;
}

// 生成唯一ID
export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

// 计算不含税金额
export function calculateAmount(quantity: number, price: number): number {
  return Math.round(quantity * price * 100) / 100;
}

// 计算税额
export function calculateTax(amount: number, taxRate: number): number {
  return Math.round(amount * taxRate * 100) / 100;
}

// 数字金额转中文大写
export function numberToChinese(num: number): string {
  if (num === 0) return '零元整';

  const digits = ['零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖'];
  const units = ['', '拾', '佰', '仟'];
  const bigUnits = ['', '万', '亿'];

  const numStr = Math.floor(num).toString();
  const decimal = Math.round((num - Math.floor(num)) * 100);

  let result = '';
  let zeroFlag = false;

  // 处理整数部分
  const groups = [];
  for (let i = numStr.length; i > 0; i -= 4) {
    groups.unshift(numStr.slice(Math.max(0, i - 4), i));
  }

  groups.forEach((group, groupIndex) => {
    let groupResult = '';
    let groupZeroFlag = false;

    for (let i = 0; i < group.length; i++) {
      const digit = parseInt(group[i]);
      const unitIndex = group.length - 1 - i;

      if (digit === 0) {
        groupZeroFlag = true;
      } else {
        if (groupZeroFlag || (zeroFlag && groupResult === '')) {
          groupResult += '零';
        }
        groupResult += digits[digit] + units[unitIndex];
        groupZeroFlag = false;
      }
    }

    if (groupResult) {
      result += groupResult + bigUnits[groups.length - 1 - groupIndex];
      zeroFlag = group[group.length - 1] === '0';
    } else {
      zeroFlag = true;
    }
  });

  result += '元';

  // 处理小数部分
  if (decimal === 0) {
    result += '整';
  } else {
    const jiao = Math.floor(decimal / 10);
    const fen = decimal % 10;

    if (jiao > 0) {
      result += digits[jiao] + '角';
    } else if (fen > 0) {
      result += '零';
    }

    if (fen > 0) {
      result += digits[fen] + '分';
    }
  }

  return result;
}
