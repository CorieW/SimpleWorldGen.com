import { useEffect, type ReactNode } from 'react';
import IconButton from '../IconButton/IconButton';
import './ToolPanel.scss';

type Props = {
    open: boolean;
    onClose: () => void;
    title: string;
    eyebrow?: string;
    children: ReactNode;
    footer?: ReactNode;
};

export default function ToolPanel({ open, onClose, title, eyebrow = 'World tools', children, footer }: Props) {
    useEffect(() => {
        if (!open) return;
        const closeOnEscape = (event: KeyboardEvent) => event.key === 'Escape' && onClose();
        window.addEventListener('keydown', closeOnEscape);
        return () => window.removeEventListener('keydown', closeOnEscape);
    }, [onClose, open]);

    if (!open) return null;

    return (
        <aside className='tool-panel' role='dialog' aria-modal='true' aria-label={title}>
            <header>
                <div>
                    <span>{eyebrow}</span>
                    <h2>{title}</h2>
                </div>
                <IconButton icon='fa-xmark' label={`Close ${title}`} className='panel-close' onClick={onClose} />
            </header>
            <div className='tool-panel-content'>{children}</div>
            {footer && <footer>{footer}</footer>}
        </aside>
    );
}
