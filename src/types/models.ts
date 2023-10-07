import { Timestamp } from 'firebase-admin/firestore';
import { SHIP_CLASS } from './shipTypes';

// CREW
export type CrewSkills = {
  aerobatics: number,
  charisma: number,
  computing: number,
  engineering: number,
  leadership: number,
  logistics: number,
  navigation: number,
  science: number,
  weapons: number,
}

export type CrewMember = {
  availableAfter: Timestamp | null,
  isAvailable: boolean,
  firstName: string,
  lastName: string,
  employedBy: string | null,
  role: string,
  level: number,
  // skills: CrewSkills, // TODO: Add skills
}

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
