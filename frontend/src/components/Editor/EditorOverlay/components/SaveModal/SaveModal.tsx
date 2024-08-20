import { forwardRef, useImperativeHandle, useRef } from 'react'
import './SaveModal.scss'
import useStore from '../../../../../ts/appStore'
import LoginModal from '../../../../Auth/LoginModal/LoginModal'

const SaveModal = forwardRef((_, ref) => {
    const { account, openModal } = useStore()

    const loginModalRef = useRef<any>(null)

    useImperativeHandle(ref, () => ({
        openModal(): void {
            if (!account) {
                loginModalRef.current.openModal()
                return;
            }

            openModal({
                contentJSX: <></>,
                width: 'xl',
                height: 'xl',
                useExactHeight: true,
            })
        },
    }));

    return <><LoginModal ref={loginModalRef} /></>
})

export default SaveModal;