import { forwardRef, useImperativeHandle, useRef } from 'react'
import '../auth.scss'
import Input from '../../../components/Basic/Input/Input'
import Button from '../../../components/Basic/Button/Button'
import useStore from '../../../ts/appStore'
import LoginModal from '../LoginModal/LoginModal'
// import LoginModalProps from '../LoginModalProps/LoginModalProps'

const SignUpModal = forwardRef((_, ref) => {
  const { openModal } = useStore()

  const loginModalRef = useRef<any>(null)

  useImperativeHandle(ref, () => ({
    openModal(): void {
      openModal({
        contentJSX: contentJSX,
      })
    },
  }));

  const contentJSX = (
    <div id='auth-modal-content'>
      <h2>Sign Up</h2>
      <div className='input-container'>
        <Input label='Email' type='email' />
        <Input label='Username' type='text' />
        <Input label='Display Name' type='text' />
        <Input label='Password' type='password' />
        <Input label='Confirm Password' type='password' />
      </div>
      <div className='btns-container'>
        <Button color={'green'} size={'large'}>
          Sign Up
        </Button>
        <button onClick={() => loginModalRef.current.openModal()}>
          <p>I already have an account</p>
        </button>
      </div>
      <LoginModal ref={loginModalRef} />
    </div>
  );

  return <></>
})

export default SignUpModal;