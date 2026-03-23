import { Select as RadixSelect, SelectContent, SelectItem, SelectTrigger, SelectValue, SelectGroup, SelectLabel } from '@/components/ui/select';

export const Select = ({ children, ...props }: any) => (
  <RadixSelect {...props}>
    {children}
  </RadixSelect>
);

export { SelectContent, SelectItem, SelectTrigger, SelectValue, SelectGroup, SelectLabel };
