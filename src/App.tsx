import { getAuth, connectAuthEmulator } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';
import { getFunctions, connectFunctionsEmulator } from 'firebase/functions';
import { getStorage, connectStorageEmulator } from 'firebase/storage';
import { Routes } from 'react-router-dom';
import {
  useFirebaseApp,
  FirestoreProvider,
  AuthProvider,
  FunctionsProvider,
} from 'reactfire';

function App() {
  const app = useFirebaseApp();
  const firestoreInstance = getFirestore(app);
  const storageInstance = getStorage(app);
  const authInstance = getAuth(app);
  const functionsInstance = getFunctions(app);
  if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
    // Set up emulators
    connectStorageEmulator(storageInstance, '127.0.0.1', 9199);
    connectAuthEmulator(authInstance, 'http://127.0.0.1:9099', {
      disableWarnings: true,
    });
    connectFirestoreEmulator(firestoreInstance, '127.0.0.1', 8080);
    connectFunctionsEmulator(functionsInstance, '127.0.0.1', 5001);
  }
  return (
    <FirestoreProvider sdk={firestoreInstance}>
      <AuthProvider sdk={authInstance}>
        <FunctionsProvider sdk={functionsInstance}>
          <Routes>
            {/*<Route path="/" element={<Header/>}>*/}
            {/*  <Route index element={<Home/>}/>*/}
            {/*  <Route path="/restaurant/:id" element={<Restaurant/>}/>*/}
            {/*</Route>*/}
          </Routes>
        </FunctionsProvider>
      </AuthProvider>
    </FirestoreProvider>
  );
}

export default App;
