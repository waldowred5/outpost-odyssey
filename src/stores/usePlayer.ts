import { create } from 'zustand';

type PlayerState = {
  uid: string;
  balance: number;
  // subscribe: (uid?: string) => void;
}

type PlayerStore = PlayerState & {
  // subscribe: (uid?: string) => void;
}

const initialState: PlayerState = { uid: '', balance: 0 };

export default create<PlayerStore>(() => {
  // let removeListener: (() => void) | null = null;

  return {
    ...initialState,
    // async subscribe(uid?: string) {
    //   if (uid === initialState.uid) return;
    //
    //   removeListener?.();
    //   removeListener = uid
    //     ? onSnapshot(
    //       doc(db, 'players', uid),
    //       (doc) => {
    //         const { balance, uid } = doc.data() || initialState;
    //         setState({ balance, uid });
    //       })
    //     : null;
    // },
  };
});
