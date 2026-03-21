import { useState } from 'react';
import { Input } from '@/components/atoms/Input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/atoms/Button';
import { Price } from '@/types/price';

interface PriceFormProps {
  prices: Price[];
  onSave: (prices: { id: string; basePrice: number }[]) => void;
  onCancel: () => void;
}

export const PriceForm = ({ prices, onSave, onCancel }: PriceFormProps) => {
  const [formPrices, setFormPrices] = useState(
    prices.map(p => ({ id: p.id, classType: p.classType, basePrice: p.basePrice }))
  );

  const handlePriceChange = (id: string, value: string) => {
    const numValue = parseFloat(value) || 0;
    setFormPrices(prev => 
      prev.map(p => p.id === id ? { ...p, basePrice: numValue } : p)
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formPrices.map(p => ({ id: p.id, basePrice: p.basePrice })));
  };

  const getClassName = (classType: string) => {
    switch (classType) {
      case '1ST': return 'First Class';
      case '2ND': return 'Second Class';
      case '3RD': return 'Third Class';
      default: return classType;
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {formPrices.map(price => (
        <div key={price.id} className="space-y-2">
          <Label htmlFor={price.id}>{getClassName(price.classType)} (LKR)</Label>
          <Input
            id={price.id}
            type="number"
            min="0"
            step="50"
            value={price.basePrice}
            onChange={(e) => handlePriceChange(price.id, e.target.value)}
          />
        </div>
      ))}

      <div className="flex gap-3 pt-4">
        <Button type="submit" className="flex-1">
          Save Prices
        </Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );
};
