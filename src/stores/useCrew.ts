// TODO: Check this store for unused code

import { create } from 'zustand';
import {
  getRandomFirstName,
  getRandomLastName
} from '../content/names';
import useFinance from './useFinance';

export enum Gender {
  Male = 'Male',
  Female = 'Female',
  // Unknown = 'Unknown',
}

const getRandomGender = () => {
  const newGenderIndex = Math.floor(Math.random() * Object.keys(Gender).length);
  return Object.values(Gender)[newGenderIndex];
};

export type Crew = {
  gender: Gender,
  firstName: string,
  lastName: string,
  weeklySalary: number,
  // skills: {},
}

interface CrewState {
  crew: Crew[],
  selectedCrewMemberIndex: number,
  createRandomCrewMember: () => void,
  insertCrewMember: (crewMember: Crew) => void,
  deleteCrewMember: (crewMemberIndex: number) => void,
  updateSelectedCrewMemberIndex: (index: number) => void,
}

export default create<CrewState>((set) => {
  return {
    crew: [],
    selectedCrewMemberIndex: 0,

    // Actions
    createRandomCrewMember: () => {
      const genderString = getRandomGender();
      const gender = Gender[genderString];

      const firstName = getRandomFirstName(gender);
      const lastName = getRandomLastName();

      const weeklySalary = -950 - Math.floor(Math.random() * 650);

      const newCrewMember: Crew = {
        gender,
        firstName,
        lastName,
        weeklySalary,
      };

      set((state) => {
        return {
          crew: [...state.crew, newCrewMember],
        };
      });

      set((state) => {
        return {
          selectedCrewMemberIndex: state.crew.length - 1
        };
      });

      const daysLeft = 7;
      const proRatedWeeklySalary = Math.floor((weeklySalary / 7) * daysLeft);
      useFinance.getState().updateIncome(proRatedWeeklySalary);
      useFinance.getState().updateWeeklySalaries();
    },

    insertCrewMember: (crewMember: Crew) => {
      set((state) => {
        return {
          crew: [...state.crew, crewMember],
        };
      });
    },

    deleteCrewMember: (crewMemberIndex: number) => {
      set((state) => {
        if (state.crew[crewMemberIndex]) {
          const daysLeft = 7;
          const proRatedWeeklySalary = Math.floor((state.crew[crewMemberIndex].weeklySalary / 7) * daysLeft);
          useFinance.getState().updateIncome(-proRatedWeeklySalary);

          state.crew.splice(crewMemberIndex, 1);

          return {
            crew: [...state.crew],
          };
        }

        return {};
      });

      useFinance.getState().updateWeeklySalaries();
    },

    updateSelectedCrewMemberIndex: (index: number) => {
      set(() => {
        return {
          selectedCrewMemberIndex: index
        };
      });
    }
  };
});
