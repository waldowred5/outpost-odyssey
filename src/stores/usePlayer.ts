import { create } from 'zustand';

type PlayerState = {
  uid: string;
  balance: number;
}

export default create<PlayerState>(() => {
  return {
    uid: '',
    balance: 0
  };
});
