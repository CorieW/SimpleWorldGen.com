import { forwardRef, useImperativeHandle, useRef } from 'react'
import '../auth.scss';
import Input from '../../../components/Basic/Input/Input';
import Button from '../../../components/Basic/Button/Button';
import useStore from '../../../ts/appStore';
import SignUpModal from '../SignUpModal/SignUpModal';

const LoginModal = forwardRef((_, ref) => {
    const { openModal } = useStore()

    const signUpModalRef = useRef<any>(null)

    useImperativeHandle(ref, () => ({
        openModal(): void {
            openModal({
                contentJSX: contentJSX,
            })
        },
    }));

    const contentJSX = (
        <div id='auth-modal-content'>
            <h2>Login</h2>
            <div className='input-container'>
                <Input label='Email' type='email' />
                <Input label='Password' type='text' />
            </div>
            <div className='btns-container'>
                <Button color={'green'} size={'large'}>
                    Login
                </Button>
                <button onClick={() => signUpModalRef.current.openModal()}>
                    <p>I don't have an account</p>
                </button>
            </div>
            <SignUpModal ref={signUpModalRef} />
       </div>
    );

    return <></>
})

export default LoginModal;