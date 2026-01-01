import { Icon } from '@/components/ui/Icon';
import { cn } from '@/lib/utils';

type Props = {
  name: string;
  color: string;
  size?: 'sm' | 'md';
  onClick?(): void;
  onEdit?(): void;
  onRemove?(): void;
};
export const TagItem = ({
  color,
  name,
  size = 'md',
  onClick,
  onEdit,
  onRemove,
}: Props) => {
  const isSmall = size === 'sm';

  return (
    <div
      className={cn('flex items-center gap-1 rounded-full', {
        'px-3 py-1': !isSmall,
        'px-2 py-0.5': isSmall,
      })}
      style={{
        backgroundColor: color,
        cursor: onClick ? 'pointer' : undefined,
      }}
      onClick={onClick}
    >
      <span
        className={cn('text-white font-medium', {
          'text-sm': !isSmall,
          'text-xs': isSmall,
        })}
      >
        #{name}
      </span>
      {onEdit && (
        <button
          type="button"
          className="ml-1"
          onClick={(e) => {
            e.stopPropagation();
            onEdit();
          }}
        >
          <Icon name="pen" width={isSmall ? 12 : 16} className="text-white" />
        </button>
      )}
      {onRemove && (
        <button
          type="button"
          className="ml-1"
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
        >
          <Icon name="trash" width={isSmall ? 12 : 16} className="text-white" />
        </button>
      )}
    </div>
  );
};
