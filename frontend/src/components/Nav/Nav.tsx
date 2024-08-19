import { useRef } from 'react'
import './Nav.scss'
import useStore from '../../ts/appStore'
import LoginModal from '../Auth/LoginModal/LoginModal'
import SignUpModal from '../Auth/SignUpModal/SignUpModal'

export default function Nav() {
    const { account } = useStore()

    const signUpModalRef = useRef<any>(null)
    const loginModalRef = useRef<any>(null)

    const nonUserJSX = (
        <>
            <li>
                <button onClick={() => signUpModalRef.current.openModal()}>
                    Sign Up
                </button>
            </li>
            <li>
                <button onClick={() => loginModalRef.current.openModal()}>
                    Login
                </button>
            </li>
        </>
    )

    const userJSX = (
        <>
            <li><button>Logout</button></li>
        </>
    )

    return (
        <div id='nav'>
            {<SignUpModal ref={signUpModalRef} />}
            {<LoginModal ref={loginModalRef} />}
            <h1><a href='/'>SimpleWorldGen.com</a></h1>
            <ul>
                {account ? userJSX : nonUserJSX}
            </ul>
        </div>
    )
}