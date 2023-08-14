// import {
//   ReactNode,
//   useEffect,
//   useState,
//   useContext,
//   createContext,
// } from 'react';
// import { auth, db } from '../firebase';
// import { setDoc, doc } from 'firebase/firestore';
// import {
//   Auth,
//   UserCredential,
//   User,
//   createUserWithEmailAndPassword,
//   signInWithEmailAndPassword,
//   sendPasswordResetEmail,
//   onAuthStateChanged,
//   signOut,
// } from 'firebase/auth';
// import usePlayer from '../stores/usePlayer';
//
// export interface AuthProviderProps {
//   children?: ReactNode
// }
//
// export interface AuthContextModel {
//   isFetching: boolean
//   auth: Auth
//   user: User | null
//   signIn: (email: string, password: string) => Promise<UserCredential>
//   signUp: (email: string, password: string) => Promise<UserCredential>
//   logout: () => Promise<void>
//   sendPasswordResetEmail?: (email: string) => Promise<void>
// }
//
// export const PlayerContext = createContext<AuthContextModel>(
//   {} as AuthContextModel,
// );
//
// export const AuthContextProvider = ({ children }: AuthProviderProps) => {
//   const playerSubscribe = usePlayer((store) => store.subscribe);
//   const [isFetching, setIsFetching] = useState(true);
//   const [user, setUser] = useState<User | null>(null);
//
//   const signUp = async (email: string, password: string): Promise<UserCredential> => {
//     const userCredential = await createUserWithEmailAndPassword(auth, email, password);
//
//     // TODO: Extract this to a cloud function that sets up a user when a new user document is added to the user collection
//     try {
//       await setDoc(doc(db, 'players', userCredential.user?.uid), {
//         email: userCredential.user?.email,
//         uid: userCredential.user?.uid,
//         balance: 123456,
//       });
//     } catch (error) {
//       console.log(error);
//     }
//
//     return userCredential;
//   };
//
//   const signIn = (email: string, password: string): Promise<UserCredential> => {
//     return signInWithEmailAndPassword(auth, email, password);
//   };
//
//   const logout = (): Promise<void> => {
//     return signOut(auth);
//   };
//
//   const resetPassword = (email: string): Promise<void> => {
//     return sendPasswordResetEmail(auth, email);
//   };
//
//   useEffect(() => {
//     // firebase notification if a user is set
//     const unsubscribe = onAuthStateChanged(auth,(user) => {
//       setUser(user);
//       playerSubscribe(user?.uid);
//       setIsFetching(false);
//     });
//
//     return unsubscribe;
//   }, []);
//
//   const values = {
//     auth,
//     resetPassword,
//     signIn,
//     signUp,
//     logout,
//     user,
//     isFetching,
//   };
//
//   return (
//     <PlayerContext.Provider value={values}>
//       {children}
//     </PlayerContext.Provider>
//   );
// };
//
// export const useAuth = (): AuthContextModel => {
//   return useContext(PlayerContext);
// };
//
// // USAGE
// // const { signIn } = useAuth();
