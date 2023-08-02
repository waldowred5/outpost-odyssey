import {
  MarketplaceSectionContainer,
  StyledMarketplace, Tile, TileContainer
} from './styles';
import { useFunctions } from 'reactfire';
import { httpsCallable } from 'firebase/functions';
import { useEffect } from 'react';

export const Marketplace = () => {
  const functions = useFunctions();
  const checkForNewMarketplaceShips = httpsCallable(functions, 'checkForNewMarketplaceShips');

  useEffect(() => {
    (async () => {
      const result = await checkForNewMarketplaceShips({ message: 'When can I see new ships, yo?' });
      console.log('result', result.data);
      return result;
    })();
  }, []);

  return (
    <StyledMarketplace>
      <h1>MARKETPLACE</h1>
      <MarketplaceSectionContainer>
        <h3>SHIPS</h3>
        <TileContainer>
          <Tile>Ship</Tile>
          <Tile>Ship</Tile>
          <Tile>Ship</Tile>
          <Tile>Ship</Tile>
          <Tile>Ship</Tile>
          <Tile>Ship</Tile>
          <Tile>Ship</Tile>
          <Tile>Ship</Tile>
        </TileContainer>
      </MarketplaceSectionContainer>
      <MarketplaceSectionContainer>
        <h3>SHIP PARTS STORE COMING SOON...</h3>
      </MarketplaceSectionContainer>
      <MarketplaceSectionContainer>
        <h3>TALENT POOL COMING SOON...</h3>
      </MarketplaceSectionContainer>
    </StyledMarketplace>
  );
};
