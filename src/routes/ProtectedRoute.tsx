import { useUser } from 'reactfire';
import { Navigate } from 'react-router-dom';
import { ReactNode } from 'react';
import { CircularProgress, Grid } from '@mui/material';
import { REACT_FIRE_HOOK_STATUS } from '../types/constants.ts';

export interface ProtectedRouteProps {
  children?: ReactNode
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { status, data: user } = useUser();


  if (status === REACT_FIRE_HOOK_STATUS.LOADING) {
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
