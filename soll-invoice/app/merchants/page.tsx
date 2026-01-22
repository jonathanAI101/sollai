'use client';

import { useState, useEffect } from 'react';
import { Layout, Header } from '@/components/layout';
import { useI18n } from '@/lib/i18n';
import { Button } from '@/components/ui/Button';
import { Plus, Search, Filter, Building2, Globe, X, Eye, Trash2, Mail, Phone, Pencil } from 'lucide-react';
import { db, type Tables } from '@/lib/supabase/hooks';

type Merchant = Tables<'merchants'>;

export default function MerchantsPage() {
  const { t } = useI18n();
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'pending'>('all');
  const [selectedMerchant, setSelectedMerchant] = useState<Merchant | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingMerchant, setEditingMerchant] = useState<Merchant | null>(null);
  const [merchants, setMerchants] = useState<Merchant[]>([]);
  const [loading, setLoading] = useState(true);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    country: '',
    email: '',
    phone: '',
    website: '',
    address: '',
    city: '',
    postalCode: '',
    taxId: '',
  });

  // Fetch merchants from Supabase
  useEffect(() => {
    fetchMerchants();
  }, []);

  const fetchMerchants = async () => {
    try {
      setLoading(true);
      const data = await db.merchants.getAll();
      setMerchants(data);
    } catch (error) {
      console.error('Failed to fetch merchants:', error);
    } finally {
      setLoading(false);
    }
  };

  // Filter merchants
  const filteredMerchants = merchants.filter(merchant => {
    const matchesSearch = searchQuery === '' ||
      merchant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      merchant.country.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'all' || merchant.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const handleAddMerchant = async () => {
    if (!formData.name) return;

    try {
      await db.merchants.create({
        name: formData.name,
        country: formData.country || 'Unknown',
        status: 'pending',
        email: formData.email || null,
        phone: formData.phone || null,
        website: formData.website || null,
        address: formData.address || null,
        city: formData.city || null,
        postal_code: formData.postalCode || null,
        tax_id: formData.taxId || null,
      });

      setShowAddModal(false);
      setFormData({ name: '', country: '', email: '', phone: '', website: '', address: '', city: '', postalCode: '', taxId: '' });
      fetchMerchants();
    } catch (error) {
      console.error('Failed to add merchant:', error);
    }
  };

  const handleDeleteMerchant = async (id: string) => {
    try {
      await db.merchants.delete(id);
      setShowDetailModal(false);
      fetchMerchants();
    } catch (error) {
      console.error('Failed to delete merchant:', error);
    }
  };

  const handleViewMerchant = (merchant: Merchant) => {
    setSelectedMerchant(merchant);
    setShowDetailModal(true);
  };

  const handleEditMerchant = (merchant: Merchant) => {
    setEditingMerchant(merchant);
    setFormData({
      name: merchant.name,
      country: merchant.country,
      email: merchant.email || '',
      phone: merchant.phone || '',
      website: merchant.website || '',
      address: merchant.address || '',
      city: merchant.city || '',
      postalCode: merchant.postal_code || '',
      taxId: merchant.tax_id || '',
    });
    setShowDetailModal(false);
    setShowEditModal(true);
  };

  const handleSaveEdit = async () => {
    if (!editingMerchant || !formData.name) return;

    try {
      await db.merchants.update(editingMerchant.id, {
        name: formData.name,
        country: formData.country || 'Unknown',
        email: formData.email || null,
        phone: formData.phone || null,
        website: formData.website || null,
        address: formData.address || null,
        city: formData.city || null,
        postal_code: formData.postalCode || null,
        tax_id: formData.taxId || null,
      });

      setShowEditModal(false);
      setEditingMerchant(null);
      setFormData({ name: '', country: '', email: '', phone: '', website: '', address: '', city: '', postalCode: '', taxId: '' });
      fetchMerchants();
    } catch (error) {
      console.error('Failed to update merchant:', error);
    }
  };

  return (
    <Layout>
      <Header
        title={t('merchants.title')}
        action={
          <Button size="sm" onClick={() => setShowAddModal(true)}>
            <Plus className="w-4 h-4" />
            {t('merchants.add')}
          </Button>
        }
      />

      <div className="p-4 md:p-6 space-y-4">
        {/* Search & Filter */}
        <div className="flex gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder={t('merchants.searchPlaceholder')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-secondary border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div className="relative">
            <Button variant="outline" size="sm" onClick={() => setShowFilterMenu(!showFilterMenu)}>
              <Filter className="w-4 h-4" />
              {t('common.filter')}
            </Button>
            {showFilterMenu && (
              <div className="absolute right-0 top-full mt-2 w-48 bg-card border border-border rounded-lg shadow-lg z-10 p-2">
                <p className="text-xs font-medium text-muted-foreground px-2 py-1">{t('creators.status')}</p>
                {['all', 'active', 'pending'].map((status) => (
                  <button
                    key={status}
                    onClick={() => { setStatusFilter(status as typeof statusFilter); setShowFilterMenu(false); }}
                    className={`w-full text-left px-2 py-1.5 text-sm rounded ${statusFilter === status ? 'bg-primary/10 text-primary' : 'hover:bg-secondary'}`}
                  >
                    {status === 'all' ? t('common.all') : status}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="text-center py-8 text-muted-foreground">Loading...</div>
        ) : (
          /* Merchants Grid */
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredMerchants.map((merchant) => (
              <div
                key={merchant.id}
                className="p-4 bg-card rounded-xl border border-border hover:border-primary/50 transition-colors cursor-pointer"
                onClick={() => handleViewMerchant(merchant)}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Building2 className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                      merchant.status === 'active'
                        ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                        : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                    }`}>
                      {merchant.status}
                    </span>
                    <button
                      onClick={(e) => { e.stopPropagation(); handleDeleteMerchant(merchant.id); }}
                      className="p-1 hover:bg-secondary rounded transition-colors"
                    >
                      <Trash2 className="w-4 h-4 text-muted-foreground hover:text-red-500" />
                    </button>
                  </div>
                </div>
                <h3 className="font-semibold text-foreground mb-3">{merchant.name}</h3>
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-1 text-muted-foreground">
                    <Globe className="w-3.5 h-3.5" />
                    {merchant.country}
                  </span>
                  <span className="text-foreground font-medium">{merchant.campaigns} {t('merchants.campaigns')}</span>
                </div>
              </div>
            ))}
            {filteredMerchants.length === 0 && (
              <div className="col-span-full text-center py-8 text-muted-foreground">
                {t('common.noData')}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Add Merchant Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowAddModal(false)} />
          <div className="relative bg-card border border-border rounded-xl shadow-xl w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-4 border-b border-border sticky top-0 bg-card">
              <h2 className="text-lg font-semibold text-foreground">{t('merchants.add')}</h2>
              <button onClick={() => setShowAddModal(false)} className="p-1.5 hover:bg-secondary rounded-lg transition-colors">
                <X className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>
            <div className="p-4 space-y-4">
              {/* Basic Info */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Company Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 bg-secondary border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Acme Inc."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Tax ID / VAT</label>
                <input
                  type="text"
                  value={formData.taxId}
                  onChange={(e) => setFormData({ ...formData, taxId: e.target.value })}
                  className="w-full px-3 py-2 bg-secondary border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="US123456789"
                />
              </div>

              {/* Billing Address */}
              <div className="pt-2 border-t border-border">
                <p className="text-xs font-medium text-muted-foreground mb-3">Billing Address</p>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1.5">Address</label>
                    <input
                      type="text"
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      className="w-full px-3 py-2 bg-secondary border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="123 Main Street"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1.5">City</label>
                      <input
                        type="text"
                        value={formData.city}
                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                        className="w-full px-3 py-2 bg-secondary border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                        placeholder="New York"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1.5">Postal Code</label>
                      <input
                        type="text"
                        value={formData.postalCode}
                        onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                        className="w-full px-3 py-2 bg-secondary border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                        placeholder="10001"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1.5">Country</label>
                    <input
                      type="text"
                      value={formData.country}
                      onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                      className="w-full px-3 py-2 bg-secondary border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="USA"
                    />
                  </div>
                </div>
              </div>

              {/* Contact Info */}
              <div className="pt-2 border-t border-border">
                <p className="text-xs font-medium text-muted-foreground mb-3">Contact Info</p>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1.5">Email</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-3 py-2 bg-secondary border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="contact@company.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1.5">Phone</label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-3 py-2 bg-secondary border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="+1 555-0123"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1.5">Website</label>
                    <input
                      type="url"
                      value={formData.website}
                      onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                      className="w-full px-3 py-2 bg-secondary border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="https://company.com"
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="flex gap-3 p-4 border-t border-border sticky bottom-0 bg-card">
              <Button variant="outline" className="flex-1" onClick={() => setShowAddModal(false)}>
                {t('common.cancel')}
              </Button>
              <Button className="flex-1" onClick={handleAddMerchant}>
                {t('common.add')}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Merchant Detail Modal */}
      {showDetailModal && selectedMerchant && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowDetailModal(false)} />
          <div className="relative bg-card border border-border rounded-xl shadow-xl w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-4 border-b border-border sticky top-0 bg-card">
              <h2 className="text-lg font-semibold text-foreground">{selectedMerchant.name}</h2>
              <button onClick={() => setShowDetailModal(false)} className="p-1.5 hover:bg-secondary rounded-lg transition-colors">
                <X className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>
            <div className="p-4 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-16 h-16 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Building2 className="w-8 h-8 text-primary" />
                </div>
                <div>
                  <p className="font-medium text-foreground">{selectedMerchant.name}</p>
                  {selectedMerchant.tax_id && (
                    <p className="text-sm text-muted-foreground">Tax ID: {selectedMerchant.tax_id}</p>
                  )}
                </div>
              </div>

              {/* Billing Address */}
              {(selectedMerchant.address || selectedMerchant.city) && (
                <div className="p-3 bg-secondary/30 rounded-lg">
                  <p className="text-xs text-muted-foreground mb-1">Billing Address</p>
                  <p className="text-sm text-foreground">{selectedMerchant.address}</p>
                  <p className="text-sm text-foreground">
                    {selectedMerchant.city}{selectedMerchant.postal_code && `, ${selectedMerchant.postal_code}`}
                  </p>
                  <p className="text-sm text-foreground">{selectedMerchant.country}</p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-muted-foreground">Country</p>
                  <p className="text-sm font-medium text-foreground flex items-center gap-1">
                    <Globe className="w-3.5 h-3.5" />
                    {selectedMerchant.country}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Campaigns</p>
                  <p className="text-sm font-medium text-foreground">{selectedMerchant.campaigns}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">{t('creators.status')}</p>
                  <span className={`inline-flex px-2 py-0.5 text-xs font-medium rounded-full ${
                    selectedMerchant.status === 'active'
                      ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                      : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                  }`}>
                    {selectedMerchant.status}
                  </span>
                </div>
              </div>

              {/* Contact Info */}
              {(selectedMerchant.email || selectedMerchant.phone || selectedMerchant.website) && (
                <div className="border-t border-border pt-4 space-y-2">
                  <p className="text-xs text-muted-foreground">Contact</p>
                  {selectedMerchant.email && (
                    <div className="flex items-center gap-2 text-sm">
                      <Mail className="w-4 h-4 text-muted-foreground" />
                      <span className="text-foreground">{selectedMerchant.email}</span>
                    </div>
                  )}
                  {selectedMerchant.phone && (
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="w-4 h-4 text-muted-foreground" />
                      <span className="text-foreground">{selectedMerchant.phone}</span>
                    </div>
                  )}
                  {selectedMerchant.website && (
                    <div className="flex items-center gap-2 text-sm">
                      <Globe className="w-4 h-4 text-muted-foreground" />
                      <span className="text-foreground">{selectedMerchant.website}</span>
                    </div>
                  )}
                </div>
              )}
            </div>
            <div className="flex gap-3 p-4 border-t border-border sticky bottom-0 bg-card">
              <Button variant="outline" className="flex-1" onClick={() => handleDeleteMerchant(selectedMerchant.id)}>
                <Trash2 className="w-4 h-4" />
                {t('common.delete')}
              </Button>
              <Button className="flex-1" onClick={() => handleEditMerchant(selectedMerchant)}>
                <Pencil className="w-4 h-4" />
                {t('common.edit')}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Merchant Modal */}
      {showEditModal && editingMerchant && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={() => { setShowEditModal(false); setEditingMerchant(null); }} />
          <div className="relative bg-card border border-border rounded-xl shadow-xl w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-4 border-b border-border sticky top-0 bg-card">
              <h2 className="text-lg font-semibold text-foreground">{t('common.edit')}</h2>
              <button onClick={() => { setShowEditModal(false); setEditingMerchant(null); }} className="p-1.5 hover:bg-secondary rounded-lg transition-colors">
                <X className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>
            <div className="p-4 space-y-4">
              {/* Basic Info */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Company Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 bg-secondary border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Acme Inc."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Tax ID / VAT</label>
                <input
                  type="text"
                  value={formData.taxId}
                  onChange={(e) => setFormData({ ...formData, taxId: e.target.value })}
                  className="w-full px-3 py-2 bg-secondary border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="US123456789"
                />
              </div>

              {/* Billing Address */}
              <div className="pt-2 border-t border-border">
                <p className="text-xs font-medium text-muted-foreground mb-3">Billing Address</p>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1.5">Address</label>
                    <input
                      type="text"
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      className="w-full px-3 py-2 bg-secondary border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="123 Main Street"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1.5">City</label>
                      <input
                        type="text"
                        value={formData.city}
                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                        className="w-full px-3 py-2 bg-secondary border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                        placeholder="New York"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1.5">Postal Code</label>
                      <input
                        type="text"
                        value={formData.postalCode}
                        onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                        className="w-full px-3 py-2 bg-secondary border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                        placeholder="10001"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1.5">Country</label>
                    <input
                      type="text"
                      value={formData.country}
                      onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                      className="w-full px-3 py-2 bg-secondary border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="USA"
                    />
                  </div>
                </div>
              </div>

              {/* Contact Info */}
              <div className="pt-2 border-t border-border">
                <p className="text-xs font-medium text-muted-foreground mb-3">Contact Info</p>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1.5">Email</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-3 py-2 bg-secondary border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="contact@company.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1.5">Phone</label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-3 py-2 bg-secondary border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="+1 555-0123"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1.5">Website</label>
                    <input
                      type="url"
                      value={formData.website}
                      onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                      className="w-full px-3 py-2 bg-secondary border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="https://company.com"
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="flex gap-3 p-4 border-t border-border sticky bottom-0 bg-card">
              <Button variant="outline" className="flex-1" onClick={() => { setShowEditModal(false); setEditingMerchant(null); }}>
                {t('common.cancel')}
              </Button>
              <Button className="flex-1" onClick={handleSaveEdit}>
                {t('common.save')}
              </Button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}
