'use client';

import { useRef } from 'react';
import { Upload, X, Building2 } from 'lucide-react';

interface LogoUploadProps {
  value?: string;
  onChange: (logo: string) => void;
}

export function LogoUpload({ value, onChange }: LogoUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('请选择图片文件');
      return;
    }

    // Validate file size (max 500KB)
    if (file.size > 500 * 1024) {
      alert('图片大小不能超过 500KB');
      return;
    }

    // Convert to base64
    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      onChange(result);
    };
    reader.readAsDataURL(file);

    // Reset input
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  const handleRemove = () => {
    onChange('');
  };

  return (
    <div className="flex items-center gap-4">
      {/* Logo Preview */}
      <div className="relative">
        {value ? (
          <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-muted">
            <img
              src={value}
              alt="Logo"
              className="w-full h-full object-contain"
            />
            <button
              type="button"
              onClick={handleRemove}
              className="absolute -top-1 -right-1 w-5 h-5 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        ) : (
          <div className="w-16 h-16 rounded-lg bg-muted flex items-center justify-center">
            <Building2 className="w-8 h-8 text-muted-foreground" />
          </div>
        )}
      </div>

      {/* Upload Button */}
      <div className="flex-1">
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
          id="logo-upload"
        />
        <label
          htmlFor="logo-upload"
          className="inline-flex items-center gap-2 px-3 py-2 bg-secondary text-secondary-foreground rounded-lg text-sm font-medium cursor-pointer hover:bg-secondary/80 transition-colors"
        >
          <Upload className="w-4 h-4" />
          {value ? '更换 Logo' : '上传 Logo'}
        </label>
        <p className="mt-1 text-xs text-muted-foreground">
          支持 JPG、PNG，最大 500KB
        </p>
      </div>
    </div>
  );
}
