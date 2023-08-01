import { MarketplaceSectionContainer, StyledMarketplace } from './styles';

export const Marketplace = () => {
  return (
    <StyledMarketplace>
      <h1>MARKETPLACE</h1>
      <h3>TALENT POOL COMING SOON...</h3>
      <MarketplaceSectionContainer/>
      <h3>SHIPS</h3>
      <MarketplaceSectionContainer>
        <p>Some cool ships go here</p>
        <p>Some cool ships go here</p>
        <p>Some cool ships go here</p>
        <p>Some cool ships go here</p>
        <p>Some cool ships go here</p>
        <p>Some cool ships go here</p>
        <p>Some cool ships go here</p>
        <p>Some cool ships go here</p>
      </MarketplaceSectionContainer>
      <h3>SHIP PARTS STORE COMING SOON...</h3>
      <MarketplaceSectionContainer/>
    </StyledMarketplace>
  );
};
