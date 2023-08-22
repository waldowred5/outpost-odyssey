import { useNavigate } from 'react-router-dom';
import {
  ContentWrapperLeft,
  ContentWrapperRight,
  Divider,
  FeatureTile,
  FeatureTileHeading,
  FeatureTileParagraph,
  HeroContainer,
  HeroHeading,
  HeroSubHeading,
  HeroButton,
  LoginButtonWrapper,
} from './styles';
import { useSigninCheck } from 'reactfire';
import { REACT_FIRE_HOOK_STATUS } from '../../../types/constants.ts';

export const Home = () => {
  const navigate = useNavigate();
  const { status, data: signInCheckResult } = useSigninCheck();

  const onRegistrationButtonClick = () => {
    navigate('/register');
  };

  const onLoginButtonClick = () => {
    navigate('/login');
  };

  const onResumeButtonClick = () => {
    navigate('/dashboard');
  };

  return (
    <>
      <LoginButtonWrapper>
        {
          !signInCheckResult?.signedIn
          ? <HeroButton disabled={status === REACT_FIRE_HOOK_STATUS.LOADING} onClick={onLoginButtonClick}>LOGIN</HeroButton>
          : <HeroButton disabled={status === REACT_FIRE_HOOK_STATUS.LOADING} onClick={onResumeButtonClick}>CONTINUE</HeroButton>
        }
      </LoginButtonWrapper>
      <HeroContainer>
        <HeroHeading>OUTPOST ODYSSEY</HeroHeading>
        <HeroSubHeading>Build and manage your very own outpost in space, for profit and glory</HeroSubHeading>
        <HeroButton onClick={onRegistrationButtonClick}>
          PLAY NOW FOR FREE*
        </HeroButton>
      </HeroContainer>
      <Divider/>
      <FeatureTile $color={'red'}>
        <ContentWrapperLeft>
          <FeatureTileHeading>BUILD YOUR OUTPOST</FeatureTileHeading>
          <FeatureTileParagraph>Upgrade your outpost by adding more levels and installing rooms like the ship
            yard, research lab,
            canteen, living quarters and many more</FeatureTileParagraph>
        </ContentWrapperLeft>
      </FeatureTile>
      <FeatureTile $color={'blue'}>
        <ContentWrapperRight>
          <FeatureTileHeading>HIRE YOUR CREW</FeatureTileHeading>
          <FeatureTileParagraph>Employ pilots, engineers, scientists and other crew members and grow a thriving
            community in your
            outpost </FeatureTileParagraph>
        </ContentWrapperRight>
      </FeatureTile>
      <FeatureTile $color={'orange'}>
        <ContentWrapperLeft>
          <FeatureTileHeading>COMPLETE YOUR FLEET</FeatureTileHeading>
          <FeatureTileParagraph>Purchase the fastest, toughest and most deadly space ships in the galaxy and fit them
            out with the best
            parts galactic credits can buy</FeatureTileParagraph>
        </ContentWrapperLeft>
      </FeatureTile>
      <FeatureTile $color={'purple'}>
        <ContentWrapperRight>
          <FeatureTileHeading>GET THE JOB DONE</FeatureTileHeading>
          <FeatureTileParagraph>Load your crew into your best ships then send them out on dangerous and lucrative
            contracts to make a
            profit </FeatureTileParagraph>
        </ContentWrapperRight>
      </FeatureTile>
      <FeatureTile $color={'green'}>
        <ContentWrapperLeft>
          <FeatureTileHeading>BE THE BEST</FeatureTileHeading>
          <FeatureTileParagraph>Compete with other players to reach the highest ranks in the galaxy for big rewards in
            each season</FeatureTileParagraph>
        </ContentWrapperLeft>
      </FeatureTile>
      <Divider/>
      <HeroButton onClick={onRegistrationButtonClick}>
        PLAY NOW FOR FREE*
      </HeroButton>
    </>
  );
};
