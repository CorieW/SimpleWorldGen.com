import './NotificationBar.scss';
import { INotification } from './Notification/INotification';
import Notification from './Notification/Notification';

type Props = {
    notifications: INotification[];
    closeNotification: (notification: INotification) => void;
};

export default function NotificationBar({ notifications, closeNotification }: Props) {
    return (
        <div className='notification-bar-container'>
            {notifications.map((notification) => (
                <Notification key={notification.id} notification={notification} closeNotification={() => closeNotification(notification)} />
            ))}
        </div>
    );
}
