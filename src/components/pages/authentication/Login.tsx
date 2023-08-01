import { Link, useNavigate } from 'react-router-dom';
import { FormEvent, useState } from 'react';
import { useAuth } from 'reactfire';
// import { useAuth } from '../../../context/AuthContext';
import { AuthContainer } from './styles';
import { signInWithEmailAndPassword } from 'firebase/auth';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [, setError] = useState('');

  const auth = useAuth();
  // const { signIn } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');

    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/dashboard');
    } catch (error) {
      const { message } = error as Error;

      setError(message);
      console.log(message);
    }
  };

  return (
    <AuthContainer>
      <h1>Login</h1>
      <form
        onSubmit={handleSubmit}
      >
        <input onChange={(event) => setEmail(event.target.value)} type="text" placeholder="Email"/>
        <input onChange={(event) => setPassword(event.target.value)} type="password" placeholder="Password"/>
        <button>Login</button>
      </form>
      <p>Don't have an account yet? <Link to='/register'>Register</Link></p>
    </AuthContainer>
  );
};
