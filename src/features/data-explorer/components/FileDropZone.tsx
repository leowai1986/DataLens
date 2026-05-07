import { useCallback, useState } from 'react';
import { Upload, FileSpreadsheet } from 'lucide-react';
import { cn } from '@shared/utils/cn';

interface Props {
  onFileSelect: (file: File) => void;
  isLoading?: boolean;
}

export const FileDropZone = ({ onFileSelect, isLoading }: Props) => {
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(false);
      const file = e.dataTransfer.files[0];
      if (file) onFileSelect(file);
    },
    [onFileSelect]
  );

  const handleInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) onFileSelect(file);
    },
    [onFileSelect]
  );

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        setIsDragOver(true);
      }}
      onDragLeave={() => setIsDragOver(false)}
      onDrop={handleDrop}
      className={cn(
        'relative flex flex-col items-center justify-center rounded-xl border-2 border-dashed p-12 transition-all',
        isDragOver
          ? 'border-blue-500 bg-blue-50'
          : 'border-slate-300 bg-slate-50 hover:border-slate-400',
        isLoading && 'opacity-50 pointer-events-none'
      )}
    >
      <input
        type="file"
        accept=".csv"
        onChange={handleInput}
        className="absolute inset-0 cursor-pointer opacity-0"
      />
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 mb-4">
        <Upload className="h-8 w-8 text-blue-600" />
      </div>
      <h3 className="text-lg font-semibold text-slate-900">Drop your CSV file here</h3>
      <p className="mt-1 text-sm text-slate-500">or click to browse</p>
      <div className="mt-4 flex items-center gap-2 text-xs text-slate-400">
        <FileSpreadsheet className="h-4 w-4" />
        <span>Supports CSV files up to 50MB</span>
      </div>
    </div>
  );
};
