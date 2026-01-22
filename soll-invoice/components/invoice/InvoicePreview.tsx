'use client';

import { useCompanyStore } from '@/stores/companyStore';
import { useCustomerStore } from '@/stores/customerStore';
import { formatCurrency, formatDate, numberToChinese } from '@/lib/format';
import { TAX_RATES } from '@/lib/constants';
import type { InvoiceItem } from '@/lib/types';

interface InvoicePreviewProps {
  companyId: string;
  customerId: string;
  items: InvoiceItem[];
  totals: {
    subtotal: number;
    totalTax: number;
    total: number;
  };
  paymentMethod: string;
  remark: string;
  invoiceNumber?: string;
}

export function InvoicePreview({
  companyId,
  customerId,
  items,
  totals,
  paymentMethod,
  remark,
  invoiceNumber,
}: InvoicePreviewProps) {
  const { companies } = useCompanyStore();
  const { customers } = useCustomerStore();

  const company = companies.find((c) => c.id === companyId);
  const customer = customers.find((c) => c.id === customerId);

  return (
    <div className="bg-white text-black p-6 rounded-lg" id="invoice-preview">
      {/* Header */}
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold mb-2">
          {company?.name || '开票主体'}
        </h1>
        <h2 className="text-xl text-gray-600">销售清单</h2>
        {invoiceNumber && (
          <p className="text-sm text-gray-500 mt-2">
            发票编号: {invoiceNumber}
          </p>
        )}
      </div>

      {/* Company & Customer Info */}
      <div className="grid grid-cols-2 gap-6 mb-6 text-sm">
        {/* Seller Info */}
        <div className="space-y-1">
          <h3 className="font-semibold text-gray-800 mb-2">销售方</h3>
          <p>名称: {company?.name || '-'}</p>
          <p>税号: {company?.taxNumber || '-'}</p>
          <p>地址: {company?.address || '-'}</p>
          <p>电话: {company?.phone || '-'}</p>
          <p>开户行: {company?.bankName || '-'}</p>
          <p>账号: {company?.bankAccount || '-'}</p>
        </div>

        {/* Buyer Info */}
        <div className="space-y-1">
          <h3 className="font-semibold text-gray-800 mb-2">购买方</h3>
          <p>名称: {customer?.name || '-'}</p>
          <p>税号: {customer?.taxNumber || '-'}</p>
          <p>地址: {customer?.address || '-'}</p>
          <p>电话: {customer?.phone || '-'}</p>
          <p>开户行: {customer?.bankName || '-'}</p>
          <p>账号: {customer?.bankAccount || '-'}</p>
        </div>
      </div>

      {/* Items Table */}
      <div className="mb-6">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 px-2 py-2 text-left">项目名称</th>
              <th className="border border-gray-300 px-2 py-2 text-center w-16">数量</th>
              <th className="border border-gray-300 px-2 py-2 text-center w-12">单位</th>
              <th className="border border-gray-300 px-2 py-2 text-right w-24">单价</th>
              <th className="border border-gray-300 px-2 py-2 text-center w-14">税率</th>
              <th className="border border-gray-300 px-2 py-2 text-right w-24">金额</th>
              <th className="border border-gray-300 px-2 py-2 text-right w-24">税额</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, index) => {
              const taxLabel = TAX_RATES.find((r) => r.value === item.taxRate)?.label || '';
              return (
                <tr key={item.id || index}>
                  <td className="border border-gray-300 px-2 py-2">{item.name}</td>
                  <td className="border border-gray-300 px-2 py-2 text-center tabular-nums">
                    {item.quantity}
                  </td>
                  <td className="border border-gray-300 px-2 py-2 text-center">
                    {item.unit}
                  </td>
                  <td className="border border-gray-300 px-2 py-2 text-right tabular-nums">
                    {formatCurrency(item.price)}
                  </td>
                  <td className="border border-gray-300 px-2 py-2 text-center">
                    {taxLabel}
                  </td>
                  <td className="border border-gray-300 px-2 py-2 text-right tabular-nums">
                    {formatCurrency(item.amount)}
                  </td>
                  <td className="border border-gray-300 px-2 py-2 text-right tabular-nums">
                    {formatCurrency(item.taxAmount)}
                  </td>
                </tr>
              );
            })}
          </tbody>
          <tfoot>
            <tr className="font-semibold bg-gray-50">
              <td className="border border-gray-300 px-2 py-2" colSpan={5}>
                合计
              </td>
              <td className="border border-gray-300 px-2 py-2 text-right tabular-nums">
                {formatCurrency(totals.subtotal)}
              </td>
              <td className="border border-gray-300 px-2 py-2 text-right tabular-nums">
                {formatCurrency(totals.totalTax)}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>

      {/* Total */}
      <div className="mb-6 p-4 bg-gray-50 rounded">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm text-gray-600">价税合计（大写）</p>
            <p className="font-semibold">{numberToChinese(totals.total)}</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-600">价税合计（小写）</p>
            <p className="text-2xl font-bold text-blue-600 tabular-nums">
              {formatCurrency(totals.total)}
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="grid grid-cols-3 gap-4 text-sm text-gray-600">
        <div>
          <p>付款方式: {paymentMethod}</p>
        </div>
        <div>
          <p>开票日期: {formatDate(Date.now())}</p>
        </div>
        <div>
          {remark && <p>备注: {remark}</p>}
        </div>
      </div>
    </div>
  );
}
