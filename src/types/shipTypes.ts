import { ShipBlueprint } from './models';

export const SHIP_CLASS = {
  WASP: 'WASP',
  VIPER: 'VIPER',
  PANTHER: 'PANTHER',
};

export const ShipClassWasp: ShipBlueprint = {
  fuelCapacity: 2,
  hullCapacity: 25,
  price: 12500,
  className: SHIP_CLASS.WASP as keyof typeof SHIP_CLASS,
};

export const ShipClassViper: ShipBlueprint = {
  fuelCapacity: 3,
  hullCapacity: 75,
  price: 37125,
  className: SHIP_CLASS.VIPER as keyof typeof SHIP_CLASS,
};

export const ShipClassPanther: ShipBlueprint = {
  fuelCapacity: 5,
  hullCapacity: 225,
  price: 85750,
  className: SHIP_CLASS.PANTHER as keyof typeof SHIP_CLASS,
};

export const SHIP_CLASS_MAP = {
  [SHIP_CLASS.WASP]: ShipClassWasp,
  [SHIP_CLASS.VIPER]: ShipClassViper,
  [SHIP_CLASS.PANTHER]: ShipClassPanther,
};