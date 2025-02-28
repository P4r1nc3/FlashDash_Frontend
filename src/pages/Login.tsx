import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { login } from '../api/auth';
import AuthForm from '../components/AuthForm';

const Login = () => {
    const navigate = useNavigate();
    const auth = useContext(AuthContext);

    const handleLogin = async ({ email, password }) => {
        const { token } = await login({ email, password });
        auth?.login(token);
        navigate('/account');
    };

    return (
        <AuthForm
            title="Welcome Back!"
            subtitle="Login to continue your journey"
            fields={[
                { name: 'email', label: 'Email', type: 'email' },
                { name: 'password', label: 'Password', type: 'password' }
            ]}
            submitLabel="Login"
            onSubmit={handleLogin}
            footerText="Don't have an account?"
            footerLink="Register"
            footerHref="/register"
        />
    );
};

export default Login;
