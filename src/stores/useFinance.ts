// TODO: Check this store for unused code

import { create } from 'zustand';
import useCrew from './useCrew';

export type PayrollItems = {
  weeklySalaries: number,
}

interface FinanceState {
  balance: number,
  income: number,
  payroll: PayrollItems,
  resolveWeekEndFinance: () => void,
  updateBalance: (amount: number) => void,
  setBalance: (amount: number) => void,
  updateIncome: (amount: number) => void,
  setIncome: (amount: number) => void,
  updateWeeklySalaries: () => void,
}

export default create<FinanceState>((set) => {
  return {
    balance: 0,
    income: 0,
    payroll: {
      weeklySalaries: 0,
    },

    // Actions
    resolveWeekEndFinance: () => {
      set((state) => {
        return {
          balance: state.balance + state.income,
        };
      });

      set((state) => {
        return {
          income: state.payroll.weeklySalaries,
        };
      });
    },

    updateBalance: (amount: number) => {
      set((state) => {
        return {
          balance: state.balance + amount,
        };
      });
    },

    setBalance: (amount: number) => {
      set(() => {
        return {
          balance: amount,
        };
      });
    },

    updateIncome: (amount: number) => {
      set((state) => {
        return {
          income: state.income + amount,
        };
      });
    },

    setIncome: (amount: number) => {
      set(() => {
        return {
          income: amount,
        };
      });
    },

    updateWeeklySalaries: () => {
      set(() => {
        return {
          payroll: {
            weeklySalaries: useCrew.getState().crew.reduce((acc, crewMember) => {
              return acc + crewMember.weeklySalary;
            }, 0),
          }
        };
      });
    },
  };
});
