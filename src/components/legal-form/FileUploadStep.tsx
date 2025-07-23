
import { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Upload, File, X, Shield } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface FileUploadData {
  files: File[];
}

interface FileUploadStepProps {
  data: FileUploadData;
  onChange: (data: Partial<FileUploadData>) => void;
}

const FileUploadStep = ({ data, onChange }: FileUploadStepProps) => {
  const { toast } = useToast();
  const [dragActive, setDragActive] = useState(false);

  const acceptedFormats = ['pdf', 'jpg', 'jpeg', 'png', 'doc', 'docx'];
  const maxFileSize = 10 * 1024 * 1024; // 10MB
  const maxFiles = 5;

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

  const handleFiles = (fileList: FileList) => {
    const newFiles = Array.from(fileList);
    const validFiles: File[] = [];

    if (data.files.length + newFiles.length > maxFiles) {
      toast({
        title: "Too Many Files",
        description: `You can upload a maximum of ${maxFiles} files.`,
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
      onChange({ files: [...data.files, ...validFiles] });
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    
    if (e.dataTransfer.files) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFiles(e.target.files);
    }
  };

  const removeFile = (index: number) => {
    const updatedFiles = data.files.filter((_, i) => i !== index);
    onChange({ files: updatedFiles });
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-brand-red/10 rounded-full mb-4">
          <Upload className="h-8 w-8 text-brand-red" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">File Upload</h3>
        <p className="text-gray-600">Upload supporting documents for your case</p>
      </div>

      <div className="space-y-6">
        <div>
          <Label className="text-sm font-medium text-gray-700 mb-4 block">
            Upload Supporting Documents
          </Label>
          
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              dragActive
                ? 'border-brand-red bg-brand-red/5'
                : 'border-gray-300 hover:border-gray-400'
            }`}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
          >
            <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-lg font-medium text-gray-700 mb-2">
              Drop files here or click to upload
            </p>
            <p className="text-sm text-gray-500 mb-4">
              Supported formats: PDF, JPG, PNG, DOC, DOCX (Max 10MB per file)
            </p>
            <input
              type="file"
              multiple
              accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
              onChange={handleFileInput}
              className="hidden"
              id="file-upload"
            />
            <Button
              type="button"
              variant="outline"
              onClick={() => document.getElementById('file-upload')?.click()}
            >
              Select Files
            </Button>
          </div>

          <p className="text-xs text-gray-500 mt-2">
            Maximum {maxFiles} files, up to 10MB each
          </p>
        </div>

        {data.files.length > 0 && (
          <div className="space-y-3">
            <Label className="text-sm font-medium text-gray-700">
              Uploaded Files ({data.files.length}/{maxFiles})
            </Label>
            {data.files.map((file, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <File className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-700">{file.name}</p>
                    <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                  </div>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeFile(index)}
                  className="text-red-500 hover:text-red-700"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        )}

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
    </div>
  );
};

export default FileUploadStep;
