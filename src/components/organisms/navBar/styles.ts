import { styled } from 'styled-components';

export const StyledStatsBar = styled.div`
  display: flex;
  flex: 1;
  position: absolute;
  z-index: 1000;
  top: 0;
  left: -32px;
  height: 84px;
  justify-content: flex-start;
`;

export const StatTextButtonLabel = styled.h5`
  // Animation
  transition: all 0.2s ease-in-out;
  
  // Color
  color: transparent;
  
  // Font
  font-size: 10px;
  
  // Spacing
  margin-top: 6px;
`;

export const PrimaryTab = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1 1 auto;
  height: 100%;
  align-items: center;
  justify-content: center;
  margin: 0 12px;

  &:hover ${StatTextButtonLabel} {
    color: grey;
  }
`;

type PrimaryStatTextButtonProps = {
  $balance: number,
  $isActiveScene: boolean,
}

export const PrimaryStatTextButton = styled.button<PrimaryStatTextButtonProps>`
  height: 100%;
  padding: 0 36px 0 48px;
  
  background-color: ${(props) => {
    return props.$isActiveScene ? '#003033' : 'transparent';
  }};

  color: ${(props) => {
    return props.$balance === 0 ? '#FFFFFF' : props.$balance < 0 ? '#FF0000' : '#00FF00';
  }};
  
  box-shadow: inset 0 0 6px 2px cyan;
  font-weight: bold;
  font-size: 30px;

  transform: skew(-20deg, 0deg);

  transition: background-color 0.2s ease-in-out;
  
  &:hover {
    background-color: ${props => props.$isActiveScene ? '#003033' : 'cyan'};
    color: ${props => props.$isActiveScene ? 'white' : 'black'};
  }
`;

export const SecondaryTab = styled.div`
  display: flex;
  height: 64px;
  justify-content: flex-start;
  flex: 1;
`;

export const SecondaryStatGrid = styled.div`
  display: flex;
  column-gap: 4px;
  align-items: center;
  z-index: 10;
`;

export const SecondaryStatGridContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  height: 64px;

  &:hover ${StatTextButtonLabel} {
    color: grey;
  }
`;

type StatTextButtonProps = {
  $isActiveScene: boolean,
}

export const StatTextButton = styled.button<StatTextButtonProps>`
  height: 48px;
  width: 78px;
  
  background-color: ${(props) => {
    return props.$isActiveScene ? '#003033' : 'transparent';
  }};
  color: white;
  
  box-shadow: inset 0 0 6px 2px cyan;
  font-weight: bold;
  font-size: 18px;

  transform: skew(-20deg, 0deg);

  transition: all 0.2s ease-in-out;

  &:hover {
    background-color: ${props => props.$isActiveScene ? '#003033' : 'cyan'};
    color: ${props => props.$isActiveScene ? 'white' : 'black'};
  }
`;

export const TextUnskewWrapper = styled.div`
  display: flex;
  column-gap: 10px;
  align-items: center;
  justify-content: center;
  
  transform: skew(20deg, 0deg);
`;

export const TertiaryTab = styled.div`
  display: flex;
  flex-direction: row;
  position: absolute;
  top: 0;
  right: 0;
  margin: 12px;
  column-gap: 12px;
  z-index: 10;
`;

export const TertiaryText = styled.p`
  // Color
  color: grey;
  
  // Font
  font-size: 18px;
`;

export const TertiaryButton = styled.button`
  // Color
  background-color: grey;
  color: white;
  padding: 0 6px;
  height: 22px;
  font-size: 14px;
  
  &:hover {
    background-color: lightgray;
    color: black;
  }
`;
