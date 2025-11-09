import { Link } from 'react-router-dom';

export const Header = () => {
  return (
    <header>
      <div className="container mx-auto px-4 flex">
        <nav>
          <ul>
            <li>
              <Link to="/">Home Page</Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};
