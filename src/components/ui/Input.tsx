import { InputHTMLAttributes } from 'react';

import { cn } from '@/lib/utils';

type InputProps = InputHTMLAttributes<HTMLInputElement>;

type Props = Omit<InputProps, 'onChange'> & {
  onChange: (value: string) => void;
};
export const Input = ({ value, onChange, className, ...props }: Props) => {
  return (
    <input
      className={cn(
        'border border-gray-300 rounded p-2 focus:border-blue-500 outline-none',
        className,
      )}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      {...props}
    />
  );
};
