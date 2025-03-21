import { useNavigate } from 'react-router-dom';
import MainLayout from '../../components/MainLayout';
import { BiErrorCircle } from 'react-icons/bi';
import Card from '../../components/ui/Card';
import EmptyState from '../../components/ui/EmptyState';
import GradientButton from '../../components/ui/GradientButton';
import {AiOutlineBook} from "react-icons/ai";

const NotFound = () => {
    const navigate = useNavigate();

    return (
        <MainLayout
            title="Page Not Found"
            description="We couldn't find the page you were looking for."
            setActiveTab={() => {}}
        >
            <div className="space-y-6">
                <Card
                    title="Page Not Found"
                    description="The requested page does not exist."
                    icon={<BiErrorCircle size={22} />}
                    scrollable={true}
                    maxHeight="max-h-[50vh]"
                >
                    <EmptyState
                        icon={<div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center shadow-sm">
                            <BiErrorCircle size={48} className="text-gray-400" />
                        </div>}
                        title="This page has gone missing."
                        description="The page you're trying to access doesn't exist or has been moved. Please check the URL or return to the dashboard."
                        action={
                            <GradientButton
                                onClick={() => navigate('/decks')}
                                icon={<AiOutlineBook size={22} />}
                                className="mt-2 py-3 px-6 w-full"
                            >
                                Go to Dashboard
                            </GradientButton>
                        }
                    />
                </Card>
            </div>
        </MainLayout>
    );
};

export default NotFound;