import './Input.scss'
import {
    Select,
    NumberInput,
    NumberInputField,
    NumberInputStepper,
    NumberIncrementStepper,
    NumberDecrementStepper,
    Input as NormalInput,
} from '@chakra-ui/react';

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
    options?: { value: string; label: string }[]
    size?: string
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
    const inputSettings = { value, className, placeholder, type, min, max, step, precision, pattern, onChange, size }
    const inputId = id || (label && `${label?.toLowerCase()}-input`) || ''

    function handleNumberChange(value: string) {
        let newValue = parseFloat(value)
        if (value === '') newValue = 0
        if (isNaN(newValue)) return

        if (value[value.length - 1] === '.') {
            newValue += step || 0
        }
        onChange(newValue)
    }

    const numberInputJSX = () => {
        return (
            <NumberInput id={inputId} {...inputSettings} onChange={(valueString) => handleNumberChange(valueString)}>
                <NumberInputField />
                <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                </NumberInputStepper>
            </NumberInput>
        )
    }

    const selectJSX = () => {
        return (
            <Select
                className={className}
                value={value}
                onChange={(e) => onChange(e.target.value)}
            >
                <option value='' disabled hidden>
                    Select an option
                </option>
                {options.map((type) => (
                    <option key={type.value} value={type.value}>
                        {type.label}
                    </option>
                ))}
            </Select>
        )
    }

    const inputJSX = () => {
        switch (type) {
            case 'number':
                return numberInputJSX()
            case 'select':
                return selectJSX()
            default:
                return <NormalInput id={inputId} {...inputSettings} />
        }
    }

    return (
        <div className='input-group'>
            <label htmlFor={inputId}>{label}</label>
            {inputJSX()}
        </div>
    )
}