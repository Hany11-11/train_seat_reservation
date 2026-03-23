import { useState, useEffect, useCallback } from 'react';
import { Input } from '@/components/atoms/Input';
import { Label } from '@/components/ui/label';
import { PassengerDetails } from '@/types/booking';
import { validateNIC, getNICInfo } from '@/utils/nicHelpers';
import { AlertCircle, CheckCircle2 } from 'lucide-react';
import { authService } from '@/services/authService';

interface CustomerFormProps {
  onSubmit: (details: PassengerDetails, isNewUser: boolean) => void;
  initialData?: Partial<PassengerDetails>;
}

export const CustomerForm = ({ onSubmit, initialData }: CustomerFormProps) => {
  const [formData, setFormData] = useState<PassengerDetails>({
    nic: initialData?.nic || '',
    name: initialData?.name || '',
    email: initialData?.email || '',
    mobile: initialData?.mobile || '',
  });
  const [nicStatus, setNicStatus] = useState<'idle' | 'valid' | 'invalid' | 'checking' | 'existing'>('idle');
  const [isNewUser, setIsNewUser] = useState(true);
  const [errors, setErrors] = useState<Partial<Record<keyof PassengerDetails, string>>>({});
  const [isCheckingNic, setIsCheckingNic] = useState(false);

  const checkExistingUser = useCallback(async (nic: string) => {
    if (!validateNIC(nic)) {
      setNicStatus('invalid');
      return;
    }

    setIsCheckingNic(true);
    setNicStatus('checking');

    try {
      const result = await authService.findByNic(nic);
      
      if (result.exists && result.user) {
        setNicStatus('existing');
        setIsNewUser(false);
        setFormData(prev => ({
          ...prev,
          name: result.user?.name || '',
          email: result.user?.email || '',
          mobile: result.user?.mobile || '',
        }));
      } else {
        setNicStatus('valid');
        setIsNewUser(true);
        setFormData(prev => ({
          ...prev,
          name: '',
          email: '',
          mobile: '',
        }));
      }
    } catch (error) {
      setNicStatus('valid');
      setIsNewUser(true);
    } finally {
      setIsCheckingNic(false);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (formData.nic.length >= 10) {
        checkExistingUser(formData.nic);
      } else {
        setNicStatus('idle');
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [formData.nic, checkExistingUser]);

  const handleChange = (field: keyof PassengerDetails, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof PassengerDetails, string>> = {};
    
    if (!validateNIC(formData.nic)) {
      newErrors.nic = 'Please enter a valid NIC number';
    }
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    if (!formData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    if (!formData.mobile.trim() || !/^0[0-9]{9}$/.test(formData.mobile)) {
      newErrors.mobile = 'Please enter a valid mobile number (e.g., 0771234567)';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onSubmit(formData, isNewUser);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* NIC Field */}
      <div className="space-y-2">
        <Label htmlFor="nic">National Identity Card (NIC)</Label>
        <div className="relative">
          <Input
            id="nic"
            value={formData.nic}
            onChange={(e) => handleChange('nic', e.target.value.toUpperCase())}
            placeholder="Enter your NIC number"
            className={errors.nic ? 'border-destructive' : ''}
          />
          {isCheckingNic && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
          )}
          {!isCheckingNic && nicStatus === 'valid' && (
            <CheckCircle2 className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-success" />
          )}
          {!isCheckingNic && nicStatus === 'existing' && (
            <CheckCircle2 className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-info" />
          )}
          {!isCheckingNic && nicStatus === 'invalid' && (
            <AlertCircle className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-destructive" />
          )}
        </div>
        {errors.nic && <p className="text-sm text-destructive">{errors.nic}</p>}
        {nicStatus === 'existing' && (
          <p className="text-sm text-info">Welcome back! Your details have been auto-filled.</p>
        )}
        {nicStatus === 'valid' && !isCheckingNic && (
          <p className="text-sm text-muted-foreground">New user - please fill in your details</p>
        )}
      </div>

      {/* Name Field */}
      <div className="space-y-2">
        <Label htmlFor="name">Full Name</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => handleChange('name', e.target.value)}
          placeholder="Enter your full name"
          disabled={nicStatus === 'existing'}
          className={errors.name ? 'border-destructive' : ''}
        />
        {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
      </div>

      {/* Email Field */}
      <div className="space-y-2">
        <Label htmlFor="email">Email Address</Label>
        <Input
          id="email"
          type="email"
          value={formData.email}
          onChange={(e) => handleChange('email', e.target.value)}
          placeholder="Enter your email"
          disabled={nicStatus === 'existing'}
          className={errors.email ? 'border-destructive' : ''}
        />
        {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
      </div>

      {/* Mobile Field */}
      <div className="space-y-2">
        <Label htmlFor="mobile">Mobile Number</Label>
        <Input
          id="mobile"
          value={formData.mobile}
          onChange={(e) => handleChange('mobile', e.target.value)}
          placeholder="0771234567"
          disabled={nicStatus === 'existing'}
          className={errors.mobile ? 'border-destructive' : ''}
        />
        {errors.mobile && <p className="text-sm text-destructive">{errors.mobile}</p>}
      </div>

      <button type="submit" className="hidden" />
    </form>
  );
};

export default CustomerForm;
