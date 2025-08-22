
import { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Upload, File, X, Shield } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface FileUploadData {
  salesDeed: File[];
  ror: File[];
  naksha: File[];
}

interface FileUploadStepProps {
  data: FileUploadData;
  onChange: (data: Partial<FileUploadData>) => void;
}

const FileUploadStep = ({ data, onChange }: FileUploadStepProps) => {
  const { toast } = useToast();
  const [activeCategory, setActiveCategory] = useState<'salesDeed' | 'ror' | 'naksha'>('salesDeed');

  const acceptedFormats = ['pdf', 'jpg', 'jpeg', 'png', 'doc', 'docx'];
  const maxFileSize = 10 * 1024 * 1024; // 10MB
  const maxFilesPerCategory = 3;

  const categories = [
    { key: 'salesDeed' as const, label: 'Sales Deed (First Page)', icon: File },
    { key: 'ror' as const, label: 'ROR (Record of Rights)', icon: File },
    { key: 'naksha' as const, label: 'Naksha (Map/Plan)', icon: File }
  ];

  const validateFile = (file: File): boolean => {
    const extension = file.name.split('.').pop()?.toLowerCase();
    
    if (!extension || !acceptedFormats.includes(extension)) {
      toast({
        title: "Invalid File Format",
        description: `${file.name} - Please upload files in PDF, JPG, PNG, DOC, or DOCX format.`,
        variant: "destructive"
      });
      return false;
    }

    if (file.size > maxFileSize) {
      toast({
        title: "File Too Large",
        description: `${file.name} - File size must be less than 10MB.`,
        variant: "destructive"
      });
      return false;
    }

    return true;
  };

  const handleFiles = (fileList: FileList, category: 'salesDeed' | 'ror' | 'naksha') => {
    const newFiles = Array.from(fileList);
    const validFiles: File[] = [];
    const currentFiles = data[category] || [];

    if (currentFiles.length + newFiles.length > maxFilesPerCategory) {
      toast({
        title: "Too Many Files",
        description: `You can upload a maximum of ${maxFilesPerCategory} files per category.`,
        variant: "destructive"
      });
      return;
    }

    newFiles.forEach(file => {
      if (validateFile(file)) {
        validFiles.push(file);
      }
    });

    if (validFiles.length > 0) {
      onChange({ [category]: [...currentFiles, ...validFiles] });
    }
  };

  const removeFile = (category: 'salesDeed' | 'ror' | 'naksha', index: number) => {
    const currentFiles = data[category] || [];
    const updatedFiles = currentFiles.filter((_, i) => i !== index);
    onChange({ [category]: updatedFiles });
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const CategoryUpload = ({ category }: { category: 'salesDeed' | 'ror' | 'naksha' }) => {
    const categoryData = categories.find(c => c.key === category)!;
    const files = data[category] || [];

    return (
      <div className="space-y-4">
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
          <Upload className="h-8 w-8 text-gray-400 mx-auto mb-3" />
          <p className="text-sm font-medium text-gray-700 mb-2">
            Upload {categoryData.label}
          </p>
          <p className="text-xs text-gray-500 mb-3">
            PDF, JPG, PNG, DOC, DOCX (Max 10MB)
          </p>
          <input
            type="file"
            multiple
            accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
            onChange={(e) => e.target.files && handleFiles(e.target.files, category)}
            className="hidden"
            id={`file-upload-${category}`}
          />
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => document.getElementById(`file-upload-${category}`)?.click()}
          >
            Select Files
          </Button>
          <p className="text-xs text-gray-500 mt-2">
            {files.length}/{maxFilesPerCategory} files uploaded
          </p>
        </div>

        {files.length > 0 && (
          <div className="space-y-2">
            {files.map((file, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <File className="h-4 w-4 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-700">{file.name}</p>
                    <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                  </div>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeFile(category, index)}
                  className="text-red-500 hover:text-red-700"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-brand-red/10 rounded-full mb-4">
          <Upload className="h-8 w-8 text-brand-red" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Document Upload</h3>
        <p className="text-gray-600">Upload property documents in organized categories</p>
      </div>

      <div className="space-y-8">
        {categories.map((category) => (
          <div key={category.key} className="space-y-3">
            <Label className="text-lg font-semibold text-gray-900 flex items-center">
              <category.icon className="h-5 w-5 mr-2 text-brand-red" />
              {category.label}
            </Label>
            <CategoryUpload category={category.key} />
          </div>
        ))}
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <Shield className="h-5 w-5 text-blue-600 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-blue-900">Privacy Notice</p>
            <p className="text-sm text-blue-700">
              We respect your privacy. Your information will be kept confidential and used only for legal consultation purposes.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FileUploadStep;
