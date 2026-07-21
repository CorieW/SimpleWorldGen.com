import { useId } from 'react';
import './Input.scss';

type InputValue = string | number;
type Option = { value: InputValue; label: string };
type CommonProps = {
    label?: string | null;
    id?: string;
    className?: string;
    placeholder?: string;
    value?: InputValue;
};
type NumberProps = CommonProps & {
    type: 'number';
    min?: number;
    max?: number;
    step?: number;
    precision?: number;
    onChange?: (value: number) => void;
};
type SelectProps = CommonProps & {
    type: 'select';
    options?: Option[];
    onChange?: (value: string) => void;
};
type TextProps = CommonProps & {
    type?: 'text';
    pattern?: string;
    onChange?: (value: string) => void;
};

export default function Input(props: NumberProps | SelectProps | TextProps) {
    const generatedId = useId().replace(/:/g, '');
    const inputId = props.id || `${props.label?.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'field'}-${generatedId}`;
    const className = props.className || '';

    let control;
    if (props.type === 'select') {
        control = (
            <select id={inputId} className={className} value={props.value ?? ''} onChange={(event) => props.onChange?.(event.target.value)}>
                <option value='' disabled hidden>{props.placeholder || 'Select an option'}</option>
                {(props.options || []).map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
            </select>
        );
    } else if (props.type === 'number') {
        const updateNumber = (value: number) => {
            if (!Number.isFinite(value)) return;
            const clamped = Math.max(props.min ?? -Infinity, Math.min(props.max ?? Infinity, value));
            const decimals = props.precision ?? (String(props.step ?? 1).split('.')[1] || '').length;
            props.onChange?.(Number(clamped.toFixed(decimals)));
        };
        control = (
            <input
                id={inputId}
                className={className}
                type='number'
                inputMode='decimal'
                value={props.value ?? ''}
                min={props.min}
                max={props.max}
                step={props.step}
                placeholder={props.placeholder}
                onChange={(event) => updateNumber(event.target.valueAsNumber)}
            />
        );
    } else {
        control = (
            <input
                id={inputId}
                className={className}
                type='text'
                value={props.value ?? ''}
                pattern={props.pattern}
                placeholder={props.placeholder}
                onChange={(event) => props.onChange?.(event.target.value)}
            />
        );
    }

    return <div className='input-group'>{props.label && <label htmlFor={inputId}>{props.label}</label>}{control}</div>;
}
