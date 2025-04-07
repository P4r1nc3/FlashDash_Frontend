import { useNavigate } from 'react-router-dom';
import MainLayout from '../../components/MainLayout';
import Card from '../../components/ui/Card';
import EmptyState from '../../components/ui/EmptyState';
import GradientButton from '../../components/ui/GradientButton';
import { AiOutlineBook } from "react-icons/ai";
import { IoWarningOutline } from "react-icons/io5";

const NotFound = () => {
    const navigate = useNavigate();

    return (
        <MainLayout
            title="Page Not Found"
            description="We couldn't find the page you were looking for."
            setActiveTab={() => {}}
        >
            <div className="space-y-6 h-full flex flex-col">
                <Card
                    title="Page Not Found"
                    description="The requested page does not exist."
                    icon={<IoWarningOutline size={22} />}
                    scrollable={true}
                    fullHeight={true}
                >
                    <EmptyState
                        icon={<IoWarningOutline size={64} className="text-gray-400" />}
                        title="This page has gone missing"
                        description="The page you're trying to access doesn't exist or has been moved."
                        action={
                            <GradientButton
                                onClick={() => navigate('/decks')}
                                icon={<AiOutlineBook size={20} />}
                                className="mt-6 py-2.5 px-6"
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