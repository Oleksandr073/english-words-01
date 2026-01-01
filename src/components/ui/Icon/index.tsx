import { cn } from '@/lib/utils';

import { IconsMap } from './iconsMap';

export type IconName = keyof typeof IconsMap;

type Props = {
  name: IconName;
  color?: string;
  className?: string;
  width?: number;
  height?: number;
};
export const Icon = ({ name, color, height, width = 20, className }: Props) => {
  const IconComponent = IconsMap[name];
  return (
    <div
      className={cn(
        'flex justify-center items-center text-gray-900',
        className,
      )}
      style={{ height: height ?? width, width, color }}
    >
      <IconComponent />
    </div>
  );
};
