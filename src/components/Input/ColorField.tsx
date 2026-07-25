import { useId } from 'react';
import './Input.scss';

type Props = {
    color: string;
    onChange: (color: string) => void;
    label?: string;
};

export default function ColorField({ color, onChange, label = 'Color' }: Props) {
    const id = useId().replace(/:/g, '');

    return (
        <div className='input-group'>
            <label htmlFor={`color-${id}`}>{label}</label>
            <div className='color-field-control'>
                <input
                    id={`color-${id}`}
                    type='color'
                    value={/^#[0-9a-f]{6}$/i.test(color) ? color : '#000000'}
                    aria-label={`Choose ${label.toLowerCase()}`}
                    onChange={(event) => onChange(event.target.value)}
                />
                <input
                    type='text'
                    value={color}
                    aria-label={`${label} hex value`}
                    placeholder='#000000'
                    onChange={(event) => onChange(event.target.value)}
                />
            </div>
        </div>
    );
}
