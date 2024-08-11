import './LoginModal.scss'
import Modal from '../Basic/Modal/Modal'
import Input from '../Basic/Input/Input'
import Button from '../Basic/Button/Button'

type Props = {
    open: boolean,
    setOpen: (open: boolean) => void
    setSignUpModalOpen: (open: boolean) => void
}

export default function SignUpModal(props: Props) {
  const { open, setOpen, setSignUpModalOpen } = props

  return (
    <div id='login-modal-container'>
      <Modal
          modalOpen={open}
          setModalOpen={() => setOpen(false)}
          contentJSX={
              <div id='login-modal-content'>
                  <h2>Login</h2>
                  <div className='input-container'>
                    <Input label='Email' type='email' />
                    <Input label='Password' type='password' />
                  </div>
                  <div className='btns-container'>
                    <Button color={'green'} size={'large'}>
                      Login
                    </Button>
                    <button onClick={() => {
                        setOpen(false);
                        setSignUpModalOpen(true)
                    }}>
                      <p>I don't have an account</p>
                    </button>
                  </div>
              </div>
          }
      />
    </div>
  )
}