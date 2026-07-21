import type { ReactNode } from 'react';
import './Sidebar.scss';
import { Button } from '@chakra-ui/react';

type Props = {
    open: boolean;
    onClose: () => void;
    title: string;
    children: ReactNode;
    footer: ReactNode;
};

export default function Sidebar({ open, onClose, title, children, footer }: Props) {
    return (
        <aside
            className={`sidebar ${open ? '' : 'hidden'}`}
            aria-hidden={!open}
            aria-label={title}
        >
            <div className='sidebar-header'>
                <div>
                    <span className='sidebar-eyebrow'>World tools</span>
                    <h2>{title}</h2>
                </div>
                <Button className='close-btn icon-btn' aria-label={`Close ${title}`} title='Close' onClick={onClose}>
                    <i className='fa-solid fa-times' aria-hidden='true'></i>
                </Button>
            </div>
            <div className='content-container'>{children}</div>
            <div className='bottom-bar-container'>{footer}</div>
        </aside>
    );
}
