import { create } from 'zustand';
import { INotification } from '../components/NotificationBar/Notification/INotification';
import IAccount from './interfaces/generation/IAccount';

type AppStore = {
    account: IAccount | null;
    setAccount: (account: IAccount) => void;

    notifications: INotification[];
    addNotification: (notification: { text: string; type: string }) => void;
    removeNotification: (notification: INotification) => void;
    clearNotifications: () => void;
};

const useStore = create<AppStore>((set) => ({
    account: null,
    setAccount: (account) => set({ account }),

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