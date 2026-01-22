'use client';

import { useState, useEffect } from 'react';
import { Plus, Building2 } from 'lucide-react';
import { useCompanyStore } from '@/stores/companyStore';
import { CompanyCard } from './CompanyCard';
import { CompanyForm } from './CompanyForm';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { MAX_COMPANIES } from '@/lib/constants';
import type { Company } from '@/lib/types';

export function CompanyList() {
  const {
    companies,
    isLoading,
    error,
    loadCompanies,
    addCompany,
    updateCompany,
    deleteCompany,
    setDefaultCompany,
  } = useCompanyStore();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCompany, setEditingCompany] = useState<Company | undefined>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  useEffect(() => {
    loadCompanies();
  }, [loadCompanies]);

  const handleOpenModal = (company?: Company) => {
    setEditingCompany(company);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingCompany(undefined);
  };

  const handleSubmit = async (data: Omit<Company, 'id' | 'invoiceCounter' | 'isDefault' | 'createdAt' | 'updatedAt'>) => {
    setIsSubmitting(true);

    if (editingCompany) {
      await updateCompany(editingCompany.id, data);
    } else {
      await addCompany(data);
    }

    setIsSubmitting(false);
    handleCloseModal();
  };

  const handleDelete = async (id: string) => {
    await deleteCompany(id);
    setDeleteConfirm(null);
  };

  const canAddMore = companies.length < MAX_COMPANIES;

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[1, 2].map((i) => (
          <div key={i} className="bg-card rounded-lg border border-border p-4 animate-pulse">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg bg-muted" />
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
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-base font-semibold text-foreground">开票主体</h2>
          <p className="text-sm text-muted-foreground">
            {companies.length}/{MAX_COMPANIES} 个主体
          </p>
        </div>
        {canAddMore && (
          <Button size="sm" onClick={() => handleOpenModal()}>
            <Plus className="w-4 h-4" />
            添加主体
          </Button>
        )}
      </div>

      {error && (
        <div className="mb-4 p-3 bg-destructive/10 border border-destructive/20 rounded-lg text-sm text-destructive">
          {error}
        </div>
      )}

      {companies.length === 0 ? (
        <div className="bg-card rounded-lg border border-border p-6">
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="w-14 h-14 rounded-full bg-muted flex items-center justify-center mb-4">
              <Building2 className="w-7 h-7 text-muted-foreground" />
            </div>
            <h3 className="text-base font-semibold text-foreground mb-2">
              添加开票主体
            </h3>
            <p className="text-sm text-muted-foreground max-w-sm mb-4">
              设置您的公司信息，包括名称、税号、银行账户等
            </p>
            <Button onClick={() => handleOpenModal()}>
              <Plus className="w-4 h-4" />
              添加开票主体
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {companies.map((company) => (
            <CompanyCard
              key={company.id}
              company={company}
              onEdit={() => handleOpenModal(company)}
              onDelete={() => setDeleteConfirm(company.id)}
              onSetDefault={() => setDefaultCompany(company.id)}
            />
          ))}
        </div>
      )}

      {/* Add/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingCompany ? '编辑开票主体' : '添加开票主体'}
        size="lg"
      >
        <CompanyForm
          company={editingCompany}
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
            确定要删除此开票主体吗？此操作无法撤销。
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
