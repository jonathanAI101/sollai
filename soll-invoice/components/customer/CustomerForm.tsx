'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { CUSTOMER_TAGS } from '@/lib/constants';
import type { Customer, CustomerTag } from '@/lib/types';

interface CustomerFormProps {
  customer?: Customer;
  onSubmit: (data: Omit<Customer, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export function CustomerForm({ customer, onSubmit, onCancel, isLoading }: CustomerFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    taxNumber: '',
    address: '',
    phone: '',
    bankName: '',
    bankAccount: '',
    contactPerson: '',
    email: '',
    tags: [] as string[],
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (customer) {
      setFormData({
        name: customer.name,
        taxNumber: customer.taxNumber,
        address: customer.address,
        phone: customer.phone,
        bankName: customer.bankName,
        bankAccount: customer.bankAccount,
        contactPerson: customer.contactPerson,
        email: customer.email,
        tags: customer.tags,
      });
    }
  }, [customer]);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = '请输入客户名称';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onSubmit(formData);
    }
  };

  const handleChange = (field: keyof typeof formData) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  const toggleTag = (tag: CustomerTag) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.includes(tag)
        ? prev.tags.filter((t) => t !== tag)
        : [...prev.tags, tag],
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="sm:col-span-2">
          <Input
            label="客户名称"
            placeholder="请输入客户/公司名称"
            value={formData.name}
            onChange={handleChange('name')}
            error={errors.name}
            required
          />
        </div>

        <Input
          label="税号"
          placeholder="请输入纳税人识别号"
          value={formData.taxNumber}
          onChange={handleChange('taxNumber')}
        />

        <Input
          label="联系人"
          placeholder="请输入联系人姓名"
          value={formData.contactPerson}
          onChange={handleChange('contactPerson')}
        />

        <Input
          label="联系电话"
          placeholder="请输入联系电话"
          value={formData.phone}
          onChange={handleChange('phone')}
        />

        <Input
          label="邮箱"
          type="email"
          placeholder="请输入邮箱地址"
          value={formData.email}
          onChange={handleChange('email')}
        />

        <div className="sm:col-span-2">
          <Input
            label="地址"
            placeholder="请输入客户地址"
            value={formData.address}
            onChange={handleChange('address')}
          />
        </div>

        <Input
          label="开户行"
          placeholder="请输入开户银行"
          value={formData.bankName}
          onChange={handleChange('bankName')}
        />

        <Input
          label="银行账号"
          placeholder="请输入银行账号"
          value={formData.bankAccount}
          onChange={handleChange('bankAccount')}
        />

        {/* Tags */}
        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-foreground mb-2">
            标签
          </label>
          <div className="flex flex-wrap gap-2">
            {CUSTOMER_TAGS.map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => toggleTag(tag)}
                className={`
                  px-3 py-1.5 rounded-lg text-sm font-medium transition-colors
                  ${formData.tags.includes(tag)
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'}
                `}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex gap-3 pt-2">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          className="flex-1"
        >
          取消
        </Button>
        <Button
          type="submit"
          disabled={isLoading}
          className="flex-1"
        >
          {isLoading ? '保存中...' : customer ? '保存修改' : '添加客户'}
        </Button>
      </div>
    </form>
  );
}
