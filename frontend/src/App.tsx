import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.scss';
import Editor from './components/Editor/Editor';
import { ReactElement } from 'react';
import NotificationBar from './components/NotificationBar/NotificationBar';
import useStore from './ts/appStore';
import Nav from './components/Nav/Nav';
import Footer from './components/Footer/Footer';
import EditorOverlay from './components/Editor/EditorOverlay/EditorOverlay';

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
            <Nav />
            <div id='content'>
                <Editor />
                <EditorOverlay />
            </div>
            <Footer />
        </div>
    );
}

export default App;
