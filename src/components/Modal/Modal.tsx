import './Modal.scss'
import { useEffect } from 'react'
import type { ReactNode } from 'react'

type Props = {
    open: boolean
    onClose: () => void
    children: ReactNode
    footer: ReactNode
}

export default function Modal({ open, onClose, children, footer }: Props) {

    useEffect(() => {
        if (!open) return

        function closeOnEscape(event: KeyboardEvent) {
            if (event.key === 'Escape') onClose()
        }

        window.addEventListener('keydown', closeOnEscape)
        return () => window.removeEventListener('keydown', closeOnEscape)
    }, [onClose, open])

    return (
        <div
            className={`outer-modal-container ${!open ? 'hidden' : ''}`}
            role='dialog'
            aria-modal='true'
            aria-hidden={!open}
            aria-label='Editor dialog'
            onMouseDown={(event) => {
                if (event.target === event.currentTarget) onClose()
            }}
        >
            <div className='inner-modal-container'>
                <div className='top-bar'>
                    <span className='modal-grip' aria-hidden='true'></span>
                    <button
                        className='close-modal-btn'
                        aria-label='Close dialog'
                        title='Close'
                        onClick={onClose}
                    >
                        <i className='fa-solid fa-xmark' aria-hidden='true'></i>
                    </button>
                </div>
                <div className='content-container'>
                    {children}
                </div>
                <div className='bottom-bar'>
                    {footer}
                </div>
            </div>
        </div>
    )
}
