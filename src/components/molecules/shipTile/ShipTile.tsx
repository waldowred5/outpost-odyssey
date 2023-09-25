import { BsRocketTakeoffFill } from 'react-icons/bs';
import { Tile, TileImage, TileText } from './styles.ts';
import { useEffect, useRef } from 'react';
import useTimer from '../../../stores/useTimer.ts';
import { Ship } from '../../../types/models.ts';

interface ShipTileProps {
  shipData: Ship,
  shipId: string,
}

export const ShipTile = ({ shipData, shipId }: ShipTileProps) => {
  const serverTimeRef = useRef(useTimer.getState().currentServerTime);
  const shipTileButtonRef = useRef<HTMLButtonElement | null>(null);
  const shipTileHeadingRef = useRef<HTMLHeadingElement | null>(null);

  useEffect(() => useTimer.subscribe(
    (state) => {
      serverTimeRef.current = state.currentServerTime;

      const { currentServerTime } = state;

      if (!shipTileHeadingRef.current || !currentServerTime?.seconds) {
        return;
      }

      const timeLeft = Math.ceil(shipData.availableAfter.seconds - currentServerTime.seconds);

      shipTileHeadingRef.current.textContent = `${timeLeft.toString()} SEC`;
    }
  ), []);

  const disabled = !shipData.isAvailable;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', rowGap: '4px' }}>
      <Tile
        key={shipId}
        ref={shipTileButtonRef}
        onClick={() => console.log(`ship ${shipId} selected`, shipData)}
        disabled={disabled}
      >
        <TileImage>
          <BsRocketTakeoffFill style={{ fontSize: '32px' }}/>
        </TileImage>
        {
          disabled ?
            <TileText>
              <p>{shipData.className}</p>
              <h3>AVAILABLE IN</h3>
              <h3
                ref={shipTileHeadingRef}
              >-</h3>
            </TileText> :
            <TileText>
              <p>{shipData.className}</p>
              <p>FUEL: {shipData.fuelCurrent / shipData.fuelCapacity * 100}%</p>
              <p>HULL: {shipData.hullCurrent / shipData.hullCapacity * 100}%</p>
            </TileText>
        }
      </Tile>
    </div>
  );
};
