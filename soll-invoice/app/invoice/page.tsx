'use client';

import { useState, useEffect } from 'react';
import { Layout, Header } from '@/components/layout';
import { useI18n } from '@/lib/i18n';
import { Button } from '@/components/ui/Button';
import { db, type Tables } from '@/lib/supabase/hooks';
import { Plus, Search, Filter, Download, Eye, MoreHorizontal, CheckCircle, Clock, XCircle, FileText, X, Trash2, Printer } from 'lucide-react';
import { jsPDF } from 'jspdf';

type InvoiceItem = {
  description: string;
  quantity: number;
  rate: number;
  amount: number;
};

type CompanyInfo = {
  name: string;
  address: string;
  city: string;
  country: string;
  email: string;
  phone: string;
  bankName: string;
  bankAccount: string;
};

type Invoice = {
  id: string;
  merchant: string;
  description: string;
  amount: number;
  currency: string;
  issueDate: string;
  dueDate: string;
  status: 'paid' | 'pending' | 'overdue' | 'draft';
  items: InvoiceItem[];
  fromCompany: CompanyInfo;
  toCompany: CompanyInfo;
  paidToDate: number;
  notes: string;
};

// Default company info
const defaultFromCompany: CompanyInfo = {
  name: 'SollAI Inc.',
  address: '123 Innovation Drive, Suite 100',
  city: 'San Francisco, CA 94105',
  country: 'United States',
  email: 'billing@sollai.com',
  phone: '+1 (555) 123-4567',
  bankName: 'First National Bank',
  bankAccount: '1234567890',
};

