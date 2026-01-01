import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui';
import { WordStatus } from '@/requests/types';

type Props = {
  value: WordStatus;
  onValueChange: (value: WordStatus) => void;
  disabled?: boolean;
  className?: string;
  placeholder?: string;
};

export const WordStatusSelect = ({
  value,
  onValueChange,
  disabled,
  className,
  placeholder = 'Select status',
}: Props) => {
  return (
    <Select
      value={value}
      onValueChange={(val: string) => onValueChange(val as WordStatus)}
      disabled={disabled}
    >
      <SelectTrigger className={className}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="not_learning">Not learning right now</SelectItem>
        <SelectItem value="learning">Learning right now</SelectItem>
        <SelectItem value="learned">Learned</SelectItem>
      </SelectContent>
    </Select>
  );
};
