import { forwardRef } from "react";

interface TextAreaProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
  placeholder: string;
}

const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
  ({ value, onChange, onKeyDown, placeholder }, ref) => {
    return (
      <textarea
        ref={ref}
        className="flex h-[80px] border border-input grow text-lg ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none resize-none"
        value={value}
        onChange={onChange}
        onKeyDown={onKeyDown}
        placeholder={placeholder}
      />
    );
  }
);

export default TextArea;
