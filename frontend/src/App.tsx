import './App.scss';
import Editor from './components/Editor/Editor';
import { ReactElement } from 'react';
import NotificationBar from './components/NotificationBar/NotificationBar';
import useStore from './ts/appStore';
import Nav from './components/Nav/Nav';
import Footer from './components/Footer/Footer';
import EditorOverlay from './components/Editor/EditorOverlay/EditorOverlay';
import Modal from './components/Basic/Modal/Modal';

function App(): ReactElement {
    const { openModals, closeTopModal: closeLastModal, notifications, removeNotification } = useStore();

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
            <Modal
                modal={openModals.length > 0 ? openModals[openModals.length - 1] : null}
                open={openModals.length > 0}
                closeFunc={() => {
                    closeLastModal();
                }}
            />
        </div>
    );
}

export default App;
