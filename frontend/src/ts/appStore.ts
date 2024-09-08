import { create } from 'zustand';
import { INotification } from '../components/NotificationBar/Notification/INotification';
import IAccount from './interfaces/generation/IAccount';
import { IModal } from '../components/Basic/Modal/Modal';

type AppStore = {
    openModals: IModal[];
    openModal: (modal: IModal) => void;
    openModalOnTop: (modal: IModal) => void;
    closeModal: (modal: IModal) => void;
    closeTopModal: () => void;
    closeAllModals: () => void;

    account: IAccount | null;
    setAccount: (account: IAccount) => void;

    notifications: INotification[];
    addNotification: (notification: { text: string; type: string }) => void;
    removeNotification: (notification: INotification) => void;
    clearNotifications: () => void;

    whatIsThis: string | null;
    setWhatIsThis: (whatIsThis: string | null) => void;
};

const useStore = create<AppStore>((set, get) => ({
    openModals: [],
    openModal: (modal) => set((state) => ({ openModals: [modal] })),
    openModalOnTop: (modal) => set((state) => ({ openModals: [...state.openModals, modal] })),
    closeModal: (modal) => set((state) => ({ openModals: state.openModals.filter((m) => m !== modal) })),
    closeTopModal: () => set((state) => ({ openModals: state.openModals.slice(0, -1) })),
    closeAllModals: () => set({ openModals: [] }),

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

    whatIsThis: null,
    setWhatIsThis: (whatIsThis) => set({ whatIsThis }),
}));

export default useStore;