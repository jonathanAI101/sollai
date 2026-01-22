'use client';

import { useState, useEffect } from 'react';
import { Layout, Header } from '@/components/layout';
import { useI18n } from '@/lib/i18n';
import { Button } from '@/components/ui/Button';
import { Plus, Search, Filter, Instagram, Youtube, Twitter, X, Eye, Trash2 } from 'lucide-react';
import { db, type Tables, type InvoiceWithRelations } from '@/lib/supabase/hooks';
import { useConfirmDialog } from '@/hooks/useConfirmDialog';

type Creator = Tables<'creators'>;

export default function CreatorsPage() {
  const { t } = useI18n();
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [platformFilter, setPlatformFilter] = useState<string>('all');
  const [selectedCreator, setSelectedCreator] = useState<Creator | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [creators, setCreators] = useState<Creator[]>([]);
  const [invoices, setInvoices] = useState<InvoiceWithRelations[]>([]);
  const [loading, setLoading] = useState(true);
  const { confirm, ConfirmDialog } = useConfirmDialog();

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    handle: '',
    platform: 'Instagram',
    followers: '',
    email: '',
  });

  // Fetch creators from Supabase
  useEffect(() => {
    fetchCreators();
  }, []);

  const fetchCreators = async () => {
    try {
      setLoading(true);
      const [creatorsData, invoicesData] = await Promise.all([
        db.creators.getAll(),
        db.invoices.getAll(),
      ]);
      setCreators(creatorsData);
      setInvoices(invoicesData);
    } catch (error) {
      console.error('Failed to fetch creators:', error);
    } finally {
      setLoading(false);
    }
  };

  const getInvoiceCount = (creatorId: string) => {
    return invoices.filter(inv => inv.creator_id === creatorId).length;
  };

  const getPlatformIcon = (platform: string) => {
    switch (platform.toLowerCase()) {
      case 'instagram': return <Instagram className="w-4 h-4 text-pink-500" />;
      case 'youtube': return <Youtube className="w-4 h-4 text-red-500" />;
      case 'twitter': return <Twitter className="w-4 h-4 text-blue-400" />;
      case 'tiktok': return <span className="w-4 h-4 text-white font-bold text-xs">TT</span>;
      case 'bilibili': return <span className="w-4 h-4 text-blue-500 font-bold text-xs">B</span>;
      default: return null;
    }
  };

  const formatFollowers = (count: number) => {
    if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`;
    if (count >= 1000) return `${(count / 1000).toFixed(0)}K`;
    return count.toString();
  };

  // Filter creators
  const filteredCreators = creators.filter(creator => {
    const matchesSearch = searchQuery === '' ||
      creator.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (creator.social_handle || '').toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'all' || creator.status === statusFilter;
    const matchesPlatform = platformFilter === 'all' || creator.platform.toLowerCase() === platformFilter;

    return matchesSearch && matchesStatus && matchesPlatform;
  });

  const handleAddCreator = async () => {
    if (!formData.name || !formData.handle) return;

    try {
      await db.creators.create({
        name: formData.name,
        platform: formData.platform,
        social_handle: formData.handle.startsWith('@') ? formData.handle : `@${formData.handle}`,
        followers: parseInt(formData.followers) || 0,
        status: 'pending',
        email: formData.email || null,
      });

      setShowAddModal(false);
      setFormData({ name: '', handle: '', platform: 'Instagram', followers: '', email: '' });
      fetchCreators();
    } catch (error) {
      console.error('Failed to add creator:', error);
    }
  };

  const handleDeleteCreator = async (id: string) => {
    const invoiceCount = getInvoiceCount(id);
    const message = invoiceCount > 0
      ? `该创作者有 ${invoiceCount} 条发票记录，删除后发票将失去创作者关联。确定要删除吗？`
      : '确定要删除该创作者吗？此操作不可撤销。';

    const confirmed = await confirm({
      title: '删除创作者',
      message,
      confirmText: '确认删除',
      cancelText: '取消',
      variant: invoiceCount > 0 ? 'warning' : 'danger',
    });

    if (!confirmed) return;

    try {
      await db.creators.softDelete(id);
      setShowDetailModal(false);
      fetchCreators();
    } catch (error) {
      console.error('Failed to delete creator:', error);
    }
  };

  const handleViewCreator = (creator: Creator) => {
    setSelectedCreator(creator);
    setShowDetailModal(true);
  };

  return (
    <Layout>
      <Header
        title={t('creators.title')}
        action={
          <Button size="sm" onClick={() => setShowAddModal(true)}>
            <Plus className="w-4 h-4" />
            {t('creators.add')}
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
              placeholder={t('creators.searchPlaceholder')}
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
                    onClick={() => setStatusFilter(status)}
                    className={`w-full text-left px-2 py-1.5 text-sm rounded ${statusFilter === status ? 'bg-primary/10 text-primary' : 'hover:bg-secondary'}`}
                  >
                    {status === 'all' ? t('common.all') : status}
                  </button>
                ))}
                <p className="text-xs font-medium text-muted-foreground px-2 py-1 mt-2">{t('creators.platform')}</p>
                {['all', 'instagram', 'youtube', 'twitter', 'tiktok', 'bilibili'].map((platform) => (
                  <button
                    key={platform}
                    onClick={() => setPlatformFilter(platform)}
                    className={`w-full text-left px-2 py-1.5 text-sm rounded flex items-center gap-2 ${platformFilter === platform ? 'bg-primary/10 text-primary' : 'hover:bg-secondary'}`}
                  >
                    {platform !== 'all' && getPlatformIcon(platform)}
                    {platform === 'all' ? t('common.all') : platform}
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
          /* Creators List */
          <div className="bg-card rounded-xl border border-border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-secondary/50">
                  <tr>
                    <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-4 py-3">{t('creators.name')}</th>
                    <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-4 py-3">{t('creators.platform')}</th>
                    <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-4 py-3">{t('creators.followers')}</th>
                    <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-4 py-3">Engagement</th>
                    <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-4 py-3">{t('creators.status')}</th>
                    <th className="text-center text-xs font-medium text-muted-foreground uppercase tracking-wider px-4 py-3">{t('invoice.actions')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filteredCreators.map((creator) => (
                    <tr key={creator.id} className="hover:bg-secondary/30 transition-colors">
                      <td className="px-4 py-3">
                        <div>
                          <p className="font-medium text-foreground">{creator.name}</p>
                          <p className="text-sm text-muted-foreground">{creator.social_handle}</p>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          {getPlatformIcon(creator.platform)}
                          <span className="text-sm text-foreground">{creator.platform}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-foreground">{formatFollowers(creator.followers)}</td>
                      <td className="px-4 py-3 text-sm text-foreground">{creator.engagement}%</td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                          creator.status === 'active'
                            ? 'bg-green-900/30 text-green-400'
                            : 'bg-yellow-900/30 text-yellow-400'
                        }`}>
                          {creator.status}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            onClick={() => handleViewCreator(creator)}
                            className="p-1.5 hover:bg-secondary rounded-lg transition-colors"
                          >
                            <Eye className="w-4 h-4 text-muted-foreground" />
                          </button>
                          <button
                            onClick={() => handleDeleteCreator(creator.id)}
                            className="p-1.5 hover:bg-secondary rounded-lg transition-colors"
                          >
                            <Trash2 className="w-4 h-4 text-muted-foreground hover:text-red-500" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filteredCreators.length === 0 && (
                    <tr>
                      <td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">
                        {t('common.noData')}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Add Creator Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowAddModal(false)} />
          <div className="relative bg-card border border-border rounded-xl shadow-xl w-full max-w-lg mx-4">
            <div className="flex items-center justify-between p-4 border-b border-border">
              <h2 className="text-lg font-semibold text-foreground">{t('creators.add')}</h2>
              <button onClick={() => setShowAddModal(false)} className="p-1.5 hover:bg-secondary rounded-lg transition-colors">
                <X className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>
            <div className="p-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">{t('creators.name')} *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 bg-secondary border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="John Doe"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Handle *</label>
                <input
                  type="text"
                  value={formData.handle}
                  onChange={(e) => setFormData({ ...formData, handle: e.target.value })}
                  className="w-full px-3 py-2 bg-secondary border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="@johndoe"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">{t('creators.platform')}</label>
                  <select
                    value={formData.platform}
                    onChange={(e) => setFormData({ ...formData, platform: e.target.value })}
                    className="w-full px-3 py-2 bg-secondary border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="Instagram">Instagram</option>
                    <option value="YouTube">YouTube</option>
                    <option value="Twitter">Twitter</option>
                    <option value="TikTok">TikTok</option>
                    <option value="Bilibili">Bilibili</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">{t('creators.followers')}</label>
                  <input
                    type="number"
                    value={formData.followers}
                    onChange={(e) => setFormData({ ...formData, followers: e.target.value })}
                    className="w-full px-3 py-2 bg-secondary border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="10000"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3 py-2 bg-secondary border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="creator@example.com"
                />
              </div>
            </div>
            <div className="flex gap-3 p-4 border-t border-border">
              <Button variant="outline" className="flex-1" onClick={() => setShowAddModal(false)}>
                {t('common.cancel')}
              </Button>
              <Button className="flex-1" onClick={handleAddCreator}>
                {t('common.add')}
              </Button>
            </div>
          </div>
        </div>
      )}

      <ConfirmDialog />

      {/* Creator Detail Modal */}
      {showDetailModal && selectedCreator && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowDetailModal(false)} />
          <div className="relative bg-card border border-border rounded-xl shadow-xl w-full max-w-md mx-4">
            <div className="flex items-center justify-between p-4 border-b border-border">
              <h2 className="text-lg font-semibold text-foreground">{selectedCreator.name}</h2>
              <button onClick={() => setShowDetailModal(false)} className="p-1.5 hover:bg-secondary rounded-lg transition-colors">
                <X className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>
            <div className="p-4 space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                  {getPlatformIcon(selectedCreator.platform)}
                </div>
                <div>
                  <p className="font-medium text-foreground">{selectedCreator.name}</p>
                  <p className="text-sm text-muted-foreground">{selectedCreator.social_handle}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 pt-4">
                <div>
                  <p className="text-xs text-muted-foreground">{t('creators.platform')}</p>
                  <p className="text-sm font-medium text-foreground">{selectedCreator.platform}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">{t('creators.followers')}</p>
                  <p className="text-sm font-medium text-foreground">{formatFollowers(selectedCreator.followers)}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Engagement</p>
                  <p className="text-sm font-medium text-foreground">{selectedCreator.engagement}%</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">{t('creators.status')}</p>
                  <span className={`inline-flex px-2 py-0.5 text-xs font-medium rounded-full ${
                    selectedCreator.status === 'active'
                      ? 'bg-green-900/30 text-green-400'
                      : 'bg-yellow-900/30 text-yellow-400'
                  }`}>
                    {selectedCreator.status}
                  </span>
                </div>
              </div>
              {selectedCreator.email && (
                <div className="pt-2">
                  <p className="text-xs text-muted-foreground">Email</p>
                  <p className="text-sm font-medium text-foreground">{selectedCreator.email}</p>
                </div>
              )}
            </div>
            <div className="flex gap-3 p-4 border-t border-border">
              <Button variant="outline" className="flex-1" onClick={() => handleDeleteCreator(selectedCreator.id)}>
                <Trash2 className="w-4 h-4" />
                {t('common.delete')}
              </Button>
              <Button className="flex-1" onClick={() => setShowDetailModal(false)}>
                {t('common.close')}
              </Button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}
