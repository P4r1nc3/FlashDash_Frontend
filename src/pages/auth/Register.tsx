import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { register } from "../../api/auth.ts";
import AuthForm from "../../components/AuthForm.tsx";

const Register = () => {
    const navigate = useNavigate();

    const handleRegister = async ({ firstName, lastName, username, email, password }) => {
        await register({ firstName, lastName, username, email, password });

        toast.info(`Activation email sent to: ${email}`, {
            position: "bottom-right",
            autoClose: 10000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
        });

        navigate("/login");
    };

    return (
        <AuthForm
            title="Create an Account"
            subtitle="Join us today!"
            fields={[
                {
                    name: 'firstName',
                    label: 'First Name',
                    type: 'text',
                    placeholder: 'John'
                },
                {
                    name: 'lastName',
                    label: 'Last Name',
                    type: 'text',
                    placeholder: 'Smith'
                },
                {
                    name: 'username',
                    label: 'Username',
                    type: 'text',
                    placeholder: 'johnsmith'
                },
                {
                    name: 'email',
                    label: 'Email',
                    type: 'email',
                    placeholder: 'john.smith@example.com'
                },
                {
                    name: 'password',
                    label: 'Password',
                    type: 'password',
                    placeholder: '••••••••'
                },
                {
                    name: 'confirmPassword',
                    label: 'Confirm Password',
                    type: 'password',
                    placeholder: '••••••••'
                }
            ]}
            submitLabel="Register"
            onSubmit={handleRegister}
            footerText="Already have an account?"
            footerLink="Login"
            footerHref="/login"
            columns={2}
            validatePasswords={true}
            buttonVariant="primary"
        />
    );
};

export default Register;