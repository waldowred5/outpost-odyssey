import { StyledPrimaryLayout } from './styles';
import { ReactNode } from 'react';
import { NavBar } from '../../components/organisms/navBar/NavBar';

interface PrimaryLayoutProps {
  children?: ReactNode;
}

export const PrimaryLayout = ({ children }: PrimaryLayoutProps) => {
  return (
    <>
      <StyledPrimaryLayout>
        <NavBar/>
        { children }
      </StyledPrimaryLayout>
    </>
  );
};
