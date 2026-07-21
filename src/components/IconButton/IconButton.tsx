import type { ButtonHTMLAttributes } from 'react';

type Props = Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> & {
    icon: string;
    label: string;
};

export default function IconButton({ icon, label, className = '', title, ...props }: Props) {
    return (
        <button
            type='button'
            className={`ui-button icon-btn ${className}`}
            aria-label={label}
            title={title || label}
            {...props}
        >
            <i className={`fa-solid ${icon}`} aria-hidden='true'></i>
        </button>
    );
}
