import { useUser } from 'reactfire';
// import { useAuth } from '../../context/AuthContext';
import { Navigate } from 'react-router-dom';
import { ReactNode } from 'react';
import { CircularProgress, Grid } from '@mui/material';

export interface ProtectedRouteProps {
  children?: ReactNode
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  // const auth = useAuth();
  const { status, data: user } = useUser();


  if (status === 'loading') {
    return (
      <Grid container minHeight={'100vh'} justifyContent="center" alignItems="center">
        <CircularProgress size={'10rem'} />
      </Grid>
    );
  }

  if (!user) {
    return <Navigate to="/" />;
  }

  return children;
};
