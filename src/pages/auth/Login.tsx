import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../../contexts/AuthContext.tsx';
import { login } from '../../api/auth.ts';
import AuthForm from '../../components/AuthForm.tsx';

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
                {
                    name: 'email',
                    label: 'Email',
                    type: 'email',
                    placeholder: 'your.own@email.com'
                },
                {
                    name: 'password',
                    label: 'Password',
                    type: 'password',
                    placeholder: '••••••••'
                }
            ]}
            submitLabel="Login"
            onSubmit={handleLogin}
            footerText="Don't have an account?"
            footerLink="Register"
            footerHref="/register"
            columns={1}
            validatePasswords={false}
        />
    );
};

export default Login;