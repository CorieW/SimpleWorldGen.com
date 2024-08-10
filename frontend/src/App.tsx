import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.scss';
import Editor from './views/Editor/Editor';
import { ReactElement } from 'react';
import NotificationBar from './components/NotificationBar/NotificationBar';
import useStore from './appStore';
import Home from './views/Home/Home';
import Settings from './views/Settings/Settings';

function App(): ReactElement {
    const { notifications, removeNotification } = useStore();

    return (
        <div id='app-container'>
            <div id='notification-bar'>
                <NotificationBar
                    notifications={notifications}
                    closeNotification={removeNotification}
                />
            </div>
            <Router>
                <Routes>
                    <Route path='/' element={<Home />} />
                    <Route path='/editor' element={<Editor />} />
                    <Route path='/settings' element={<Settings />} />
                    <Route path='*' element={<Home />} />
                </Routes>
            </Router>
        </div>
    );
}

export default App;
