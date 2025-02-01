import Footer from './Footer';
import Header from './Header';
import { Outlet } from 'react-router-dom'

const DefaultLayout = () => {


    return (
    <div className="flex flex-col min-h-screen overflow-x-hidden relative">
        {/* <FilteredEllipse /> */}
        <Header />
        <div className="h-full flex-grow">
            <Outlet />
        </div>
        <Footer />
    </div>
    );
};

export default DefaultLayout;
