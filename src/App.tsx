import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.scss';
import Editor from './views/Editor/Editor';
import { ReactElement } from 'react';
import NotificationBar from './components/NotificationBar/NotificationBar';
import useStore from './appStore';

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
                    <Route path='*' element={<Editor />} />
                </Routes>
            </Router>
        </div>
    );
}

export default App;
