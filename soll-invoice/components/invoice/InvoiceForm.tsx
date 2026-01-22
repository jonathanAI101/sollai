'use client';

import { useState } from 'react';
import { FileText, Save, Eye } from 'lucide-react';
import { CompanySelector } from './CompanySelector';
import { CustomerPicker } from './CustomerPicker';
import { ProductPicker } from './ProductPicker';
import { InvoiceItemRow } from './InvoiceItemRow';
import { InvoicePreview } from './InvoicePreview';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { useInvoiceStore, calculateInvoiceTotals } from '@/stores/invoiceStore';
import { PAYMENT_METHODS } from '@/lib/constants';
import { formatCurrency, generateId } from '@/lib/format';
import type { InvoiceItem, Invoice } from '@/lib/types';

interface InvoiceFormProps {
  onSuccess?: (invoice: Invoice) => void;
}

export function InvoiceForm({ onSuccess }: InvoiceFormProps) {
  const { createInvoice } = useInvoiceStore();

  const [companyId, setCompanyId] = useState('');
  const [customerId, setCustomerId] = useState('');
  const [items, setItems] = useState<InvoiceItem[]>([]);
  const [paymentMethod, setPaymentMethod] = useState('银行转账');
  const [remark, setRemark] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const totals = calculateInvoiceTotals(items);

  const handleAddItem = (item: InvoiceItem) => {
    setItems((prev) => [...prev, item]);
  };

  const handleUpdateItem = (index: number, updatedItem: InvoiceItem) => {
    setItems((prev) =>
      prev.map((item, i) => (i === index ? updatedItem : item))
    );
  };

  const handleRemoveItem = (index: number) => {
    setItems((prev) => prev.filter((_, i) => i !== index));
  };

  const handleAddManualItem = () => {
    const newItem: InvoiceItem = {
      id: generateId(),
      name: '',
      quantity: 1,
      unit: '项',
      price: 0,
      taxRate: 0.06,
      amount: 0,
      taxAmount: 0,
    };
    setItems((prev) => [...prev, newItem]);
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!companyId) {
      newErrors.company = '请选择开票主体';
    }
    if (!customerId) {
      newErrors.customer = '请选择客户';
    }
    if (items.length === 0) {
      newErrors.items = '请添加至少一个项目';
    }
    if (items.some((item) => !item.name.trim())) {
      newErrors.items = '请填写所有项目名称';
    }
    if (items.some((item) => item.quantity <= 0)) {
      newErrors.items = '项目数量必须大于0';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSaveDraft = async () => {
    if (!companyId) {
      setErrors({ company: '请选择开票主体' });
      return;
    }

    setIsSubmitting(true);
    const invoice = await createInvoice({
      companyId,
      customerId,
      items,
      ...totals,
      status: 'draft',
      paymentMethod,
      remark,
      issueDate: Date.now(),
    });
    setIsSubmitting(false);

    if (invoice) {
      resetForm();
      onSuccess?.(invoice);
    }
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    setIsSubmitting(true);
    const invoice = await createInvoice({
      companyId,
      customerId,
      items,
      ...totals,
      status: 'issued',
      paymentMethod,
      remark,
      issueDate: Date.now(),
    });
    setIsSubmitting(false);

    if (invoice) {
      resetForm();
      onSuccess?.(invoice);
    }
  };

  const resetForm = () => {
    setCustomerId('');
    setItems([]);
    setPaymentMethod('银行转账');
    setRemark('');
    setErrors({});
  };

  return (
    <div className="space-y-6">
      {/* Company Selector */}
      <section>
        <CompanySelector value={companyId} onChange={setCompanyId} />
        {errors.company && (
          <p className="mt-1 text-xs text-destructive">{errors.company}</p>
        )}
      </section>

      {/* Customer Picker */}
      <section>
        <CustomerPicker value={customerId} onChange={setCustomerId} />
        {errors.customer && (
          <p className="mt-1 text-xs text-destructive">{errors.customer}</p>
        )}
      </section>

      {/* Invoice Items */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-medium text-foreground">开票项目</h3>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleAddManualItem}
              className="text-xs text-muted-foreground hover:text-foreground"
            >
              手动添加
            </button>
            <ProductPicker onAdd={handleAddItem} />
          </div>
        </div>

        {items.length === 0 ? (
          <div className="p-6 bg-muted/30 rounded-lg border border-dashed border-border text-center">
            <FileText className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">
              点击"添加项目"从产品库选择，或"手动添加"
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {items.map((item, index) => (
              <InvoiceItemRow
                key={item.id}
                item={item}
                index={index}
                onChange={(updated) => handleUpdateItem(index, updated)}
                onRemove={() => handleRemoveItem(index)}
              />
            ))}
          </div>
        )}
        {errors.items && (
          <p className="mt-2 text-xs text-destructive">{errors.items}</p>
        )}
      </section>

      {/* Totals */}
      {items.length > 0 && (
        <section className="bg-card rounded-lg border border-border p-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">合计金额</span>
              <span className="tabular-nums">{formatCurrency(totals.subtotal)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">合计税额</span>
              <span className="tabular-nums">{formatCurrency(totals.totalTax)}</span>
            </div>
            <div className="flex justify-between text-lg font-semibold pt-2 border-t border-border">
              <span>价税合计</span>
              <span className="text-primary tabular-nums">{formatCurrency(totals.total)}</span>
            </div>
          </div>
        </section>
      )}

      {/* Payment Method */}
      <section>
        <label className="block text-sm font-medium text-foreground mb-2">
          付款方式
        </label>
        <div className="flex flex-wrap gap-2">
          {PAYMENT_METHODS.map((method) => (
            <button
              key={method}
              type="button"
              onClick={() => setPaymentMethod(method)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                paymentMethod === method
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
              }`}
            >
              {method}
            </button>
          ))}
        </div>
      </section>

      {/* Remark */}
      <section>
        <Input
          label="备注"
          placeholder="添加备注信息（选填）"
          value={remark}
          onChange={(e) => setRemark(e.target.value)}
        />
      </section>

      {/* Actions */}
      <section className="flex gap-3 pt-4 border-t border-border">
        <Button
          type="button"
          variant="outline"
          onClick={handleSaveDraft}
          disabled={isSubmitting || !companyId}
          className="flex-1"
        >
          <Save className="w-4 h-4" />
          保存草稿
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => setShowPreview(true)}
          disabled={items.length === 0}
        >
          <Eye className="w-4 h-4" />
          预览
        </Button>
        <Button
          type="button"
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="flex-1"
        >
          {isSubmitting ? '处理中...' : '确认开票'}
        </Button>
      </section>

      {/* Preview Modal */}
      <Modal
        isOpen={showPreview}
        onClose={() => setShowPreview(false)}
        title="发票预览"
        size="xl"
      >
        <InvoicePreview
          companyId={companyId}
          customerId={customerId}
          items={items}
          totals={totals}
          paymentMethod={paymentMethod}
          remark={remark}
        />
      </Modal>
    </div>
  );
}
