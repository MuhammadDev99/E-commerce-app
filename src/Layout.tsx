import { Outlet } from 'react-router-dom';
import NavigationBar from "./NavigationBar/index.tsx"
import MessageRenderer from './components/MessageRenderer/index.tsx';

const Layout = () => {
    return (
        <div>
            <NavigationBar />
            < main >
                <Outlet />
            </main>
            <MessageRenderer />
        </div>
    );
};

export default Layout;