import Sidebar from '../components/Sidebar';
import { useAuth } from '../context/AuthContext';
import NotFound from './NotFound';

const Forum = () => {
    const { user } = useAuth();
    return (
        <div className="relative min-h-screen flex">
            <Sidebar user={user} />
            <div className="flex-1">
                <NotFound />
            </div>
        </div>
    );
};

export default Forum;