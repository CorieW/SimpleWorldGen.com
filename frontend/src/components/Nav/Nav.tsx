import { useState } from 'react';
import './Nav.scss'
import useStore from '../../ts/appStore'
import SignUpModal from '../SignUpModal/SignUpModal'
import LoginModal from '../LoginModal/LoginModal'
import routing from '../../ts/routing';

type Props = {}

export default function Nav({}: Props) {
    const { account } = useStore()

    const [signUpModalOpen, setSignUpModalOpen] = useState(false);
    const [loginModalOpen, setLoginModalOpen] = useState(false);

    const nonUserJSX = (
        <>
            <li><button onClick={() => setSignUpModalOpen(!signUpModalOpen)}>Sign Up</button></li>
            <li><button onClick={() => setLoginModalOpen(!loginModalOpen)}>Login</button></li>
        </>
    )

    const userJSX = (
        <>
            <li><button>Logout</button></li>
        </>
    )

    return (
        <>
            <SignUpModal open={signUpModalOpen} setOpen={setSignUpModalOpen} setLoginModalOpen={setLoginModalOpen} />
            <LoginModal open={loginModalOpen} setOpen={setLoginModalOpen} setSignUpModalOpen={setSignUpModalOpen} />
            <div id='nav'>
                <h1><a href='/'>SimpleWorldGen.com</a></h1>
                <ul>
                    <li><a href={routing.EDITOR_ROOT} id='editor-btn'>Create a world</a></li>
                    {account ? userJSX : nonUserJSX}
                </ul>
            </div>
        </>
    )
}