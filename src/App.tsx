import './App.scss';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Editor from './components/Editor/Editor';
import { ReactElement } from 'react';
import NotificationBar from './components/NotificationBar/NotificationBar';
import useStore from './ts/appStore';
import Footer from './components/Footer/Footer';
import EditorOverlay from './components/Editor/EditorOverlay/EditorOverlay';
import Modal from './components/Basic/Modal/Modal';
import FirebaseTest from './components/FirebaseTest/FirebaseTest';

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
            <Router>
                <Routes>
                    <Route path='*' element={
                        <>
                            <div id='content'>
                                <Editor />
                                <EditorOverlay />
                            </div>
                            <Footer />
                            <Modal
                                modal={openModals.length > 0 ? openModals[openModals.length - 1] : null}
                                open={openModals.length > 0}
                                closeFunc={closeLastModal}
                            />
                        </>
                    } />
                    <Route path='/firebase' element={<FirebaseTest />} />
                </Routes>
            </Router>
        </div>
    );
}

export default App;
