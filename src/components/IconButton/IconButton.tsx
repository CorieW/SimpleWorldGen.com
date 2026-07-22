import type { ButtonHTMLAttributes } from 'react';

type Props = Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'aria-label' | 'children' | 'type'> & {
    icon: string;
    label: string;
};

export default function IconButton({ icon, label, className = '', title, ...props }: Props) {
    return (
        <button
            {...props}
            type='button'
            className={`ui-button icon-btn ${className}`}
            aria-label={label}
            title={title || label}
        >
            <i className={`fa-solid ${icon}`} aria-hidden='true'></i>
        </button>
    );
}
