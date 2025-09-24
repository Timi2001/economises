import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';

const withAuth = (WrappedComponent: React.ComponentType) => {
  const AuthComponent = (props: any) => {
    const router = useRouter();
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
      const token = Cookies.get('token');
      if (!token) {
        router.replace('/admin/login');
      } else {
        setIsAuthenticated(true);
      }
    }, [router]);

    if (!isAuthenticated) {
      return null; // Or a loading spinner
    }

    return <WrappedComponent {...props} />;
  };

  return AuthComponent;
};

export default withAuth;
