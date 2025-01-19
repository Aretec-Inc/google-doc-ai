import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

const Breadcrumb = () => {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter((x) => x);

  const getBreadcrumbName = (path) => {
    // Convert path to display name
    switch(path.toLowerCase()) {
      case 'hitlinterface':
        return 'HITL Interface';
      case 'dashboard':
        return 'Dashboard';
      case 'home':
        return 'Home';
      case 'submission':
        return 'Submission';
      case 'configuration':
        return 'Configuration';
      default:
        // Try to format the string nicely if it's a submission name or other path
        return path.split('-').map(word => 
          word.charAt(0).toUpperCase() + word.slice(1)
        ).join(' ');
    }
  };

  // If we're at the root path, don't show breadcrumbs
  if (pathnames.length === 0) return null;

  return (
    <nav className="flex items-center h-8" aria-label="Breadcrumb">
      <ol className="flex items-center space-x-2">
        {pathnames.map((path, index) => {
          const routeTo = `/${pathnames.slice(0, index + 1).join('/')}`;
          const isLast = index === pathnames.length - 1;

          return (
            <li key={path} className="flex items-center text-sm">
              {index > 0 && (
                <ChevronRight className="mx-2 h-4 w-4 text-gray-400" />
              )}
              {isLast ? (
                <span className="text-gray-800 font-medium">
                  {getBreadcrumbName(path)}
                </span>
              ) : (
                <Link
                  to={routeTo}
                  className="text-gray-500 hover:text-gray-700"
                >
                  {getBreadcrumbName(path)}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default Breadcrumb;