import { useNavigate } from 'react-router-dom';
import { register } from '../api/auth';
import AuthForm from '../components/AuthForm';

const Register = () => {
    const navigate = useNavigate();

    const handleRegister = async ({ firstName, lastName, email, password }) => {
        await register({ firstName, lastName, email, password });
        navigate('/login');
    };

    return (
        <AuthForm
            title="Create an Account"
            subtitle="Join us today!"
            fields={[
                { name: 'firstName', label: 'First Name', type: 'text' },
                { name: 'lastName', label: 'Last Name', type: 'text' },
                { name: 'email', label: 'Email', type: 'email' },
                { name: 'password', label: 'Password', type: 'password' }
            ]}
            submitLabel="Register"
            onSubmit={handleRegister}
            footerText="Already have an account?"
            footerLink="Login"
            footerHref="/login"
        />
    );
};

export default Register;
