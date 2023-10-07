import { getAuth, connectAuthEmulator } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';
import { getFunctions, connectFunctionsEmulator } from 'firebase/functions';
import { getStorage, connectStorageEmulator } from 'firebase/storage';
import {
  useFirebaseApp,
  FirestoreProvider,
  AuthProvider,
  FunctionsProvider,
} from 'reactfire';
import { AppRoutes } from './routes/Routes.tsx';
import { GlobalStyles } from './globalStyles.ts';
import { TimersAuthWrapper } from './controllers/TimersAuthWrapper.tsx';
import { Leva } from 'leva';

function App() {
  const app = useFirebaseApp();
  const firestoreInstance = getFirestore(app);
  const storageInstance = getStorage(app);
  const authInstance = getAuth(app);
  const functionsInstance = getFunctions(app);

  const isLocalhost = window.location.hostname === 'localhost';

  if (isLocalhost) {
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
          <GlobalStyles/>
          <AppRoutes/>
          <TimersAuthWrapper/>
          {
            isLocalhost
              ? <Leva
                collapsed={true}
                hidden={false}/>
              : null
          }
        </FunctionsProvider>
      </AuthProvider>
    </FirestoreProvider>
  );
}

export default App;
