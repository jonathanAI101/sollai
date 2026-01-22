'use client';

import { useState, useEffect, useMemo } from 'react';
import { User, Search, Plus, X } from 'lucide-react';
import { useCustomerStore } from '@/stores/customerStore';
import { Modal } from '@/components/ui/Modal';
import { CustomerForm } from '@/components/customer/CustomerForm';
import type { Customer } from '@/lib/types';

interface CustomerPickerProps {
  value?: string;
  onChange: (customerId: string) => void;
}

export function CustomerPicker({ value, onChange }: CustomerPickerProps) {
  const { customers, loadCustomers, addCustomer } = useCustomerStore();
  const [isOpen, setIsOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadCustomers();
  }, [loadCustomers]);

  const selectedCustomer = customers.find((c) => c.id === value);

  const filteredCustomers = useMemo(() => {
    if (!searchQuery) return customers.slice(0, 20);
    const query = searchQuery.toLowerCase();
    return customers.filter(
      (c) =>
        c.name.toLowerCase().includes(query) ||
        c.taxNumber.includes(searchQuery) ||
        c.contactPerson.toLowerCase().includes(query)
    ).slice(0, 20);
  }, [customers, searchQuery]);

  const handleSelect = (customer: Customer) => {
    onChange(customer.id);
    setIsOpen(false);
    setSearchQuery('');
  };

  const handleAddCustomer = async (data: Omit<Customer, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newCustomer = await addCustomer(data);
    if (newCustomer) {
      onChange(newCustomer.id);
      setIsAddModalOpen(false);
      setIsOpen(false);
    }
  };

  const handleClear = () => {
    onChange('');
  };

  return (
    <>
      <div className="space-y-1.5">
        <label className="block text-sm font-medium text-foreground">
          购买方
        </label>
        {selectedCustomer ? (
          <div className="flex items-center gap-3 p-3 bg-card border border-border rounded-lg">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
              <User className="w-4 h-4 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-foreground truncate">
                {selectedCustomer.name}
              </p>
              {selectedCustomer.taxNumber && (
                <p className="text-xs text-muted-foreground truncate">
                  税号: {selectedCustomer.taxNumber}
                </p>
              )}
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(true)}
              className="text-xs text-primary hover:underline"
            >
              更换
            </button>
            <button
              type="button"
              onClick={handleClear}
              className="p-1 hover:bg-secondary rounded"
            >
              <X className="w-4 h-4 text-muted-foreground" />
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setIsOpen(true)}
            className="w-full flex items-center gap-3 p-3 bg-card border border-dashed border-border rounded-lg hover:border-primary/50 transition-colors text-left"
          >
            <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
              <User className="w-4 h-4 text-muted-foreground" />
            </div>
            <span className="text-sm text-muted-foreground">
              点击选择或搜索客户
            </span>
          </button>
        )}
      </div>

      {/* Customer Selection Modal */}
      <Modal
        isOpen={isOpen}
        onClose={() => {
          setIsOpen(false);
          setSearchQuery('');
        }}
        title="选择客户"
        size="lg"
      >
        <div className="space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="搜索客户名称、税号..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-card border border-border rounded-lg text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              autoFocus
            />
          </div>

          {/* Add New Customer Button */}
          <button
            type="button"
            onClick={() => setIsAddModalOpen(true)}
            className="w-full flex items-center gap-2 p-3 border border-dashed border-border rounded-lg text-sm text-primary hover:bg-primary/5 transition-colors"
          >
            <Plus className="w-4 h-4" />
            添加新客户
          </button>

          {/* Customer List */}
          <div className="max-h-64 overflow-y-auto space-y-2">
            {filteredCustomers.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">
                {searchQuery ? '没有找到匹配的客户' : '暂无客户'}
              </p>
            ) : (
              filteredCustomers.map((customer) => (
                <button
                  key={customer.id}
                  type="button"
                  onClick={() => handleSelect(customer)}
                  className="w-full flex items-center gap-3 p-3 bg-card border border-border rounded-lg hover:border-primary/50 transition-colors text-left"
                >
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <User className="w-4 h-4 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-foreground truncate">
                      {customer.name}
                    </p>
                    {customer.taxNumber && (
                      <p className="text-xs text-muted-foreground truncate">
                        税号: {customer.taxNumber}
                      </p>
                    )}
                  </div>
                </button>
              ))
            )}
          </div>
        </div>
      </Modal>

      {/* Add Customer Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="添加客户"
        size="lg"
      >
        <CustomerForm
          onSubmit={handleAddCustomer}
          onCancel={() => setIsAddModalOpen(false)}
        />
      </Modal>
    </>
  );
}
