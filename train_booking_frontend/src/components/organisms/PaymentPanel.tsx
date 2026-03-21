import { useState } from 'react';
import { Button } from '@/components/atoms/Button';
import { Input } from '@/components/atoms/Input';
import { Label } from '@/components/ui/label';
import { CreditCard, Lock, CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PaymentPanelProps {
  amount: number;
  onPaymentComplete: () => void;
  isProcessing?: boolean;
}

export const PaymentPanel = ({ amount, onPaymentComplete, isProcessing = false }: PaymentPanelProps) => {
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [cardName, setCardName] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'bank'>('card');

  const formatCardNumber = (value: string) => {
    const cleaned = value.replace(/\D/g, '');
    const groups = cleaned.match(/.{1,4}/g);
    return groups ? groups.join(' ').substring(0, 19) : '';
  };

  const formatExpiry = (value: string) => {
    const cleaned = value.replace(/\D/g, '');
    if (cleaned.length >= 2) {
      return `${cleaned.substring(0, 2)}/${cleaned.substring(2, 4)}`;
    }
    return cleaned;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onPaymentComplete();
  };

  return (
    <div className="bg-card rounded-xl border border-border p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
          <CreditCard className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h3 className="font-semibold text-foreground">Payment Details</h3>
          <p className="text-sm text-muted-foreground">Secure payment processing</p>
        </div>
      </div>

      {/* Payment method tabs */}
      <div className="flex gap-2 mb-6">
        <button
          type="button"
          onClick={() => setPaymentMethod('card')}
          className={cn(
            'flex-1 py-3 px-4 rounded-lg border-2 transition-all',
            paymentMethod === 'card'
              ? 'border-primary bg-primary/10 text-primary'
              : 'border-border hover:border-primary/50'
          )}
        >
          <CreditCard className="w-5 h-5 mx-auto mb-1" />
          <span className="text-sm font-medium">Card</span>
        </button>
        <button
          type="button"
          onClick={() => setPaymentMethod('bank')}
          className={cn(
            'flex-1 py-3 px-4 rounded-lg border-2 transition-all',
            paymentMethod === 'bank'
              ? 'border-primary bg-primary/10 text-primary'
              : 'border-border hover:border-primary/50'
          )}
        >
          <Lock className="w-5 h-5 mx-auto mb-1" />
          <span className="text-sm font-medium">Bank Transfer</span>
        </button>
      </div>

      {paymentMethod === 'card' ? (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="cardName">Cardholder Name</Label>
            <Input
              id="cardName"
              value={cardName}
              onChange={(e) => setCardName(e.target.value)}
              placeholder="John Doe"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="cardNumber">Card Number</Label>
            <Input
              id="cardNumber"
              value={cardNumber}
              onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
              placeholder="1234 5678 9012 3456"
              maxLength={19}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="expiry">Expiry Date</Label>
              <Input
                id="expiry"
                value={expiry}
                onChange={(e) => setExpiry(formatExpiry(e.target.value))}
                placeholder="MM/YY"
                maxLength={5}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cvv">CVV</Label>
              <Input
                id="cvv"
                type="password"
                value={cvv}
                onChange={(e) => setCvv(e.target.value.replace(/\D/g, '').substring(0, 3))}
                placeholder="•••"
                maxLength={3}
                required
              />
            </div>
          </div>

          <div className="flex items-center gap-2 p-3 bg-success/10 rounded-lg text-success text-sm">
            <Lock className="w-4 h-4" />
            <span>Your payment is secured with SSL encryption</span>
          </div>

          <Button 
            type="submit" 
            className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-semibold"
            disabled={isProcessing}
          >
            {isProcessing ? (
              <span className="flex items-center gap-2">
                <span className="animate-spin w-4 h-4 border-2 border-current border-t-transparent rounded-full" />
                Processing...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                Pay LKR {amount.toLocaleString()}
              </span>
            )}
          </Button>
        </form>
      ) : (
        <div className="space-y-4">
          <div className="p-4 bg-muted/50 rounded-lg">
            <h4 className="font-medium mb-2">Bank Transfer Details</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Bank:</span>
                <span className="font-medium">Bank of Ceylon</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Account:</span>
                <span className="font-medium">1234567890</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Branch:</span>
                <span className="font-medium">Fort Branch</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Amount:</span>
                <span className="font-bold text-accent">LKR {amount.toLocaleString()}</span>
              </div>
            </div>
          </div>

          <p className="text-sm text-muted-foreground">
            After completing the bank transfer, click the button below to confirm your booking.
          </p>

          <Button 
            onClick={onPaymentComplete}
            className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-semibold"
            disabled={isProcessing}
          >
            I've Completed the Transfer
          </Button>
        </div>
      )}
    </div>
  );
};
