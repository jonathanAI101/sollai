'use client';

import { useState, useRef } from 'react';
import { Upload, FileSpreadsheet, X, Check } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import * as XLSX from 'xlsx';
import type { Customer } from '@/lib/types';

interface CustomerImportProps {
  onImport: (customers: Omit<Customer, 'id' | 'createdAt' | 'updatedAt'>[]) => Promise<number>;
}

interface PreviewRow {
  name: string;
  taxNumber: string;
  contactPerson: string;
  phone: string;
  email: string;
  address: string;
  bankName: string;
  bankAccount: string;
}

export function CustomerImport({ onImport }: CustomerImportProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [previewData, setPreviewData] = useState<PreviewRow[]>([]);
  const [isImporting, setIsImporting] = useState(false);
  const [result, setResult] = useState<{ success: boolean; count: number } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = new Uint8Array(event.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const json = XLSX.utils.sheet_to_json<Record<string, string>>(worksheet);

        // Map Excel columns to our data structure
        const mapped: PreviewRow[] = json.map((row) => ({
          name: row['客户名称'] || row['公司名称'] || row['name'] || '',
          taxNumber: row['税号'] || row['纳税人识别号'] || row['taxNumber'] || '',
          contactPerson: row['联系人'] || row['contactPerson'] || '',
          phone: row['电话'] || row['联系电话'] || row['phone'] || '',
          email: row['邮箱'] || row['email'] || '',
          address: row['地址'] || row['address'] || '',
          bankName: row['开户行'] || row['bankName'] || '',
          bankAccount: row['银行账号'] || row['账号'] || row['bankAccount'] || '',
        })).filter((row) => row.name.trim() !== '');

        setPreviewData(mapped);
        setResult(null);
      } catch (error) {
        console.error('Failed to parse Excel file:', error);
        alert('文件解析失败，请检查文件格式');
      }
    };
    reader.readAsArrayBuffer(file);

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleImport = async () => {
    if (previewData.length === 0) return;

    setIsImporting(true);
    try {
      const customers = previewData.map((row) => ({
        ...row,
        tags: [] as string[],
      }));
      const count = await onImport(customers);
      setResult({ success: true, count });
      setPreviewData([]);
    } catch (error) {
      setResult({ success: false, count: 0 });
    }
    setIsImporting(false);
  };

  const handleClose = () => {
    setIsOpen(false);
    setPreviewData([]);
    setResult(null);
  };

  return (
    <>
      <Button variant="outline" size="sm" onClick={() => setIsOpen(true)}>
        <Upload className="w-4 h-4" />
        导入
      </Button>

      <Modal isOpen={isOpen} onClose={handleClose} title="导入客户" size="xl">
        <div className="space-y-4">
          {/* Upload Area */}
          {previewData.length === 0 && !result && (
            <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
              <input
                ref={fileInputRef}
                type="file"
                accept=".xlsx,.xls,.csv"
                onChange={handleFileChange}
                className="hidden"
                id="customer-import"
              />
              <FileSpreadsheet className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-sm text-foreground mb-2">
                点击或拖拽 Excel 文件到此处
              </p>
              <p className="text-xs text-muted-foreground mb-4">
                支持 .xlsx, .xls, .csv 格式
              </p>
              <label
                htmlFor="customer-import"
                className="inline-flex items-center justify-center font-medium transition-colors px-4 py-2.5 text-sm rounded-lg border border-border bg-transparent hover:bg-secondary cursor-pointer"
              >
                选择文件
              </label>
              <div className="mt-4 text-left bg-muted/50 rounded-lg p-3">
                <p className="text-xs font-medium text-foreground mb-1">
                  Excel 列名对照:
                </p>
                <p className="text-xs text-muted-foreground">
                  客户名称, 税号, 联系人, 电话, 邮箱, 地址, 开户行, 银行账号
                </p>
              </div>
            </div>
          )}

          {/* Preview Table */}
          {previewData.length > 0 && (
            <>
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  预览: {previewData.length} 条记录
                </p>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setPreviewData([])}
                >
                  <X className="w-4 h-4" />
                  清除
                </Button>
              </div>
              <div className="max-h-64 overflow-auto border border-border rounded-lg">
                <table className="w-full text-sm">
                  <thead className="bg-muted sticky top-0">
                    <tr>
                      <th className="px-3 py-2 text-left font-medium">客户名称</th>
                      <th className="px-3 py-2 text-left font-medium">税号</th>
                      <th className="px-3 py-2 text-left font-medium">联系人</th>
                      <th className="px-3 py-2 text-left font-medium">电话</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {previewData.slice(0, 10).map((row, index) => (
                      <tr key={index}>
                        <td className="px-3 py-2 truncate max-w-[150px]">{row.name}</td>
                        <td className="px-3 py-2 truncate max-w-[120px]">{row.taxNumber}</td>
                        <td className="px-3 py-2">{row.contactPerson}</td>
                        <td className="px-3 py-2">{row.phone}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {previewData.length > 10 && (
                  <p className="px-3 py-2 text-xs text-muted-foreground bg-muted">
                    还有 {previewData.length - 10} 条记录...
                  </p>
                )}
              </div>
              <div className="flex gap-3">
                <Button variant="outline" onClick={handleClose} className="flex-1">
                  取消
                </Button>
                <Button onClick={handleImport} disabled={isImporting} className="flex-1">
                  {isImporting ? '导入中...' : `导入 ${previewData.length} 条`}
                </Button>
              </div>
            </>
          )}

          {/* Result */}
          {result && (
            <div className={`p-4 rounded-lg text-center ${
              result.success ? 'bg-green-50' : 'bg-red-50'
            }`}>
              <div className={`w-12 h-12 rounded-full mx-auto mb-3 flex items-center justify-center ${
                result.success ? 'bg-green-100' : 'bg-red-100'
              }`}>
                {result.success ? (
                  <Check className="w-6 h-6 text-green-600" />
                ) : (
                  <X className="w-6 h-6 text-red-600" />
                )}
              </div>
              <p className={`text-sm font-medium ${
                result.success ? 'text-green-700' : 'text-red-700'
              }`}>
                {result.success
                  ? `成功导入 ${result.count} 个客户`
                  : '导入失败，请重试'}
              </p>
              <Button variant="outline" size="sm" onClick={handleClose} className="mt-3">
                关闭
              </Button>
            </div>
          )}
        </div>
      </Modal>
    </>
  );
}
