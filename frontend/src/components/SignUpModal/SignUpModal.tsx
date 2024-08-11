import './SignUpModal.scss'
import Modal from '../Basic/Modal/Modal'
import Input from '../Basic/Input/Input'
import Button from '../Basic/Button/Button'

type Props = {
    open: boolean,
    setOpen: (open: boolean) => void
    setLoginModalOpen: (open: boolean) => void
}

export default function SignUpModal(props: Props) {
  const { open, setOpen, setLoginModalOpen } = props

  return (
    <div id='sign-up-modal-container'>
      <Modal
          modalOpen={open}
          setModalOpen={() => setOpen(false)}
          contentJSX={
            <div id='sign-up-modal-content'>
                <h2>Sign Up</h2>
                <div className='input-container'>
                  <Input label='Email' type='email' />
                  <Input label='Username' type='text' />
                  <Input label='Password' type='password' />
                  <Input label='Confirm Password' type='password' />
                </div>
                <div className='btns-container'>
                  <Button color={'green'} size={'large'}>
                    Sign Up
                  </Button>
                  <button onClick={() => {
                    setOpen(false); setLoginModalOpen(true)
                  }}>
                    <p>I already have an account</p>
                  </button>
                </div>
            </div>
          }
      />
    </div>
  )
}