import { useId, type ReactNode } from 'react';
import './Input.scss';

type InputSize = 'xs' | 'sm' | 'md' | 'lg';
type InputValue = string | number;
type InputOption = { value: InputValue; label: string };

type BaseProps = {
    label?: string | null;
    id?: string;
    className?: string;
    placeholder?: string;
    size?: InputSize;
};

type NumberInputProps = BaseProps & {
    type: 'number';
    value?: InputValue;
    min?: number;
    max?: number;
    step?: number;
    precision?: number;
    onChange?: (value: number) => void;
};

type SelectInputProps = BaseProps & {
    type: 'select';
    value?: InputValue;
    options?: InputOption[];
    onChange?: (value: string) => void;
};

type TextInputProps = BaseProps & {
    type?: 'text';
    value?: InputValue;
    pattern?: string;
    onChange?: (value: string) => void;
};

type Props = NumberInputProps | SelectInputProps | TextInputProps;

export default function Input(props: Props) {
    const generatedId = useId().replace(/:/g, '');
    const labelSlug = props.label?.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'field';
    const inputId = props.id || `${labelSlug}-${generatedId}`;

    let control: ReactNode;
    if (props.type === 'number') {
        control = <NumberControl {...props} inputId={inputId} />;
    } else if (props.type === 'select') {
        control = <SelectControl {...props} inputId={inputId} />;
    } else {
        control = <TextControl {...props} inputId={inputId} />;
    }

    return (
        <div className='input-group'>
            {props.label && <label htmlFor={inputId}>{props.label}</label>}
            {control}
        </div>
    );
}

type ControlProps<T> = T & { inputId: string };

function NumberControl(props: ControlProps<NumberInputProps>) {
    const {
        inputId,
        value,
        className = '',
        placeholder,
        size = 'md',
        min,
        max,
        step = 1,
        precision,
        onChange,
    } = props;

    function normalizeValue(number: number) {
        const clamped = Math.max(min ?? -Infinity, Math.min(max ?? Infinity, number));
        const stepDecimals = (String(step).split('.')[1] || '').length;
        return Number(clamped.toFixed(precision ?? stepDecimals));
    }

    function updateFromString(rawValue: string) {
        if (rawValue === '') {
            onChange?.(0);
            return;
        }

        const number = Number(rawValue);
        if (!Number.isNaN(number)) onChange?.(normalizeValue(number));
    }

    function nudge(direction: 1 | -1) {
        const currentValue = Number(value);
        const safeValue = Number.isFinite(currentValue) ? currentValue : 0;
        onChange?.(normalizeValue(safeValue + step * direction));
    }

    return (
        <div className={`number-input ${className}`} data-size={size}>
            <input
                id={inputId}
                type='number'
                inputMode='decimal'
                value={value ?? ''}
                min={min}
                max={max}
                step={step}
                placeholder={placeholder}
                onChange={(event) => updateFromString(event.target.value)}
            />
            <div className='number-input-controls' aria-label='Adjust value'>
                <button type='button' aria-label='Increase value' onClick={() => nudge(1)}>
                    <i className='fa-solid fa-chevron-up' aria-hidden='true'></i>
                </button>
                <button type='button' aria-label='Decrease value' onClick={() => nudge(-1)}>
                    <i className='fa-solid fa-chevron-down' aria-hidden='true'></i>
                </button>
            </div>
        </div>
    );
}

function SelectControl(props: ControlProps<SelectInputProps>) {
    const {
        inputId,
        value,
        className = '',
        placeholder,
        size = 'md',
        options = [],
        onChange,
    } = props;

    return (
        <div className={`select-input ${className}`} data-size={size}>
            <select
                id={inputId}
                value={value ?? ''}
                onChange={(event) => onChange?.(event.target.value)}
            >
                <option value='' disabled hidden>
                    {placeholder || 'Select an option'}
                </option>
                {options.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
            <i className='fa-solid fa-chevron-down' aria-hidden='true'></i>
        </div>
    );
}

function TextControl(props: ControlProps<TextInputProps>) {
    const {
        inputId,
        value,
        className = '',
        placeholder,
        size = 'md',
        pattern,
        onChange,
    } = props;

    return (
        <input
            id={inputId}
            className={`text-input ${className}`}
            type='text'
            placeholder={placeholder}
            value={value ?? ''}
            pattern={pattern}
            data-size={size}
            onChange={(event) => onChange?.(event.target.value)}
        />
    );
}
