import { NavLink } from 'react-router-dom';

import { Icon, IconName } from '@/components/ui';
import { cn } from '@/lib/utils';

type NavBarItemProps = {
  to: string;
  iconName: IconName;
  title: string;
};
const NavBarItem = ({ to, iconName, title }: NavBarItemProps) => {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        cn(
          'py-2 flex gap-1 flex-col items-center text-center font-medium transition-[color] duration-300  hover:text-blue-700',
          {
            'text-white': !isActive,
            'text-blue-600': isActive,
          },
        )
      }
    >
      <Icon name={iconName} width={32} className="text-inherit" />
      <p className="text-[10px]">{title}</p>
    </NavLink>
  );
};

export const NavBar = () => {
  return (
    <div className="w-full py-1 bg-blue-300 fixed bottom-0 left-0 z-50">
      <div className="max-w-[360px] mx-auto px-2">
        <ul className="flex">
          <li className="basis-1/3">
            <NavBarItem to="/words" iconName="globe" title="Words" />
          </li>
          <li className="basis-1/3">
            <NavBarItem to="/tags" iconName="tags" title="Tags" />
          </li>
          <li className="basis-1/3">
            <NavBarItem to="/user" iconName="bars" title="Settings" />
          </li>
        </ul>
      </div>
    </div>
  );
};
