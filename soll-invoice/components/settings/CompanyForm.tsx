'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { LogoUpload } from './LogoUpload';
import type { Company } from '@/lib/types';

interface CompanyFormProps {
  company?: Company;
  onSubmit: (data: Omit<Company, 'id' | 'invoiceCounter' | 'isDefault' | 'createdAt' | 'updatedAt'>) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export function CompanyForm({ company, onSubmit, onCancel, isLoading }: CompanyFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    shortCode: '',
    taxNumber: '',
    address: '',
    phone: '',
    bankName: '',
    bankAccount: '',
    logo: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (company) {
      setFormData({
        name: company.name,
        shortCode: company.shortCode,
        taxNumber: company.taxNumber,
        address: company.address,
        phone: company.phone,
        bankName: company.bankName,
        bankAccount: company.bankAccount,
        logo: company.logo || '',
      });
    }
  }, [company]);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = '请输入公司名称';
    }
    if (!formData.shortCode.trim()) {
      newErrors.shortCode = '请输入简码';
    } else if (formData.shortCode.length > 10) {
      newErrors.shortCode = '简码不能超过10个字符';
    }
    if (!formData.taxNumber.trim()) {
      newErrors.taxNumber = '请输入税号';
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

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <LogoUpload
        value={formData.logo}
        onChange={(logo) => setFormData((prev) => ({ ...prev, logo }))}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="sm:col-span-2">
          <Input
            label="公司全称"
            placeholder="请输入公司全称"
            value={formData.name}
            onChange={handleChange('name')}
            error={errors.name}
            required
          />
        </div>

        <Input
          label="简码"
          placeholder="如: SOLL"
          value={formData.shortCode}
          onChange={handleChange('shortCode')}
          error={errors.shortCode}
          hint="用于生成发票编号"
          required
        />

        <Input
          label="税号"
          placeholder="请输入纳税人识别号"
          value={formData.taxNumber}
          onChange={handleChange('taxNumber')}
          error={errors.taxNumber}
          required
        />

        <div className="sm:col-span-2">
          <Input
            label="地址"
            placeholder="请输入公司地址"
            value={formData.address}
            onChange={handleChange('address')}
          />
        </div>

        <Input
          label="电话"
          placeholder="请输入联系电话"
          value={formData.phone}
          onChange={handleChange('phone')}
        />

        <Input
          label="开户行"
          placeholder="请输入开户银行"
          value={formData.bankName}
          onChange={handleChange('bankName')}
        />

        <div className="sm:col-span-2">
          <Input
            label="银行账号"
            placeholder="请输入银行账号"
            value={formData.bankAccount}
            onChange={handleChange('bankAccount')}
          />
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
          {isLoading ? '保存中...' : company ? '保存修改' : '添加主体'}
        </Button>
      </div>
    </form>
  );
}
