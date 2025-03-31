import { useNavigate, useLocation } from 'react-router-dom';
import { useContext, useEffect } from 'react';
import { AuthContext } from '../../contexts/AuthContext';
import { login, activate } from '../../api/auth';
import AuthForm from '../../components/AuthForm';
import { toast } from 'react-toastify';

const Login = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const auth = useContext(AuthContext);

    useEffect(() => {
        // Parse the URL query parameters
        const queryParams = new URLSearchParams(location.search);
        const token = queryParams.get('token');

        // If token exists, call the activation endpoint
        if (token) {
            const activateAccount = async () => {
                await activate(token);
                navigate('/login', { replace: true });

                await new Promise(resolve => setTimeout(resolve, 400));

                toast.success('Account has been successfully activated!', {
                    position: "bottom-right",
                    autoClose: 10000,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                });
            };
            activateAccount();
        }
    }, [location, navigate]);

    const handleLogin = async (data: Record<string, string>) => {
        const { token } = await login({
            email: data.email,
            password: data.password
        });
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
        />
    );
};

export default Login;