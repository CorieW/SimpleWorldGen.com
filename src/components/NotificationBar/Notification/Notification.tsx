import { useEffect, useState } from 'react'
import './Notification.scss'
import { INotification } from './INotification'

type Props = {
    notification: INotification
    closeNotification: () => void
}

export default function Notification({ notification, closeNotification }: Props) {
    const { text, type } = notification

    const [isFading, setIsFading] = useState<boolean>(false)

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsFading(true);
        }, 10000);

        return () => {
            clearTimeout(timer);
        }
    }, []);

    useEffect(() => {
        if (!isFading) return;

        const timer = setTimeout(() => {
            closeNotification();
        }, 1000);

        return () => {
            clearTimeout(timer);
        }
    }, [isFading, closeNotification]);

    function getTypeIcon() {
        switch (type) {
            case 'success':
                return 'fas fa-check-circle'
            case 'info':
                return 'fas fa-info-circle'
            case 'warning':
                return 'fas fa-exclamation-circle'
            case 'error':
                return 'fas fa-times-circle'
            default:
                return 'fas fa-info-circle'
        }
    }

    return (
        <div className={`notification-container ${type} ${isFading ? 'fading' : ''}`} role={type === 'error' ? 'alert' : 'status'}>
            <div className='content-container'>
                <i className={getTypeIcon()}></i>
                <p dangerouslySetInnerHTML={{ __html: text }}></p>
            </div>
            <div className='close-container'>
                <button className='close-btn' aria-label='Dismiss notification' onClick={() => closeNotification()}>
                    <i className='fas fa-times' aria-hidden='true'></i>
                </button>
            </div>
        </div>
    )
}
