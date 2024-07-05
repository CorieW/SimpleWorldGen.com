import { useEffect, useState } from 'react';
import './ConfirmableInput.scss';
import { Button } from '@chakra-ui/react';

type Props = {
    value: string;
    changeValue: (value: string) => void;
};

export default function ConfirmableInput(props: Props) {
    const { value, changeValue } = props;

    const [unconfirmedValue, setUnconfirmedValue] = useState<string>(value);

    useEffect(() => {
        setUnconfirmedValue(value);
    }, [value]);

    function shouldBlur(e: React.FocusEvent<HTMLInputElement>) {
        if (
            e.relatedTarget === null ||
            !e.relatedTarget.classList.contains('confirmable-input-change-btn')
        ) {
            setUnconfirmedValue(value);
        } else {
            updateInput();
        }
    }

    function updateInput() {
        console.log('updateInput');
        changeValue(unconfirmedValue);
    }

    return (
        <div className='confirmable-input-container'>
            <input
                className='confirmable-input-input'
                value={unconfirmedValue}
                onClick={() => setUnconfirmedValue(value)}
                onChange={(e) => setUnconfirmedValue(e.target.value)}
                onBlur={shouldBlur}
            />
            <Button
                className='confirmable-input-change-btn'
                onClick={updateInput}
            >
                <i className='fa-solid fa-check'></i>
            </Button>
        </div>
    );
}
