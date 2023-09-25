import { Timestamp } from 'firebase-admin/firestore';
import { SHIP_CLASS } from './shipTypes.ts';

// EVENTS
export type GameEvent = {
  availableAfter: Timestamp,
  entityId: string,
  eventType: string,
  isAvailable: boolean,
}

export type GameEvents = {
  [key: string]: GameEvent,
}

// SHIPS
export type Ship = {
  availableAfter: Timestamp,
  isAvailable: boolean,
  price: number,
  purchasedAt: Timestamp,
  className: string,
  fuelCapacity: number,
  fuelCurrent: number,
  hullCapacity: number,
  hullCurrent: number,
}

export type ShipBlueprint = {
  price: number,
  className: keyof typeof SHIP_CLASS,
  fuelCapacity: number,
  hullCapacity: number,
}
