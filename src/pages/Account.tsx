import { useEffect, useState } from 'react';
import { getUserInfo } from '../api/user';
import { User } from '../interfaces/User';

const Account = () => {
    const [user, setUser] = useState<User | null>(null);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                const data = await getUserInfo();
                setUser(data);
            } catch (err: any) {
                setError(err.response?.data?.cause || 'Failed to fetch user information.');
            }
        };

        fetchUserInfo();
    }, []);

    if (error) {
        return <p style={{ color: 'red' }}>{error}</p>;
    }

    return (
        <div>
            <h1>Account</h1>
            {user ? (
                <div>
                    <p><strong>First Name:</strong> {user.firstName}</p>
                    <p><strong>Last Name:</strong> {user.lastName}</p>
                    <p><strong>Email:</strong> {user.email}</p>
                    <p><strong>Created At:</strong> {new Date(user.createdAt).toLocaleString()}</p>
                    <p><strong>Updated At:</strong> {new Date(user.updatedAt).toLocaleString()}</p>
                </div>
            ) : (
                <p>Loading...</p>
            )}
        </div>
    );
};

export default Account;
