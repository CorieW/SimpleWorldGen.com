import { create } from 'zustand';
import { INotification } from './components/NotificationBar/Notification/INotification';

type AppStore = {
    notifications: INotification[];
    addNotification: (notification: { type: string; text: string; }) => void;
    removeNotification: (notification: INotification) => void;
    clearNotifications: () => void;
};

const useStore = create<AppStore>((set) => ({
    notifications: [],
    addNotification: (notification) =>
        set((state) => ({
            notifications: [
                ...state.notifications,
                { id: Math.random().toString(), ...notification } as INotification,
            ],
        })),
    removeNotification: (notification) =>
        set((state) => ({
            notifications: state.notifications.filter((n) => n.id !== notification.id),
        }),
    ),
    clearNotifications: () => set({ notifications: [] }),
}));

export default useStore;
