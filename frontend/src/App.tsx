import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.scss';
import Editor from './views/Editor/Editor';
import { ReactElement } from 'react';
import NotificationBar from './components/NotificationBar/NotificationBar';
import useStore from './ts/appStore';
import Home from './views/Home/Home';
import Settings from './views/Settings/Settings';
import NotFound404 from './views/NotFound404/NotFound404';
import Nav from './components/Nav/Nav';
import Footer from './components/Footer/Footer';
import routing from './ts/routing';

function App(): ReactElement {
    const { notifications, removeNotification } = useStore();

    return (
        <div id='app-container'>
            <Nav />
            <div id='notification-bar'>
                <NotificationBar
                    notifications={notifications}
                    closeNotification={removeNotification}
                />
            </div>
            <div id='content'>
                <Router>
                    <Routes>
                        <Route path={routing.HOME_ROOT} element={<Home />} />
                        <Route path={routing.EDITOR_ROOT} element={<Editor />} />
                        <Route path={routing.SETTINGS_ROOT} element={<Settings />} />
                        <Route path='*' element={<NotFound404 />} />
                    </Routes>
                </Router>
            </div>
            <Footer />
        </div>
    );
}

export default App;
