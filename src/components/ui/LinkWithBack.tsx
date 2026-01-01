import { Link, LinkProps, useLocation } from 'react-router-dom';

type Props = LinkProps & React.RefAttributes<HTMLAnchorElement>;
export const LinkWithBack = ({ to, ...props }: Props) => {
  const location = useLocation();
  const pathname = typeof to === 'string' ? to : to.pathname;
  const search = typeof to === 'string' ? '' : to.search || '';

  const separator = (search || pathname || '').includes('?') ? '&' : '?';
  const toWithBackUrl = `${pathname}${search}${separator}backUrl=${encodeURIComponent(location.pathname + location.search)}`;

  return <Link to={toWithBackUrl} {...props} />;
};
