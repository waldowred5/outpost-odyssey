// TODO: Check this store for unused code

import { create } from 'zustand';

export enum ShipSize {
  S = 'S', M = 'M', L = 'L'
}

export enum ShipClass {
  Bomber = 'Bomber',
  Fighter = 'Fighter',
  Fighter_Heavy = 'Fighter_Heavy',
  Stealth = 'Stealth',
}

export enum ShipModel {
  TWO = '02',
  FOUR = '04',
}

export enum ColorScheme {
  BLUE_GOLD = 'BLUE_GOLD',
  BLUE_SILVER = 'BLUE_SILVER',
  BLUE_GREEN = 'BLUE_GREEN',
  BLUE_RED = 'BLUE_RED',
  BLUE_BLACK = 'BLUE_BLACK',
  BLUE_BRONZE = 'BLUE_BRONZE',
  RED_SILVER = 'RED_SILVER',
  RED_GOLD = 'RED_GOLD',
  RED_BLUE = 'RED_BLUE',
  ORANGE_GREEN = 'ORANGE_GREEN',
  RED_BLACK = 'RED_BLACK',
  MAROON_SILVER = 'MAROON_SILVER',
  BLACK_BLUE = 'BLACK_BLUE',
  BLACK_SILVER = 'BLACK_SILVER',
  BLACK_ORANGE = 'BLACK_ORANGE',
  BLACK_PINK = 'BLACK_PINK',
  BLACK_BRONZE = 'BLACK_BRONZE',
  BLACK_GREEN = 'BLACK_GREEN',
  PURPLE_GREEN = 'PURPLE_GREEN',
  PURPLE_ORANGE = 'PURPLE_ORANGE',
  PURPLE_SILVER = 'PURPLE_SILVER',
  PURPLE_BLUE = 'PURPLE_BLUE',
  PURPLE_PINK = 'PURPLE_PINK',
  PURPLE_GOLD = 'PURPLE_GOLD',
}

export type Ship = {
  shipClass: ShipClass,
  shipModel: ShipModel,
  colorScheme: ColorScheme,
  shipSize: ShipSize,
}

interface ShipsState {
  ships: Ship[],
  selectedShipIndex: number,
  // createRandomShip: () => void,
  insertShip: (ship: Ship) => void,
  deleteShip: (shipIndex: number) => void,
  updateSelectedShipIndex: (index: number) => void,
}

export default create<ShipsState>((set) => {
  return {
    ships: [],
    selectedShipIndex: 0,

    // Actions
    // createRandomShip: () => {
    //   const newShipClassIndex = Math.floor(Math.random() * Object.keys(ShipClass).length);
    //   const shipClassString = Object.values(ShipClass)[newShipClassIndex];
    //   const shipClass = ShipClass[shipClassString];
    //
    //   const newShipModelIndex = Math.floor(Math.random() * Object.keys(ShipModel).length);
    //   const shipModelString = Object.keys(ShipModel)[newShipModelIndex];
    //   const shipModel = ShipModel[shipModelString];
    //
    //   const newColorSchemeIndex = Math.floor(Math.random() * Object.keys(ColorScheme).length);
    //   const colorSchemeString = Object.values(ColorScheme)[newColorSchemeIndex];
    //   const colorScheme = ColorScheme[colorSchemeString];
    //
    //   const newShip: Ship = {
    //     shipClass,
    //     shipModel,
    //     colorScheme,
    //     shipSize: shipClass === ShipClass.Bomber ? ShipSize.M : ShipSize.S,
    //   };
    //
    //   set((state) => {
    //     return {
    //       ships: [...state.ships, newShip],
    //     };
    //   });
    //
    //   set((state) => {
    //     return {
    //       selectedShipIndex: state.ships.length - 1
    //     };
    //   });
    //
    //   useFinance.getState().updateBalance(-280000 - Math.floor(Math.random() * 50000));
    // },

    insertShip: (ship: Ship) => {
      set((state) => {
        return {
          ships: [...state.ships, ship]
        };
      });
    },

    deleteShip: (shipIndex: number) => {
      set((state) => {
        if (state.ships[shipIndex]) {
          state.ships.splice(shipIndex, 1);

          return {
            ships: [...state.ships],
          };
        }

        return {};
      });

      set((state) => {
        return {
          selectedShipIndex: state.ships.length - 1
        };
      });
    },

    updateSelectedShipIndex: (index: number) => {
      set(() => {
        return {
          selectedShipIndex: index
        };
      });
    }
  };
});
