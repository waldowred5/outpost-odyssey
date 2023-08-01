import { Link, useNavigate } from 'react-router-dom';
import { FormEvent, useState } from 'react';
import { useAuth } from 'reactfire';
// import { useAuth } from '../../../context/AuthContext';
import { AuthContainer } from './styles';
import { createUserWithEmailAndPassword } from 'firebase/auth';

// TODO: Welcome email on register
// TODO: Email verification on register

export const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [, setError] = useState('');

  const auth = useAuth();
  // const { signUp } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');

    try {
      await createUserWithEmailAndPassword(auth, email, password);
      navigate('/dashboard');
    } catch (error) {
      const { message } = error as Error;

      setError(message);
      console.log(message);
    }
  };

  return (
    <AuthContainer>
      <h1>Register</h1>
      <form
        onSubmit={handleSubmit}
      >
        <input onChange={(event) => setEmail(event.target.value)} type="text" placeholder="Email"/>
        <input onChange={(event) => setPassword(event.target.value)} type="password" placeholder="Password"/>
        <button>Register</button>
      </form>
      <p>Already have an account? <Link to='/login'>Login</Link></p>
    </AuthContainer>
  );
};
