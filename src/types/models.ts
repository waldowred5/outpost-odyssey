import { Timestamp } from 'firebase-admin/firestore';

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
  shipClass: string,
}

export type ShipBlueprint = {
  price: number,
  shipClass: string,
}
