import { StyledPrimaryLayout } from './styles';
import { ReactNode } from 'react';
import { NavBar } from '../../components/organisms/navBar/NavBar';
import { EventQueue } from '../../components/organisms/eventQueue/EventQueue.tsx';

interface PrimaryLayoutProps {
  children?: ReactNode;
}

export const PrimaryLayout = ({ children }: PrimaryLayoutProps) => {
  return (
    <StyledPrimaryLayout>
      <NavBar/>
      <EventQueue/>
      {children}
    </StyledPrimaryLayout>
  );
};
