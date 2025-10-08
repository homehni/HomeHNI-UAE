import React from 'react';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  height?: string;
}

export const RichTextEditor: React.FC<RichTextEditorProps> = ({
  value,
  onChange,
  placeholder = "Enter content...",
  height = "200px",
}) => {
  return (
    <div className="bg-background">
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        style={{ height }}
        className="w-full rounded-md border bg-background text-foreground p-3 text-sm outline-none focus:ring-2 focus:ring-primary"
      />
    </div>
  );
};