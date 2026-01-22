'use client';

import { useState, useEffect, useMemo } from 'react';
import { Plus, Users, Search } from 'lucide-react';
import { useCustomerStore } from '@/stores/customerStore';
import { CustomerCard } from './CustomerCard';
import { CustomerForm } from './CustomerForm';
import { CustomerImport } from './CustomerImport';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { CUSTOMER_TAGS } from '@/lib/constants';
import type { Customer } from '@/lib/types';

export function CustomerList() {
  const {
    customers,
    isLoading,
    error,
    loadCustomers,
    addCustomer,
    updateCustomer,
    deleteCustomer,
    importCustomers,
  } = useCustomerStore();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | undefined>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  useEffect(() => {
    loadCustomers();
  }, [loadCustomers]);

  const filteredCustomers = useMemo(() => {
    let result = customers;

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (c) =>
          c.name.toLowerCase().includes(query) ||
          c.taxNumber.includes(searchQuery) ||
          c.contactPerson.toLowerCase().includes(query)
      );
    }

    // Filter by tag
    if (selectedTag) {
      result = result.filter((c) => c.tags.includes(selectedTag));
    }

    return result;
  }, [customers, searchQuery, selectedTag]);

  const handleOpenModal = (customer?: Customer) => {
    setEditingCustomer(customer);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingCustomer(undefined);
  };

  const handleSubmit = async (data: Omit<Customer, 'id' | 'createdAt' | 'updatedAt'>) => {
    setIsSubmitting(true);

    if (editingCustomer) {
      await updateCustomer(editingCustomer.id, data);
    } else {
      await addCustomer(data);
    }

    setIsSubmitting(false);
    handleCloseModal();
  };

  const handleDelete = async (id: string) => {
    await deleteCustomer(id);
    setDeleteConfirm(null);
  };

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-card rounded-lg border border-border p-4 animate-pulse">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-muted" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-muted rounded w-1/3" />
                <div className="h-3 bg-muted rounded w-1/2" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <>
      {/* Search and Filter */}
      <div className="space-y-3 mb-4">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="搜索客户名称、税号..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-card border border-border rounded-lg text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <CustomerImport onImport={importCustomers} />
          <Button onClick={() => handleOpenModal()}>
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">添加</span>
          </Button>
        </div>

        {/* Tag Filter */}
        <div className="flex gap-2 overflow-x-auto pb-1">
          <button
            onClick={() => setSelectedTag(null)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
              selectedTag === null
                ? 'bg-primary text-primary-foreground'
                : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
            }`}
          >
            全部
          </button>
          {CUSTOMER_TAGS.map((tag) => (
            <button
              key={tag}
              onClick={() => setSelectedTag(tag)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                selectedTag === tag
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-destructive/10 border border-destructive/20 rounded-lg text-sm text-destructive">
          {error}
        </div>
      )}

      {/* Customer List */}
      {filteredCustomers.length === 0 ? (
        <div className="bg-card rounded-lg border border-border p-6">
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="w-14 h-14 rounded-full bg-muted flex items-center justify-center mb-4">
              <Users className="w-7 h-7 text-muted-foreground" />
            </div>
            <h3 className="text-base font-semibold text-foreground mb-2">
              {searchQuery || selectedTag ? '没有找到匹配的客户' : '暂无客户'}
            </h3>
            <p className="text-sm text-muted-foreground max-w-sm mb-4">
              {searchQuery || selectedTag
                ? '尝试调整搜索条件'
                : '添加您的第一个客户，方便快速开票'}
            </p>
            {!searchQuery && !selectedTag && (
              <Button onClick={() => handleOpenModal()}>
                <Plus className="w-4 h-4" />
                添加客户
              </Button>
            )}
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredCustomers.map((customer) => (
            <CustomerCard
              key={customer.id}
              customer={customer}
              onEdit={() => handleOpenModal(customer)}
              onDelete={() => setDeleteConfirm(customer.id)}
            />
          ))}
        </div>
      )}

      {/* Add/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingCustomer ? '编辑客户' : '添加客户'}
        size="lg"
      >
        <CustomerForm
          customer={editingCustomer}
          onSubmit={handleSubmit}
          onCancel={handleCloseModal}
          isLoading={isSubmitting}
        />
      </Modal>

      {/* Delete Confirmation */}
      <Modal
        isOpen={!!deleteConfirm}
        onClose={() => setDeleteConfirm(null)}
        title="确认删除"
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            确定要删除此客户吗？此操作无法撤销。
          </p>
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => setDeleteConfirm(null)}
              className="flex-1"
            >
              取消
            </Button>
            <Button
              variant="destructive"
              onClick={() => deleteConfirm && handleDelete(deleteConfirm)}
              className="flex-1"
            >
              确认删除
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}