export default function InvoicePage() {
  const { t, language } = useI18n();
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const [statusFilter, setStatusFilter] = useState<'all' | 'paid' | 'pending' | 'overdue' | 'draft'>('all');
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showMoreMenu, setShowMoreMenu] = useState<string | null>(null);

  // Form state for creating invoice
  const [formData, setFormData] = useState({
    merchant: '',
    description: '',
    currency: 'USD',
    dueDate: '',
    notes: '',
    toCompanyName: '',
    toCompanyAddress: '',
    toCompanyCity: '',
    toCompanyCountry: '',
    toCompanyEmail: '',
  });

  // Line items for new invoice
  const [lineItems, setLineItems] = useState<InvoiceItem[]>([
    { description: '', quantity: 1, rate: 0, amount: 0 }
  ]);

  // Merchants from Supabase
  const [merchants, setMerchants] = useState<Tables<'merchants'>[]>([]);

  useEffect(() => {
    db.merchants.getAll().then(setMerchants).catch(console.error);
  }, []);

  // Mock invoice data with line items
  const [invoices, setInvoices] = useState<Invoice[]>([
    {
      id: 'INV-2024-001',
      merchant: 'TechBrand Inc.',
      description: 'Campaign management fee',
      amount: 2500.00,
      currency: 'USD',
      issueDate: '2024-01-15',
      dueDate: '2024-02-15',
      status: 'paid',
      items: [
        { description: 'Social Media Campaign Management', quantity: 1, rate: 1500, amount: 1500 },
        { description: 'Content Creation Package', quantity: 2, rate: 500, amount: 1000 },
      ],
      fromCompany: defaultFromCompany,
      toCompany: {
        name: 'TechBrand Inc.',
        address: '456 Tech Avenue',
        city: 'Los Angeles, CA 90001',
        country: 'United States',
        email: 'accounts@techbrand.com',
        phone: '+1 (555) 987-6543',
        bankName: '',
        bankAccount: '',
      },
      paidToDate: 2500,
      notes: 'Payment terms: Net 30 days. Thank you for your business!',
    },
    {
      id: 'INV-2024-002',
      merchant: 'Fashion Forward',
      description: 'Influencer marketing services',
      amount: 1800.00,
      currency: 'USD',
      issueDate: '2024-01-14',
      dueDate: '2024-02-14',
      status: 'pending',
      items: [
        { description: 'Influencer Outreach Services', quantity: 1, rate: 800, amount: 800 },
        { description: 'Campaign Analytics Report', quantity: 1, rate: 500, amount: 500 },
        { description: 'Content Review & Approval', quantity: 1, rate: 500, amount: 500 },
      ],
      fromCompany: defaultFromCompany,
      toCompany: {
        name: 'Fashion Forward LLC',
        address: '789 Fashion Blvd',
        city: 'New York, NY 10001',
        country: 'United States',
        email: 'finance@fashionforward.com',
        phone: '+1 (555) 456-7890',
        bankName: '',
        bankAccount: '',
      },
      paidToDate: 0,
      notes: 'Payment terms: Net 30 days.',
    },
    {
      id: 'INV-2024-003',
      merchant: 'Beauty Co.',
      description: 'Content creation package',
      amount: 3200.00,
      currency: 'USD',
      issueDate: '2024-01-13',
      dueDate: '2024-02-13',
      status: 'overdue',
      items: [
        { description: 'Video Production', quantity: 4, rate: 500, amount: 2000 },
        { description: 'Photo Shoot', quantity: 2, rate: 400, amount: 800 },
        { description: 'Post-Production Editing', quantity: 1, rate: 400, amount: 400 },
      ],
      fromCompany: defaultFromCompany,
      toCompany: {
        name: 'Beauty Co. International',
        address: '321 Beauty Lane',
        city: 'Miami, FL 33101',
        country: 'United States',
        email: 'payments@beautyco.com',
        phone: '+1 (555) 234-5678',
        bankName: '',
        bankAccount: '',
      },
      paidToDate: 0,
      notes: 'Payment terms: Net 30 days. Late payments subject to 1.5% monthly interest.',
    },
    {
      id: 'INV-2024-004',
      merchant: 'Sports Plus',
      description: 'Social media promotion',
      amount: 1500.00,
      currency: 'USD',
      issueDate: '2024-01-12',
      dueDate: '2024-02-12',
      status: 'paid',
      items: [
        { description: 'Instagram Campaign', quantity: 1, rate: 800, amount: 800 },
        { description: 'TikTok Promotion', quantity: 1, rate: 700, amount: 700 },
      ],
      fromCompany: defaultFromCompany,
      toCompany: {
        name: 'Sports Plus Ltd.',
        address: '555 Sports Way',
        city: 'Chicago, IL 60601',
        country: 'United States',
        email: 'billing@sportsplus.com',
        phone: '+1 (555) 345-6789',
        bankName: '',
        bankAccount: '',
      },
      paidToDate: 1500,
      notes: 'Payment terms: Net 30 days.',
    },
    {
      id: 'INV-2024-005',
      merchant: 'Food & Co.',
      description: 'Video production services',
      amount: 2100.00,
      currency: 'USD',
      issueDate: '2024-01-11',
      dueDate: '2024-02-11',
      status: 'pending',
      items: [
        { description: 'Recipe Video Production', quantity: 3, rate: 500, amount: 1500 },
        { description: 'Social Media Distribution', quantity: 1, rate: 600, amount: 600 },
      ],
      fromCompany: defaultFromCompany,
      toCompany: {
        name: 'Food & Co.',
        address: '888 Culinary Street',
        city: 'Austin, TX 78701',
        country: 'United States',
        email: 'ap@foodandco.com',
        phone: '+1 (555) 567-8901',
        bankName: '',
        bankAccount: '',
      },
      paidToDate: 0,
      notes: 'Payment terms: Net 30 days.',
    },
  ]);

  // Filter invoices
  const filteredInvoices = invoices.filter(invoice => {
    const matchesSearch = searchQuery === '' ||
      invoice.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      invoice.merchant.toLowerCase().includes(searchQuery.toLowerCase()) ||
      invoice.description.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'all' || invoice.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'paid': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'pending': return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'overdue': return <XCircle className="w-4 h-4 text-red-500" />;
      case 'draft': return <FileText className="w-4 h-4 text-gray-400" />;
      default: return null;
    }
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
      case 'pending': return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'overdue': return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
      case 'draft': return 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400';
      default: return '';
    }
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      paid: t('invoice.status.paid'),
      pending: t('invoice.status.pending'),
      overdue: t('invoice.status.overdue'),
      draft: t('invoice.status.draft'),
    };
    return labels[status] || status;
  };

  // Calculate stats from filtered data
  const totalAmount = filteredInvoices.reduce((sum, inv) => sum + inv.amount, 0);
  const paidAmount = filteredInvoices.filter(inv => inv.status === 'paid').reduce((sum, inv) => sum + inv.amount, 0);
  const pendingAmount = filteredInvoices.filter(inv => inv.status === 'pending').reduce((sum, inv) => sum + inv.amount, 0);
  const overdueAmount = filteredInvoices.filter(inv => inv.status === 'overdue').reduce((sum, inv) => sum + inv.amount, 0);

  // Add line item
  const addLineItem = () => {
    setLineItems([...lineItems, { description: '', quantity: 1, rate: 0, amount: 0 }]);
  };

  // Update line item
  const updateLineItem = (index: number, field: keyof InvoiceItem, value: string | number) => {
    const updated = [...lineItems];
    if (field === 'description') {
      updated[index].description = value as string;
    } else {
      updated[index][field] = Number(value);
      if (field === 'quantity' || field === 'rate') {
        updated[index].amount = updated[index].quantity * updated[index].rate;
      }
    }
    setLineItems(updated);
  };

  // Remove line item
  const removeLineItem = (index: number) => {
    if (lineItems.length > 1) {
      setLineItems(lineItems.filter((_, i) => i !== index));
    }
  };

  // Calculate total from line items
  const calculateTotal = () => {
    return lineItems.reduce((sum, item) => sum + item.amount, 0);
  };

  // Generate Professional A4 PDF Invoice
  const generatePDF = (invoice: Invoice) => {
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 20;
    let y = 20;

    // Colors
    const primaryColor = [41, 98, 255] as [number, number, number];
    const textColor = [51, 51, 51] as [number, number, number];
    const mutedColor = [128, 128, 128] as [number, number, number];
    const lightGray = [245, 245, 245] as [number, number, number];

    // Header - Invoice title
    doc.setFontSize(32);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...primaryColor);
    doc.text('Invoice', margin, y);
    y += 15;

    // From Section
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...mutedColor);
    doc.text('From', margin, y);
    y += 5;

    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...textColor);
    doc.setFontSize(11);
    doc.text(invoice.fromCompany.name, margin, y);
    y += 5;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.text(invoice.fromCompany.address, margin, y);
    y += 4;
    doc.text(invoice.fromCompany.city, margin, y);
    y += 4;
    doc.text(invoice.fromCompany.country, margin, y);
    y += 10;

    // To Section
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...mutedColor);
    doc.setFontSize(10);
    doc.text('To', margin, y);
    y += 5;

    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...textColor);
    doc.setFontSize(11);
    doc.text(invoice.toCompany.name, margin, y);
    y += 5;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.text(invoice.toCompany.address, margin, y);
    y += 4;
    doc.text(invoice.toCompany.city, margin, y);
    y += 4;
    doc.text(invoice.toCompany.country, margin, y);

    // Invoice details on the right side
    const detailsX = pageWidth - margin - 60;
    let detailsY = 35;

    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...mutedColor);
    doc.text('Invoice No.', detailsX, detailsY);
    doc.setTextColor(...textColor);
    doc.setFont('helvetica', 'bold');
    doc.text(invoice.id, detailsX + 35, detailsY);
    detailsY += 6;

    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...mutedColor);
    doc.text('Date', detailsX, detailsY);
    doc.setTextColor(...textColor);
    doc.text(invoice.issueDate, detailsX + 35, detailsY);
    detailsY += 6;

    doc.setTextColor(...mutedColor);
    doc.text('Invoice Due', detailsX, detailsY);
    doc.setTextColor(...textColor);
    doc.text(invoice.dueDate, detailsX + 35, detailsY);

    y += 15;

    // Items Table Header
    const tableStartY = y;
    const colWidths = [85, 25, 30, 30];
    const colX = [margin, margin + 85, margin + 110, margin + 140];

    // Table header background
    doc.setFillColor(...lightGray);
    doc.rect(margin, tableStartY - 5, pageWidth - margin * 2, 10, 'F');

    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...textColor);
    doc.text('Description', colX[0], tableStartY);
    doc.text('Quantity', colX[1], tableStartY);
    doc.text('Rate', colX[2], tableStartY);
    doc.text('Amount', colX[3], tableStartY);

    y = tableStartY + 8;

    // Table rows
    doc.setFont('helvetica', 'normal');
    invoice.items.forEach((item) => {
      doc.text(item.description, colX[0], y);
      doc.text(item.quantity.toString(), colX[1], y);
      doc.text(`$${item.rate.toLocaleString()}`, colX[2], y);
      doc.text(`$${item.amount.toLocaleString()}`, colX[3], y);
      y += 8;
    });

    // Horizontal line after items
    y += 5;
    doc.setDrawColor(220, 220, 220);
    doc.line(margin, y, pageWidth - margin, y);
    y += 10;

    // Totals section (right aligned)
    const totalsX = pageWidth - margin - 60;
    const totalsValueX = pageWidth - margin;

    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...mutedColor);
    doc.text('Sub Total', totalsX, y);
    doc.setTextColor(...textColor);
    doc.text(`$${invoice.amount.toLocaleString()}`, totalsValueX, y, { align: 'right' });
    y += 7;

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(...textColor);
    doc.text('Total', totalsX, y);
    doc.text(`$${invoice.amount.toLocaleString()}`, totalsValueX, y, { align: 'right' });
    y += 7;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(...mutedColor);
    doc.text('Paid to Date', totalsX, y);
    doc.setTextColor(...textColor);
    doc.text(`$${invoice.paidToDate.toLocaleString()}`, totalsValueX, y, { align: 'right' });
    y += 7;

    const balance = invoice.amount - invoice.paidToDate;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(...primaryColor);
    doc.text('Balance', totalsX, y);
    doc.text(`$${balance.toLocaleString()}`, totalsValueX, y, { align: 'right' });

    y += 20;

    // Invoice Note section
    doc.setFillColor(...lightGray);
    doc.rect(margin, y - 5, pageWidth - margin * 2, 35, 'F');

    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...textColor);
    doc.text('Invoice Note', margin + 5, y);
    y += 6;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(...mutedColor);

    // Wrap notes text
    const notesLines = doc.splitTextToSize(invoice.notes, pageWidth - margin * 2 - 10);
    doc.text(notesLines, margin + 5, y);
    y += notesLines.length * 4 + 4;

    // Bank details
    doc.setTextColor(...textColor);
    doc.text(`Bank: ${invoice.fromCompany.bankName}`, margin + 5, y);
    y += 4;
    doc.text(`Account: ${invoice.fromCompany.bankAccount}`, margin + 5, y);

    // Footer
    const footerY = doc.internal.pageSize.getHeight() - 15;
    doc.setFontSize(8);
    doc.setTextColor(...mutedColor);
    doc.text(invoice.fromCompany.email, margin, footerY);

    doc.setTextColor(...primaryColor);
    doc.text('Powered by SollAI', pageWidth - margin, footerY, { align: 'right' });

    // Save PDF
    doc.save(`${invoice.id}.pdf`);
  };

  const handleCreateInvoice = () => {
    if (!formData.merchant || lineItems.every(item => !item.description)) return;

    const total = calculateTotal();
    const newInvoice: Invoice = {
      id: `INV-2024-${String(invoices.length + 1).padStart(3, '0')}`,
      merchant: formData.merchant,
      description: lineItems[0]?.description || 'Marketing services',
      amount: total,
      currency: formData.currency,
      issueDate: new Date().toISOString().split('T')[0],
      dueDate: formData.dueDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      status: 'draft',
      items: lineItems.filter(item => item.description),
      fromCompany: defaultFromCompany,
      toCompany: {
        name: formData.toCompanyName || formData.merchant,
        address: formData.toCompanyAddress || '',
        city: formData.toCompanyCity || '',
        country: formData.toCompanyCountry || 'United States',
        email: formData.toCompanyEmail || '',
        phone: '',
        bankName: '',
        bankAccount: '',
      },
      paidToDate: 0,
      notes: formData.notes || 'Payment terms: Net 30 days. Thank you for your business!',
    };

    setInvoices([newInvoice, ...invoices]);
    setShowCreateModal(false);
    setFormData({ merchant: '', description: '', currency: 'USD', dueDate: '', notes: '', toCompanyName: '', toCompanyAddress: '', toCompanyCity: '', toCompanyCountry: '', toCompanyEmail: '' });
    setLineItems([{ description: '', quantity: 1, rate: 0, amount: 0 }]);
  };

  const handleViewInvoice = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setShowDetailModal(true);
    setShowMoreMenu(null);
  };

  const handleDownloadInvoice = (invoice: Invoice) => {
    generatePDF(invoice);
    setShowMoreMenu(null);
  };

  const handleExportAll = () => {
    const csvContent = [
      ['Invoice No', 'Merchant', 'Description', 'Amount', 'Currency', 'Issue Date', 'Due Date', 'Status'],
      ...filteredInvoices.map(inv => [
        inv.id, inv.merchant, inv.description, inv.amount, inv.currency, inv.issueDate, inv.dueDate, inv.status
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `invoices-export-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleDeleteInvoice = (id: string) => {
    setInvoices(invoices.filter(inv => inv.id !== id));
    setShowDetailModal(false);
    setShowMoreMenu(null);
  };

  const handleMarkAsPaid = (id: string) => {
    setInvoices(invoices.map(inv => inv.id === id ? { ...inv, status: 'paid' as const, paidToDate: inv.amount } : inv));
    setShowMoreMenu(null);
  };

  return (
    <Layout>
      <Header
        title={t('invoice.title')}
        action={
          <Button size="sm" onClick={() => setShowCreateModal(true)}>
            <Plus className="w-4 h-4" />
            {t('invoice.create')}
          </Button>
        }
      />

      <div className="p-4 md:p-6 space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 bg-card rounded-xl border border-border">
            <p className="text-sm text-muted-foreground mb-1">{t('invoice.stats.total')}</p>
            <p className="text-2xl font-bold text-foreground">${totalAmount.toLocaleString()}</p>
          </div>
          <div className="p-4 bg-card rounded-xl border border-border">
            <p className="text-sm text-muted-foreground mb-1">{t('invoice.stats.paid')}</p>
            <p className="text-2xl font-bold text-green-600">${paidAmount.toLocaleString()}</p>
          </div>
          <div className="p-4 bg-card rounded-xl border border-border">
            <p className="text-sm text-muted-foreground mb-1">{t('invoice.stats.pending')}</p>
            <p className="text-2xl font-bold text-yellow-600">${pendingAmount.toLocaleString()}</p>
          </div>
          <div className="p-4 bg-card rounded-xl border border-border">
            <p className="text-sm text-muted-foreground mb-1">{t('invoice.stats.overdue')}</p>
            <p className="text-2xl font-bold text-red-600">${overdueAmount.toLocaleString()}</p>
          </div>
        </div>

        {/* Search & Filter */}
        <div className="flex gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder={t('invoice.searchPlaceholder')}
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
              <div className="absolute right-0 top-full mt-2 w-40 bg-card border border-border rounded-lg shadow-lg z-10 p-2">
                <p className="text-xs font-medium text-muted-foreground px-2 py-1">{t('invoice.status')}</p>
                {['all', 'paid', 'pending', 'overdue', 'draft'].map((status) => (
                  <button
                    key={status}
                    onClick={() => { setStatusFilter(status as typeof statusFilter); setShowFilterMenu(false); }}
                    className={`w-full text-left px-2 py-1.5 text-sm rounded flex items-center gap-2 ${statusFilter === status ? 'bg-primary/10 text-primary' : 'hover:bg-secondary'}`}
                  >
                    {status !== 'all' && getStatusIcon(status)}
                    {status === 'all' ? t('common.all') : getStatusLabel(status)}
                  </button>
                ))}
              </div>
            )}
          </div>
          <Button variant="outline" size="sm" onClick={handleExportAll}>
            <Download className="w-4 h-4" />
            {t('common.export')}
          </Button>
        </div>

        {/* Invoices Table */}
        <div className="bg-card rounded-xl border border-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-secondary/50">
                <tr>
                  <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-4 py-3">{t('invoice.number')}</th>
                  <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-4 py-3">{t('invoice.merchant')}</th>
                  <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-4 py-3">{t('invoice.description')}</th>
                  <th className="text-right text-xs font-medium text-muted-foreground uppercase tracking-wider px-4 py-3">{t('invoice.amount')}</th>
                  <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-4 py-3">{t('invoice.dueDate')}</th>
                  <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-4 py-3">{t('invoice.status')}</th>
                  <th className="text-center text-xs font-medium text-muted-foreground uppercase tracking-wider px-4 py-3">{t('invoice.actions')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredInvoices.map((invoice) => (
                  <tr key={invoice.id} className="hover:bg-secondary/30 transition-colors">
                    <td className="px-4 py-3">
                      <span className="font-mono text-sm font-medium text-primary">{invoice.id}</span>
                    </td>
                    <td className="px-4 py-3 text-sm text-foreground">{invoice.merchant}</td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">{invoice.description}</td>
                    <td className="px-4 py-3 text-right">
                      <span className="font-medium text-foreground">${invoice.amount.toLocaleString()}</span>
                    </td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">{invoice.dueDate}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-full ${getStatusStyle(invoice.status)}`}>
                        {getStatusIcon(invoice.status)}
                        {getStatusLabel(invoice.status)}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          onClick={() => handleViewInvoice(invoice)}
                          className="p-1.5 hover:bg-secondary rounded-lg transition-colors"
                          title="View"
                        >
                          <Eye className="w-4 h-4 text-muted-foreground" />
                        </button>
                        <button
                          onClick={() => handleDownloadInvoice(invoice)}
                          className="p-1.5 hover:bg-secondary rounded-lg transition-colors"
                          title="Download PDF"
                        >
                          <Download className="w-4 h-4 text-muted-foreground" />
                        </button>
                        <div className="relative">
                          <button
                            onClick={() => setShowMoreMenu(showMoreMenu === invoice.id ? null : invoice.id)}
                            className="p-1.5 hover:bg-secondary rounded-lg transition-colors"
                            title="More"
                          >
                            <MoreHorizontal className="w-4 h-4 text-muted-foreground" />
                          </button>
                          {showMoreMenu === invoice.id && (
                            <div className="absolute right-0 top-full mt-1 w-40 bg-card border border-border rounded-lg shadow-lg z-10 py-1">
                              {invoice.status !== 'paid' && (
                                <button
                                  onClick={() => handleMarkAsPaid(invoice.id)}
                                  className="w-full text-left px-3 py-2 text-sm hover:bg-secondary flex items-center gap-2"
                                >
                                  <CheckCircle className="w-4 h-4 text-green-500" />
                                  {t('history.markPaid')}
                                </button>
                              )}
                              <button
                                onClick={() => handleDeleteInvoice(invoice.id)}
                                className="w-full text-left px-3 py-2 text-sm hover:bg-secondary flex items-center gap-2 text-red-500"
                              >
                                <Trash2 className="w-4 h-4" />
                                {t('common.delete')}
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredInvoices.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-4 py-8 text-center text-muted-foreground">
                      {t('common.noData')}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Create Invoice Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowCreateModal(false)} />
          <div className="relative bg-card border border-border rounded-xl shadow-xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-4 border-b border-border">
              <h2 className="text-lg font-semibold text-foreground">{t('invoice.create')}</h2>
              <button onClick={() => setShowCreateModal(false)} className="p-1.5 hover:bg-secondary rounded-lg transition-colors">
                <X className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>
            <div className="p-4 space-y-6">
              {/* Bill To Section */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-foreground">{language === 'zh' ? '开票给' : 'Bill To'}</h3>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">{t('invoice.merchant')} *</label>
                  <select
                    value={formData.merchant}
                    onChange={(e) => {
                      const selected = merchants.find(m => m.name === e.target.value);
                      setFormData({
                        ...formData,
                        merchant: e.target.value,
                        toCompanyName: e.target.value,
                        toCompanyAddress: selected?.address || '',
                        toCompanyCity: selected?.city || '',
                        toCompanyEmail: selected?.email || '',
                      });
                    }}
                    className="w-full px-3 py-2 bg-secondary border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="">{t('invoice.selectMerchant')}</option>
                    {merchants.map((m) => (
                      <option key={m.id} value={m.name}>{m.name}</option>
                    ))}
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1.5">{language === 'zh' ? '地址' : 'Address'}</label>
                    <input
                      type="text"
                      value={formData.toCompanyAddress}
                      onChange={(e) => setFormData({ ...formData, toCompanyAddress: e.target.value })}
                      placeholder={language === 'zh' ? '街道地址...' : 'Street address...'}
                      className="w-full px-3 py-2 bg-secondary border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1.5">{language === 'zh' ? '城市' : 'City'}</label>
                    <input
                      type="text"
                      value={formData.toCompanyCity}
                      onChange={(e) => setFormData({ ...formData, toCompanyCity: e.target.value })}
                      placeholder={language === 'zh' ? '城市, 邮编' : 'City, State ZIP'}
                      className="w-full px-3 py-2 bg-secondary border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                </div>
              </div>

              {/* Line Items Section */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-foreground">{t('invoice.items')}</h3>
                  <button
                    onClick={addLineItem}
                    className="text-sm text-primary hover:underline flex items-center gap-1"
                  >
                    <Plus className="w-4 h-4" />
                    {t('invoice.addItem')}
                  </button>
                </div>
                <div className="space-y-3">
                  <div className="grid grid-cols-12 gap-2 text-xs font-medium text-muted-foreground">
                    <div className="col-span-5">{t('invoice.description')}</div>
                    <div className="col-span-2">{language === 'zh' ? '数量' : 'Qty'}</div>
                    <div className="col-span-2">{language === 'zh' ? '单价' : 'Rate'}</div>
                    <div className="col-span-2">{t('invoice.amount')}</div>
                    <div className="col-span-1"></div>
                  </div>
                  {lineItems.map((item, index) => (
                    <div key={index} className="grid grid-cols-12 gap-2">
                      <input
                        type="text"
                        value={item.description}
                        onChange={(e) => updateLineItem(index, 'description', e.target.value)}
                        placeholder={t('invoice.descriptionPlaceholder')}
                        className="col-span-5 px-3 py-2 bg-secondary border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                      <input
                        type="number"
                        value={item.quantity}
                        onChange={(e) => updateLineItem(index, 'quantity', e.target.value)}
                        min="1"
                        className="col-span-2 px-3 py-2 bg-secondary border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                      <input
                        type="number"
                        value={item.rate}
                        onChange={(e) => updateLineItem(index, 'rate', e.target.value)}
                        min="0"
                        placeholder="0.00"
                        className="col-span-2 px-3 py-2 bg-secondary border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                      <div className="col-span-2 px-3 py-2 bg-secondary/50 border border-border rounded-lg text-sm text-foreground">
                        ${item.amount.toLocaleString()}
                      </div>
                      <button
                        onClick={() => removeLineItem(index)}
                        className="col-span-1 p-2 hover:bg-secondary rounded-lg transition-colors"
                        disabled={lineItems.length === 1}
                      >
                        <Trash2 className={`w-4 h-4 ${lineItems.length === 1 ? 'text-muted-foreground/30' : 'text-red-500'}`} />
                      </button>
                    </div>
                  ))}
                </div>
                <div className="flex justify-end pt-2 border-t border-border">
                  <div className="text-right">
                    <span className="text-sm text-muted-foreground mr-4">{language === 'zh' ? '总计' : 'Total'}:</span>
                    <span className="text-lg font-bold text-foreground">${calculateTotal().toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Invoice Details */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">{t('invoice.currency')}</label>
                  <select
                    value={formData.currency}
                    onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                    className="w-full px-3 py-2 bg-secondary border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="USD">USD</option>
                    <option value="EUR">EUR</option>
                    <option value="GBP">GBP</option>
                    <option value="CNY">CNY</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">{t('invoice.dueDate')}</label>
                  <input
                    type="date"
                    value={formData.dueDate}
                    onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                    className="w-full px-3 py-2 bg-secondary border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">{language === 'zh' ? '发票备注' : 'Invoice Note'}</label>
                <textarea
                  rows={3}
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder={language === 'zh' ? '付款条款、银行信息等...' : 'Payment terms, bank details, etc...'}
                  className="w-full px-3 py-2 bg-secondary border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                />
              </div>
            </div>
            <div className="flex gap-3 p-4 border-t border-border">
              <Button variant="outline" className="flex-1" onClick={() => setShowCreateModal(false)}>
                {t('common.cancel')}
              </Button>
              <Button className="flex-1" onClick={handleCreateInvoice}>
                {t('invoice.submit')}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Invoice Detail Modal */}
      {showDetailModal && selectedInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowDetailModal(false)} />
          <div className="relative bg-card border border-border rounded-xl shadow-xl w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-4 border-b border-border">
              <h2 className="text-lg font-semibold text-foreground">{selectedInvoice.id}</h2>
              <button onClick={() => setShowDetailModal(false)} className="p-1.5 hover:bg-secondary rounded-lg transition-colors">
                <X className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>
            <div className="p-4 space-y-4">
              <div className="flex items-center justify-between">
                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-full ${getStatusStyle(selectedInvoice.status)}`}>
                  {getStatusIcon(selectedInvoice.status)}
                  {getStatusLabel(selectedInvoice.status)}
                </span>
                <p className="text-2xl font-bold text-foreground">${selectedInvoice.amount.toLocaleString()}</p>
              </div>

              {/* From/To Info */}
              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="p-3 bg-secondary/30 rounded-lg">
                  <p className="text-xs text-muted-foreground mb-1">{language === 'zh' ? '开票方' : 'From'}</p>
                  <p className="text-sm font-medium text-foreground">{selectedInvoice.fromCompany.name}</p>
                  <p className="text-xs text-muted-foreground">{selectedInvoice.fromCompany.city}</p>
                </div>
                <div className="p-3 bg-secondary/30 rounded-lg">
                  <p className="text-xs text-muted-foreground mb-1">{language === 'zh' ? '开票给' : 'To'}</p>
                  <p className="text-sm font-medium text-foreground">{selectedInvoice.toCompany.name}</p>
                  <p className="text-xs text-muted-foreground">{selectedInvoice.toCompany.city}</p>
                </div>
              </div>

              {/* Line Items */}
              <div className="border border-border rounded-lg overflow-hidden">
                <div className="bg-secondary/50 px-3 py-2 text-xs font-medium text-muted-foreground grid grid-cols-12">
                  <div className="col-span-6">{t('invoice.description')}</div>
                  <div className="col-span-2 text-center">{language === 'zh' ? '数量' : 'Qty'}</div>
                  <div className="col-span-2 text-right">{language === 'zh' ? '单价' : 'Rate'}</div>
                  <div className="col-span-2 text-right">{t('invoice.amount')}</div>
                </div>
                {selectedInvoice.items.map((item, index) => (
                  <div key={index} className="px-3 py-2 text-sm grid grid-cols-12 border-t border-border">
                    <div className="col-span-6 text-foreground">{item.description}</div>
                    <div className="col-span-2 text-center text-muted-foreground">{item.quantity}</div>
                    <div className="col-span-2 text-right text-muted-foreground">${item.rate}</div>
                    <div className="col-span-2 text-right font-medium text-foreground">${item.amount}</div>
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div className="flex justify-end">
                <div className="w-48 space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">{language === 'zh' ? '小计' : 'Subtotal'}</span>
                    <span className="text-foreground">${selectedInvoice.amount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">{language === 'zh' ? '已付' : 'Paid'}</span>
                    <span className="text-foreground">${selectedInvoice.paidToDate.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm font-bold pt-1 border-t border-border">
                    <span className="text-foreground">{language === 'zh' ? '余额' : 'Balance'}</span>
                    <span className="text-primary">${(selectedInvoice.amount - selectedInvoice.paidToDate).toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Details */}
              <div className="grid grid-cols-3 gap-4 pt-2">
                <div>
                  <p className="text-xs text-muted-foreground">{t('invoice.currency')}</p>
                  <p className="text-sm font-medium text-foreground">{selectedInvoice.currency}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">{language === 'zh' ? '开票日期' : 'Issue Date'}</p>
                  <p className="text-sm font-medium text-foreground">{selectedInvoice.issueDate}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">{t('invoice.dueDate')}</p>
                  <p className="text-sm font-medium text-foreground">{selectedInvoice.dueDate}</p>
                </div>
              </div>

              {/* Notes */}
              {selectedInvoice.notes && (
                <div className="p-3 bg-secondary/30 rounded-lg">
                  <p className="text-xs text-muted-foreground mb-1">{language === 'zh' ? '备注' : 'Notes'}</p>
                  <p className="text-sm text-foreground">{selectedInvoice.notes}</p>
                </div>
              )}
            </div>
            <div className="flex gap-3 p-4 border-t border-border">
              <Button variant="outline" className="flex-1" onClick={() => handleDownloadInvoice(selectedInvoice)}>
                <Download className="w-4 h-4" />
                {language === 'zh' ? '下载 PDF' : 'Download PDF'}
              </Button>
              {selectedInvoice.status !== 'paid' && (
                <Button className="flex-1" onClick={() => { handleMarkAsPaid(selectedInvoice.id); setShowDetailModal(false); }}>
                  <CheckCircle className="w-4 h-4" />
                  {t('history.markPaid')}
                </Button>
              )}
              {selectedInvoice.status === 'paid' && (
                <Button className="flex-1" onClick={() => setShowDetailModal(false)}>
                  {t('common.close')}
                </Button>
              )}
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}
