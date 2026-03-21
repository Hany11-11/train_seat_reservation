import { useState } from 'react';
import { Search, X } from 'lucide-react';
import { Input } from '@/components/atoms/Input';
import { cn } from '@/lib/utils';

interface SearchFieldProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export const SearchField = ({ value, onChange, placeholder = 'Search...', className }: SearchFieldProps) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className={cn('relative', className)}>
      <Search className={cn(
        'absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors',
        isFocused ? 'text-primary' : 'text-muted-foreground'
      )} />
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="pl-10 pr-10"
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
      />
      {value && (
        <button
          type="button"
          onClick={() => onChange('')}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};
