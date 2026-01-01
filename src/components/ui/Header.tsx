import { Link, useLocation } from 'react-router-dom';

import { Icon } from './Icon';

export const Header = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const backUrl = searchParams.get('backUrl');

  return (
    <header className="w-full py-3 bg-blue-300 fixed top-0 left-0 z-50">
      <div className="max-w-[360px] mx-auto px-4 h-9 flex items-center">
        {backUrl && (
          <Link to={backUrl}>
            <Icon name="arrowLeft" className="text-white" />
          </Link>
        )}
      </div>
    </header>
  );
};
