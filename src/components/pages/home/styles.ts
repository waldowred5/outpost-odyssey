import { styled } from 'styled-components';

export const HeroContainer = styled.div`
  // Display
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  
  // Sizing
  width: 100vw;
  height: 100vh;
`;

export const HeroHeading = styled.h1`
  // Font
  font-size: 96px;
`;

export const HeroSubHeading = styled.p`
  // Font
  font-size: 32px;
`;

export const HeroButton = styled.button`
  // Colors
  color: black;
  
  // Display
  border: none;

  // Font
  font-size: 18px;
  font-weight: bold;
  text-decoration: none;
  
  // Sizing
  height: 60px;
  
  // Spacing
  margin: 36px;
  padding: 20px;
  
  &:hover {
    // Colors
    background-color: lightgray;
  }
`;

export const LoginButtonWrapper = styled.div`
  // Display
  display: flex;
  flex: 0;
  z-index: 10;
  
  // Position
  position: sticky;
  top: 24px;
  right: 24px;
  justify-content: flex-end;
`;

export const Divider = styled.div`
  // Colors
  background-color: grey;
  
  // Sizing
  width: 100vw;
  height: 4px;
`;

interface FeatureTileProps {
  $color: string
}

export const FeatureTile = styled.div<FeatureTileProps>`
  // Colors
  background-color: ${props => props.$color};
  
  // Display
  display: flex;
  align-items: flex-end;
  
  // Sizing
  height: 40vh;
  width: 100vw;
  
  // Spacing
  padding: 32px;
`;

export const ContentWrapperLeft = styled.div`
  // Display
  display: flex;
  flex-direction: column;
  flex: 1;
  align-items: start;
  text-align: start;
  width: 100%;
`;

export const ContentWrapperRight = styled.div`
  // Display
  display: flex;
  flex-direction: column;
  flex: 1;
  align-items: flex-end;
  text-align: end;
  width: 100%;
`;

export const FeatureTileHeading = styled.h3`
  // Display
  display: flex;
`;

export const FeatureTileParagraph = styled.p`
  // Font
  font-size: 12px;
  
  // Sizing
  width: 50%;
`;
