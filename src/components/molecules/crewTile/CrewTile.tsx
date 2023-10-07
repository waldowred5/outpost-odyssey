import { BsFillPersonFill } from 'react-icons/bs';
import { Tile, TileImage, TileText } from './styles.ts';
import { useEffect, useRef } from 'react';
import useTimer from '../../../stores/useTimer.ts';
import { CrewMember } from '../../../types/models.ts';

interface CrewTileProps {
  crewData: CrewMember,
  crewId: string,
}

export const CrewTile = ({ crewData, crewId }: CrewTileProps) => {
  const serverTimeRef = useRef(useTimer.getState().currentServerTime);
  const crewTileButtonRef = useRef<HTMLButtonElement | null>(null);
  const crewTileHeadingRef = useRef<HTMLHeadingElement | null>(null);

  useEffect(() => useTimer.subscribe(
    (state) => {
      serverTimeRef.current = state.currentServerTime;

      const { currentServerTime } = state;

      if (!crewTileHeadingRef.current || !currentServerTime?.seconds) {
        return;
      }

      const timeLeft = crewData.availableAfter ? Math.ceil(crewData.availableAfter.seconds - currentServerTime.seconds) : -1;

      crewTileHeadingRef.current.textContent = `${timeLeft.toString()} SEC`;
    }
  ), []);

  const disabled = !crewData.isAvailable;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', rowGap: '4px' }}>
      <Tile
        key={crewId}
        ref={crewTileButtonRef}
        onClick={() => console.log(`crew ${crewId} selected`, crewData)}
        disabled={disabled}
      >
        <TileImage>
          <BsFillPersonFill style={{ fontSize: '32px' }}/>
        </TileImage>
        {
          disabled ?
            <TileText>
              <p>{crewData.firstName} {crewData.lastName}</p>
              <h3>AVAILABLE IN</h3>
              <h3
                ref={crewTileHeadingRef}
              >-</h3>
            </TileText> :
            <TileText>
              <p>{crewData.firstName} {crewData.lastName}</p>
              <p>LEVEL: {crewData.level}</p>
              <p>ROLE: {crewData.role}</p>
            </TileText>
        }
      </Tile>
    </div>
  );
};
