import { toast } from "react-toastify";
import { register } from "../../api/auth";
import AuthForm from "../../components/AuthForm";

const Register = () => {
    const handleRegister = async (data: Record<string, string>) => {
        await register({
            firstName: data.firstName,
            lastName: data.lastName,
            username: data.username,
            email: data.email,
            password: data.password
        });

        toast.info(`Activation email sent to: ${data.email}`, {
            position: "bottom-right",
            autoClose: 10000,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
        });
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
        />
    );
};

export default Register;