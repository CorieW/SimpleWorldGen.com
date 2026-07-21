import './Input.scss'
import {
    NativeSelect,
    NumberInput,
    Input as NormalInput,
} from '@chakra-ui/react';

type InputSize = 'xs' | 'sm' | 'md' | 'lg'

type Props = {
    type?: string
    label?: string | null
    id?: string
    className?: string
    placeholder?: string
    value?: any
    min?: number
    max?: number
    step?: number
    pattern?: string
    precision?: number
    onChange?: any
    options?: { value: string; label: string; isDisabled?: boolean }[]
    size?: InputSize
}

export default function Input(props: Props) {
    const {
        value,
        label,
        id,
        className,
        placeholder,
        type = 'text',
        min,
        max,
        step,
        pattern,
        precision,
        onChange,
        options = [],
        size,
    } = props
    const inputId = id || (label && `${label?.toLowerCase()}-input`) || ''

    function handleNumberChange(value: string) {
        let newValue = parseFloat(value)
        if (value === '') newValue = 0
        if (isNaN(newValue)) return

        if (value[value.length - 1] === '.') {
            newValue += step || 0
        }
        onChange?.(newValue)
    }

    const numberInputJSX = () => {
        return (
            <NumberInput.Root
                className={className}
                value={String(value ?? '')}
                min={min}
                max={max}
                step={step}
                size={size}
                formatOptions={precision === undefined ? undefined : { maximumFractionDigits: precision }}
                onValueChange={({ value: valueString }) => handleNumberChange(valueString)}
            >
                <NumberInput.Input id={inputId} placeholder={placeholder} pattern={pattern} />
                <NumberInput.Control>
                    <NumberInput.IncrementTrigger />
                    <NumberInput.DecrementTrigger />
                </NumberInput.Control>
            </NumberInput.Root>
        )
    }

    const selectJSX = () => {
        return (
            <NativeSelect.Root size={size}>
                <NativeSelect.Field
                    id={inputId}
                    className={className}
                    value={value}
                    onChange={(event) => onChange?.(event.target.value)}
                >
                    <option value='' disabled hidden>
                        {placeholder ?? 'Select an option'}
                    </option>
                    {options.map((option) => (
                        <option key={option.value} value={option.value} disabled={option.isDisabled}>
                            {option.label}
                        </option>
                    ))}
                </NativeSelect.Field>
                <NativeSelect.Indicator />
            </NativeSelect.Root>
        )
    }

    const inputJSX = () => {
        switch (type) {
            case 'number':
                return numberInputJSX()
            case 'select':
                return selectJSX()
            default:
                return (
                    <NormalInput
                        id={inputId}
                        className={className}
                        placeholder={placeholder}
                        value={value}
                        pattern={pattern}
                        size={size}
                        onChange={onChange}
                    />
                )
        }
    }

    return (
        <div className='input-group' id={id}>
            { label != null ? <label htmlFor={inputId}>{label}</label> : null }
            {inputJSX()}
        </div>
    )
}
