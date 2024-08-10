export interface INotification {
    id: string;
    text: string;
    type: 'info' | 'success' | 'warning' | 'error';
}