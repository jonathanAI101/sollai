'use client';

import { useState, useEffect, useRef } from 'react';
import { Layout, Header } from '@/components/layout';
import { useI18n } from '@/lib/i18n';
import { Button } from '@/components/ui/Button';
import { db, type Tables, type InvoiceWithRelations } from '@/lib/supabase/hooks';
import type { Json } from '@/lib/supabase/types';
import { Plus, Search, Filter, Download, Eye, MoreHorizontal, CheckCircle, Clock, XCircle, FileText, X, Trash2, Mail, Ban, History } from 'lucide-react';
import { InvoiceHistory } from '@/components/invoice/InvoiceHistory';
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
  merchantId: string | null;
  merchant: string; // display name (from joined data or snapshot)
  description: string;
  amount: number;
  currency: string;
  issueDate: string;
  dueDate: string;
  status: 'paid' | 'pending' | 'overdue' | 'draft' | 'voided';
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
  const [statusFilter, setStatusFilter] = useState<'all' | 'paid' | 'pending' | 'overdue' | 'draft' | 'voided'>('all');
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showMoreMenu, setShowMoreMenu] = useState<string | null>(null);
  const [showHistory, setShowHistory] = useState(false);
  const [emailTarget, setEmailTarget] = useState<{ invoice: Invoice; email: string } | null>(null);

  // Click-outside to close menus
  const filterRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (filterRef.current && !filterRef.current.contains(e.target as Node)) {
        setShowFilterMenu(false);
      }
      const target = e.target as HTMLElement;
      if (!target.closest('[data-more-menu]')) {
        setShowMoreMenu(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Form state for creating invoice
  const [formData, setFormData] = useState({
    merchantId: '',
    merchantName: '',
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
  // Invoices from Supabase
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);

  // Convert DB row to local Invoice type
  const mapDbToInvoice = (row: InvoiceWithRelations): Invoice => ({
    id: row.id,
    merchantId: row.merchant_id,
    merchant: row.merchants?.name || row.merchant_name_snapshot,
    description: row.description,
    amount: row.amount,
    currency: row.currency,
    issueDate: row.issue_date,
    dueDate: row.due_date || '',
    status: row.status as Invoice['status'],
    items: (row.items as InvoiceItem[]) || [],
    fromCompany: (row.from_company as CompanyInfo) || defaultFromCompany,
    toCompany: (row.to_company as CompanyInfo) || { name: '', address: '', city: '', country: '', email: '', phone: '', bankName: '', bankAccount: '' },
    paidToDate: row.paid_to_date,
    notes: row.notes || '',
  });

  // Format UUID to readable invoice number
  const formatInvoiceId = (id: string) => {
    if (id.startsWith('INV-')) return id;
    return `INV-${id.substring(0, 8).toUpperCase()}`;
  };

  const fetchInvoices = async () => {
    try {
      setLoading(true);
      const data = await db.invoices.getAll();
      setInvoices(data.map(mapDbToInvoice));
    } catch (e) {
      console.error('Failed to fetch invoices:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    db.merchants.getAll().then(setMerchants).catch(console.error);
    fetchInvoices();
  }, []);

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
      case 'voided': return <Ban className="w-4 h-4 text-gray-400" />;
      default: return null;
    }
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-green-900/30 text-green-400';
      case 'pending': return 'bg-yellow-900/30 text-yellow-400';
      case 'overdue': return 'bg-red-900/30 text-red-400';
      case 'draft': return 'bg-gray-800 text-gray-400';
      case 'voided': return 'bg-gray-900/30 text-gray-400 line-through';
      default: return '';
    }
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      paid: t('invoice.status.paid'),
      pending: t('invoice.status.pending'),
      overdue: t('invoice.status.overdue'),
      draft: t('invoice.status.draft'),
      voided: language === 'zh' ? '已作废' : 'Voided',
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

  // Build PDF content (shared between download and email)
  const buildPdfContent = (doc: jsPDF, invoice: Invoice) => {
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
    doc.text(formatInvoiceId(invoice.id), detailsX + 35, detailsY);
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

  };

  // Generate and download PDF
  const generatePDF = (invoice: Invoice) => {
    const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
    buildPdfContent(doc, invoice);
    doc.save(`${formatInvoiceId(invoice.id)}.pdf`);
  };

  const handleCreateInvoice = async () => {
    if (!formData.merchantId || lineItems.every(item => !item.description)) return;

    const total = calculateTotal();
    const validItems = lineItems.filter(item => item.description);

    try {
      const newInvoice = await db.invoices.create({
        merchant_id: formData.merchantId,
        merchant_name_snapshot: formData.merchantName,
        description: validItems[0]?.description || 'Marketing services',
        amount: total,
        currency: formData.currency,
        issue_date: new Date().toISOString().split('T')[0],
        due_date: formData.dueDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        status: 'draft',
        items: validItems as unknown as Json,
        from_company: defaultFromCompany as unknown as Json,
        to_company: {
          name: formData.toCompanyName || formData.merchantName,
          address: formData.toCompanyAddress || '',
          city: formData.toCompanyCity || '',
          country: formData.toCompanyCountry || 'United States',
          email: formData.toCompanyEmail || '',
          phone: '',
          bankName: '',
          bankAccount: '',
        } as unknown as Json,
        paid_to_date: 0,
        notes: formData.notes || 'Payment terms: Net 30 days. Thank you for your business!',
      });

      await db.invoiceAudit.log({
        invoice_id: newInvoice.id,
        action: 'created',
        new_value: { amount: total, merchant: formData.merchantName, status: 'draft' },
      });

      await fetchInvoices();
      setShowCreateModal(false);
      setFormData({ merchantId: '', merchantName: '', description: '', currency: 'USD', dueDate: '', notes: '', toCompanyName: '', toCompanyAddress: '', toCompanyCity: '', toCompanyCountry: '', toCompanyEmail: '' });
      setLineItems([{ description: '', quantity: 1, rate: 0, amount: 0 }]);
    } catch (e) {
      console.error('Failed to create invoice:', e);
    }
  };

  const handleViewInvoice = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setShowDetailModal(true);
    setShowHistory(false);
    setShowMoreMenu(null);
  };

  const handleDownloadInvoice = (invoice: Invoice) => {
    generatePDF(invoice);
    setShowMoreMenu(null);
  };

  const [sendingEmail, setSendingEmail] = useState<string | null>(null);

  const handleSendEmail = (invoice: Invoice) => {
    setEmailTarget({ invoice, email: invoice.toCompany.email || '' });
    setShowMoreMenu(null);
  };

  const confirmSendEmail = async () => {
    if (!emailTarget) return;
    const { invoice, email } = emailTarget;
    if (!email) {
      alert(language === 'zh' ? '请输入收件人邮箱' : 'Please enter recipient email');
      return;
    }

    setSendingEmail(invoice.id);

    try {
      const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
      buildPdfContent(doc, invoice);
      const pdfBase64 = doc.output('datauristring').split(',')[1];

      const itemsList = invoice.items.map(item => `  - ${item.description}: $${item.amount.toLocaleString()}`).join('\n');
      const subject = `Invoice ${formatInvoiceId(invoice.id)} from ${defaultFromCompany.name}`;
      const body =
        `Dear ${invoice.toCompany.name || invoice.merchant},\n\n` +
        `Please find attached Invoice ${formatInvoiceId(invoice.id)}.\n\n` +
        `Invoice Date: ${invoice.issueDate}\n` +
        `Due Date: ${invoice.dueDate}\n` +
        `Currency: ${invoice.currency}\n\n` +
        `Items:\n${itemsList}\n\n` +
        `Total Amount: $${invoice.amount.toLocaleString()}\n` +
        `Balance Due: $${(invoice.amount - invoice.paidToDate).toLocaleString()}\n\n` +
        `Payment Details:\n` +
        `Bank: ${defaultFromCompany.bankName}\n` +
        `Account: ${defaultFromCompany.bankAccount}\n\n` +
        `${invoice.notes || 'Payment terms: Net 30 days.'}\n\n` +
        `Best regards,\n${defaultFromCompany.name}`;

      const res = await fetch('/api/send-invoice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ to: email, subject, body, pdfBase64, invoiceId: formatInvoiceId(invoice.id) }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      await db.invoiceAudit.log({
        invoice_id: invoice.id,
        action: 'email_sent',
        metadata: { recipient: email, timestamp: new Date().toISOString() },
      });

      alert(language === 'zh' ? `邮件已发送至 ${email}` : `Email sent to ${email}`);
      setEmailTarget(null);
    } catch (e) {
      alert(language === 'zh' ? `发送失败: ${e instanceof Error ? e.message : '未知错误'}` : `Failed to send: ${e instanceof Error ? e.message : 'Unknown error'}`);
    } finally {
      setSendingEmail(null);
    }
  };

  const escapeCsv = (value: string | number) => {
    const str = String(value);
    if (str.includes(',') || str.includes('"') || str.includes('\n')) {
      return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
  };

  const handleExportAll = () => {
    const csvContent = [
      ['Invoice No', 'Merchant', 'Description', 'Amount', 'Currency', 'Issue Date', 'Due Date', 'Status'],
      ...filteredInvoices.map(inv => [
        escapeCsv(formatInvoiceId(inv.id)), escapeCsv(inv.merchant), escapeCsv(inv.description),
        inv.amount, inv.currency, inv.issueDate, inv.dueDate, inv.status
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

  const handleDeleteInvoice = async (id: string) => {
    const invoice = invoices.find(inv => inv.id === id);

    // 已付款发票不允许删除
    if (invoice?.status === 'paid') {
      alert(language === 'zh'
        ? '已付款发票不能删除，只能作废'
        : 'Paid invoices cannot be deleted, only voided');
      return;
    }

    // 非草稿状态需要二次确认
    if (invoice?.status !== 'draft') {
      const confirmed = window.confirm(
        language === 'zh'
          ? `确定要删除发票 ${formatInvoiceId(id)}？此操作不可撤销。`
          : `Are you sure you want to delete invoice ${formatInvoiceId(id)}? This cannot be undone.`
      );
      if (!confirmed) return;
    }

    try {
      await db.invoiceAudit.log({
        invoice_id: id,
        action: 'deleted',
        old_value: { status: invoice?.status, amount: invoice?.amount },
      });

      await db.invoices.delete(id);
      setInvoices(invoices.filter(inv => inv.id !== id));
      setShowDetailModal(false);
      setShowMoreMenu(null);
    } catch (e) {
      console.error('Failed to delete invoice:', e);
      alert(language === 'zh' ? '删除失败' : 'Failed to delete');
    }
  };

  const handleVoidInvoice = async (id: string) => {
    const invoice = invoices.find(inv => inv.id === id);
    const confirmed = window.confirm(
      language === 'zh'
        ? '作废后发票将保留记录但标记为无效，确定继续？'
        : 'Voiding will keep the record but mark it as invalid. Continue?'
    );
    if (!confirmed) return;

    try {
      await db.invoices.update(id, {
        status: 'voided',
        voided_at: new Date().toISOString(),
      });

      await db.invoiceAudit.log({
        invoice_id: id,
        action: 'voided',
        old_value: { status: invoice?.status },
        new_value: { status: 'voided' },
      });

      await fetchInvoices();
      setShowMoreMenu(null);
    } catch (e) {
      console.error('Failed to void invoice:', e);
    }
  };

  const handleChangeStatus = async (id: string, newStatus: Invoice['status']) => {
    const invoice = invoices.find(inv => inv.id === id);
    if (!invoice) return;

    const oldStatus = invoice.status;
    const paidToDate = newStatus === 'paid' ? invoice.amount : invoice.paidToDate;

    try {
      await db.invoices.update(id, { status: newStatus, paid_to_date: paidToDate });

      await db.invoiceAudit.log({
        invoice_id: id,
        action: 'status_changed',
        old_value: { status: oldStatus, paid_to_date: invoice.paidToDate },
        new_value: { status: newStatus, paid_to_date: paidToDate },
        metadata: { timestamp: new Date().toISOString(), source: 'web_app' },
      });

      setInvoices(invoices.map(inv => inv.id === id ? { ...inv, status: newStatus, paidToDate } : inv));
      setShowMoreMenu(null);
    } catch (e) {
      console.error('Failed to update status:', e);
    }
  };

  const handleMarkAsPaid = async (id: string) => {
    await handleChangeStatus(id, 'paid');
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
          <div className="relative" ref={filterRef}>
            <Button variant="outline" size="sm" onClick={() => setShowFilterMenu(!showFilterMenu)}>
              <Filter className="w-4 h-4" />
              {t('common.filter')}
            </Button>
            {showFilterMenu && (
              <div className="absolute right-0 top-full mt-2 w-40 bg-card border border-border rounded-lg shadow-lg z-10 p-2">
                <p className="text-xs font-medium text-muted-foreground px-2 py-1">{t('invoice.status')}</p>
                {['all', 'paid', 'pending', 'overdue', 'draft', 'voided'].map((status) => (
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
        <div className="bg-card rounded-xl border border-border relative">
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
                {!loading && filteredInvoices.map((invoice) => (
                  <tr key={invoice.id} className="hover:bg-secondary/30 transition-colors">
                    <td className="px-4 py-3">
                      <span className="font-mono text-sm font-medium text-primary">{formatInvoiceId(invoice.id)}</span>
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
                        <button
                          onClick={() => handleSendEmail(invoice)}
                          className="p-1.5 hover:bg-secondary rounded-lg transition-colors"
                          title={language === 'zh' ? '发送邮件' : 'Send Email'}
                          disabled={sendingEmail === invoice.id}
                        >
                          {sendingEmail === invoice.id ? (
                            <div className="w-4 h-4 border-2 border-muted-foreground/30 border-t-muted-foreground rounded-full animate-spin" />
                          ) : (
                            <Mail className="w-4 h-4 text-muted-foreground" />
                          )}
                        </button>
                        <div className="relative" data-more-menu>
                          <button
                            onClick={() => setShowMoreMenu(showMoreMenu === invoice.id ? null : invoice.id)}
                            className="p-1.5 hover:bg-secondary rounded-lg transition-colors"
                            title="More"
                          >
                            <MoreHorizontal className="w-4 h-4 text-muted-foreground" />
                          </button>
                          {showMoreMenu === invoice.id && (
                            <div className="absolute right-0 top-full mt-1 w-44 bg-card border border-border rounded-lg shadow-lg z-10 py-1">
                              {invoice.status !== 'voided' && (
                                <>
                                  <p className="text-xs font-medium text-muted-foreground px-3 py-1">{t('invoice.status')}</p>
                                  {invoice.status !== 'paid'
                                    ? (['draft', 'pending', 'paid', 'overdue'] as const).filter(s => s !== invoice.status).map((s) => (
                                        <button
                                          key={s}
                                          onClick={() => handleChangeStatus(invoice.id, s)}
                                          className="w-full text-left px-3 py-1.5 text-sm hover:bg-secondary flex items-center gap-2"
                                        >
                                          {getStatusIcon(s)}
                                          {getStatusLabel(s)}
                                        </button>
                                      ))
                                    : (['pending', 'overdue'] as const).map((s) => (
                                        <button
                                          key={s}
                                          onClick={() => handleChangeStatus(invoice.id, s)}
                                          className="w-full text-left px-3 py-1.5 text-sm hover:bg-secondary flex items-center gap-2"
                                        >
                                          {getStatusIcon(s)}
                                          {getStatusLabel(s)}
                                        </button>
                                      ))
                                  }
                                </>
                              )}
                              <div className="border-t border-border my-1" />
                              {invoice.status === 'paid' ? (
                                <button
                                  onClick={() => handleVoidInvoice(invoice.id)}
                                  className="w-full text-left px-3 py-2 text-sm hover:bg-secondary flex items-center gap-2 text-orange-500"
                                >
                                  <Ban className="w-4 h-4" />
                                  {language === 'zh' ? '作废发票' : 'Void Invoice'}
                                </button>
                              ) : invoice.status !== 'voided' ? (
                                <button
                                  onClick={() => handleDeleteInvoice(invoice.id)}
                                  className="w-full text-left px-3 py-2 text-sm hover:bg-secondary flex items-center gap-2 text-red-500"
                                >
                                  <Trash2 className="w-4 h-4" />
                                  {t('common.delete')}
                                </button>
                              ) : null}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
                {loading && (
                  <tr>
                    <td colSpan={7} className="px-4 py-8 text-center text-muted-foreground">
                      {language === 'zh' ? '加载中...' : 'Loading...'}
                    </td>
                  </tr>
                )}
                {!loading && filteredInvoices.length === 0 && (
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

      {/* Create Invoice Slide-out Panel */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-black/40" onClick={() => setShowCreateModal(false)} />
          <div className="relative ml-auto w-full max-w-5xl bg-card border-l border-border shadow-2xl flex flex-col transition-transform duration-300">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-border shrink-0">
              <h2 className="text-lg font-semibold text-foreground">{t('invoice.create')}</h2>
              <div className="flex items-center gap-3">
                <Button variant="outline" size="sm" onClick={() => setShowCreateModal(false)}>
                  {t('common.cancel')}
                </Button>
                <Button size="sm" onClick={handleCreateInvoice}>
                  {t('invoice.submit')}
                </Button>
              </div>
            </div>

            {/* Content: Form + Preview */}
            <div className="flex flex-1 overflow-hidden">
              {/* Left: Form */}
              <div className="w-1/2 overflow-y-auto p-6 space-y-6 border-r border-border">
                {/* Bill To Section */}
                <div className="space-y-4">
                  <h3 className="text-sm font-semibold text-foreground">{language === 'zh' ? '开票给' : 'Bill To'}</h3>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1.5">{t('invoice.merchant')} *</label>
                    <select
                      value={formData.merchantId}
                      onChange={(e) => {
                        const selected = merchants.find(m => m.id === e.target.value);
                        setFormData({
                          ...formData,
                          merchantId: e.target.value,
                          merchantName: selected?.name || '',
                          toCompanyName: selected?.name || '',
                          toCompanyAddress: selected?.address || '',
                          toCompanyCity: selected?.city || '',
                          toCompanyEmail: selected?.email || '',
                        });
                      }}
                      className="w-full px-3 py-2 bg-secondary border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      <option value="">{t('invoice.selectMerchant')}</option>
                      {merchants.map((m) => (
                        <option key={m.id} value={m.id}>{m.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
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

                {/* Line Items */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-semibold text-foreground">{t('invoice.items')}</h3>
                    <button onClick={addLineItem} className="text-sm text-primary hover:underline flex items-center gap-1">
                      <Plus className="w-3.5 h-3.5" />
                      {t('invoice.addItem')}
                    </button>
                  </div>
                  <div className="space-y-2">
                    {lineItems.map((item, index) => (
                      <div key={index} className="flex gap-2 items-center">
                        <input
                          type="text"
                          value={item.description}
                          onChange={(e) => updateLineItem(index, 'description', e.target.value)}
                          placeholder={t('invoice.descriptionPlaceholder')}
                          className="flex-1 px-3 py-2 bg-secondary border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                        <input
                          type="number"
                          value={item.quantity}
                          onChange={(e) => updateLineItem(index, 'quantity', e.target.value)}
                          min="1"
                          className="w-16 px-2 py-2 bg-secondary border border-border rounded-lg text-sm text-center focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                        <input
                          type="number"
                          value={item.rate}
                          onChange={(e) => updateLineItem(index, 'rate', e.target.value)}
                          min="0"
                          placeholder="0"
                          className="w-24 px-2 py-2 bg-secondary border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                        <span className="w-20 text-sm text-foreground text-right">${item.amount.toLocaleString()}</span>
                        <button
                          onClick={() => removeLineItem(index)}
                          className="p-1.5 hover:bg-secondary rounded-lg transition-colors"
                          disabled={lineItems.length === 1}
                        >
                          <Trash2 className={`w-3.5 h-3.5 ${lineItems.length === 1 ? 'text-muted-foreground/30' : 'text-red-500'}`} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Invoice Details */}
                <div className="grid grid-cols-2 gap-3">
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

              {/* Right: Live Preview (matches PDF output) */}
              <div className="w-1/2 overflow-y-auto p-6 bg-secondary/30 flex items-start justify-center">
                <div className="bg-white rounded-sm shadow-lg w-full max-w-[420px] aspect-[210/297] p-8 relative flex flex-col text-[#333]" style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}>
                  {/* Invoice Title */}
                  <h1 className="text-[24px] font-bold" style={{ color: 'rgb(41, 98, 255)' }}>Invoice</h1>

                  {/* Invoice details - top right */}
                  <div className="absolute top-8 right-8 text-[8px] space-y-1">
                    <div className="flex gap-4">
                      <span className="text-gray-400">Invoice No.</span>
                      <span className="font-bold text-[#333]">INV-NEW</span>
                    </div>
                    <div className="flex gap-4">
                      <span className="text-gray-400">Date</span>
                      <span className="text-[#333]">{new Date().toISOString().split('T')[0]}</span>
                    </div>
                    <div className="flex gap-4">
                      <span className="text-gray-400">Invoice Due</span>
                      <span className="text-[#333]">{formData.dueDate || '—'}</span>
                    </div>
                  </div>

                  {/* From Section */}
                  <div className="mt-4">
                    <p className="text-[8px] font-bold text-gray-400">From</p>
                    <p className="text-[10px] font-bold mt-0.5">{defaultFromCompany.name}</p>
                    <p className="text-[8px] text-[#333]">{defaultFromCompany.address}</p>
                    <p className="text-[8px] text-[#333]">{defaultFromCompany.city}</p>
                    <p className="text-[8px] text-[#333]">{defaultFromCompany.country}</p>
                  </div>

                  {/* To Section */}
                  <div className="mt-3">
                    <p className="text-[8px] font-bold text-gray-400">To</p>
                    <p className="text-[10px] font-bold mt-0.5">{formData.merchantName || '—'}</p>
                    <p className="text-[8px] text-[#333]">{formData.toCompanyAddress || ''}</p>
                    <p className="text-[8px] text-[#333]">{formData.toCompanyCity || ''}</p>
                    <p className="text-[8px] text-[#333]">{formData.toCompanyCountry || 'United States'}</p>
                  </div>

                  {/* Items Table */}
                  <div className="mt-4">
                    {/* Table Header */}
                    <div className="bg-[#f5f5f5] px-2 py-1.5 grid grid-cols-12 gap-1 text-[7px] font-bold text-[#333]">
                      <div className="col-span-6">Description</div>
                      <div className="col-span-2">Quantity</div>
                      <div className="col-span-2">Rate</div>
                      <div className="col-span-2">Amount</div>
                    </div>
                    {/* Table Rows */}
                    {lineItems.filter(item => item.description || item.rate > 0).length > 0 ? (
                      lineItems.filter(item => item.description || item.rate > 0).map((item, index) => (
                        <div key={index} className="px-2 py-1 grid grid-cols-12 gap-1 text-[8px] text-[#333]">
                          <div className="col-span-6">{item.description || '—'}</div>
                          <div className="col-span-2">{item.quantity}</div>
                          <div className="col-span-2">${item.rate.toLocaleString()}</div>
                          <div className="col-span-2">${item.amount.toLocaleString()}</div>
                        </div>
                      ))
                    ) : (
                      <div className="px-2 py-3 text-center text-[8px] text-gray-300">
                        {language === 'zh' ? '添加项目后显示' : 'Items will appear here'}
                      </div>
                    )}
                  </div>

                  {/* Separator */}
                  <div className="mt-2 border-t border-gray-200" />

                  {/* Totals */}
                  <div className="mt-3 flex justify-end">
                    <div className="w-40 space-y-1 text-[8px]">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Sub Total</span>
                        <span className="text-[#333]">${calculateTotal().toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between font-bold text-[10px]">
                        <span className="text-[#333]">Total</span>
                        <span className="text-[#333]">${calculateTotal().toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Paid to Date</span>
                        <span className="text-[#333]">$0</span>
                      </div>
                      <div className="flex justify-between font-bold text-[10px]">
                        <span style={{ color: 'rgb(41, 98, 255)' }}>Balance</span>
                        <span style={{ color: 'rgb(41, 98, 255)' }}>${calculateTotal().toLocaleString()}</span>
                      </div>
                    </div>
                  </div>

                  {/* Invoice Note */}
                  <div className="mt-4 bg-[#f5f5f5] rounded-sm p-3">
                    <p className="text-[9px] font-bold text-[#333]">Invoice Note</p>
                    <p className="text-[7px] text-gray-400 mt-1">{formData.notes || 'Payment terms: Net 30 days. Thank you for your business!'}</p>
                    <p className="text-[7px] text-[#333] mt-1">Bank: {defaultFromCompany.bankName}</p>
                    <p className="text-[7px] text-[#333]">Account: {defaultFromCompany.bankAccount}</p>
                  </div>

                  {/* Footer */}
                  <div className="mt-auto pt-4 flex justify-between items-center text-[7px]">
                    <span className="text-gray-400">{defaultFromCompany.email}</span>
                    <span style={{ color: 'rgb(41, 98, 255)' }}>Powered by SollAI</span>
                  </div>
                </div>
              </div>
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
              <h2 className="text-lg font-semibold text-foreground">{formatInvoiceId(selectedInvoice.id)}</h2>
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

              {/* History Toggle */}
              <div className="border-t border-border pt-4">
                <button
                  onClick={() => setShowHistory(!showHistory)}
                  className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  <History className="w-4 h-4" />
                  {language === 'zh' ? '操作历史' : 'History'}
                  <span className="text-xs">({showHistory ? '−' : '+'})</span>
                </button>
                {showHistory && (
                  <div className="mt-3">
                    <InvoiceHistory invoiceId={selectedInvoice.id} language={language} />
                  </div>
                )}
              </div>
            </div>
            <div className="flex gap-3 p-4 border-t border-border">
              <Button variant="outline" className="flex-1" onClick={() => handleDownloadInvoice(selectedInvoice)}>
                <Download className="w-4 h-4" />
                {language === 'zh' ? '下载' : 'PDF'}
              </Button>
              <Button variant="outline" className="flex-1" onClick={() => handleSendEmail(selectedInvoice)} disabled={sendingEmail === selectedInvoice.id}>
                {sendingEmail === selectedInvoice.id ? (
                  <div className="w-4 h-4 border-2 border-muted-foreground/30 border-t-primary rounded-full animate-spin" />
                ) : (
                  <Mail className="w-4 h-4" />
                )}
                {sendingEmail === selectedInvoice.id ? (language === 'zh' ? '发送中...' : 'Sending...') : (language === 'zh' ? '邮件' : 'Email')}
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

      {/* Send Email Modal */}
      {emailTarget && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={() => setEmailTarget(null)} />
          <div className="relative bg-card border border-border rounded-xl shadow-xl w-full max-w-sm mx-4">
            <div className="flex items-center justify-between p-4 border-b border-border">
              <h2 className="text-sm font-semibold text-foreground">{language === 'zh' ? '发送发票邮件' : 'Send Invoice Email'}</h2>
              <button onClick={() => setEmailTarget(null)} className="p-1 hover:bg-secondary rounded-lg transition-colors">
                <X className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>
            <div className="p-4 space-y-3">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">{language === 'zh' ? '收件人邮箱' : 'Recipient Email'}</label>
                <input
                  type="email"
                  value={emailTarget.email}
                  onChange={(e) => setEmailTarget({ ...emailTarget, email: e.target.value })}
                  placeholder="email@example.com"
                  className="w-full px-3 py-2 bg-secondary border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  autoFocus
                />
              </div>
              {emailTarget.invoice.toCompany.email && emailTarget.email !== emailTarget.invoice.toCompany.email && (
                <button
                  onClick={() => setEmailTarget({ ...emailTarget, email: emailTarget.invoice.toCompany.email })}
                  className="flex items-center gap-2 w-full px-3 py-2 bg-secondary/50 border border-border rounded-lg text-sm hover:bg-secondary transition-colors text-left"
                >
                  <Mail className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                  <span className="text-muted-foreground">{language === 'zh' ? '商户邮箱：' : 'Merchant: '}</span>
                  <span className="text-foreground truncate">{emailTarget.invoice.toCompany.email}</span>
                </button>
              )}
              <p className="text-xs text-muted-foreground">
                {language === 'zh'
                  ? `将发送 ${formatInvoiceId(emailTarget.invoice.id)} 的 PDF 附件`
                  : `Will send ${formatInvoiceId(emailTarget.invoice.id)} with PDF attached`}
              </p>
            </div>
            <div className="flex gap-3 p-4 border-t border-border">
              <Button variant="outline" className="flex-1" onClick={() => setEmailTarget(null)}>
                {t('common.cancel')}
              </Button>
              <Button className="flex-1" onClick={confirmSendEmail} disabled={sendingEmail === emailTarget.invoice.id || !emailTarget.email}>
                {sendingEmail === emailTarget.invoice.id ? (
                  <>{language === 'zh' ? '发送中...' : 'Sending...'}</>
                ) : (
                  <><Mail className="w-4 h-4" />{language === 'zh' ? '发送' : 'Send'}</>
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}
