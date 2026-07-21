import { useState, type CSSProperties } from 'react'
import { SketchPicker, type ColorResult } from 'react-color'
import './ColorPicker.scss'
import { Button } from '@chakra-ui/react';

type Props = {
    color: string;
    setColor: (color: string) => void;
}

export default function ColorPicker(props: Props) {
    const { color, setColor } = props

    const [displayColorPicker, setDisplayColorPicker] = useState(false)

    return (
        <div className="color-picker-container">
            <Button
                className='color-swatch-btn'
                aria-label={`Choose color, currently ${color}`}
                aria-expanded={displayColorPicker}
                title='Choose color'
                onClick={() => setDisplayColorPicker(!displayColorPicker)}
                style={{'--swatch-color': color} as CSSProperties}
            />
            {displayColorPicker && (
                <div className="color-picker">
                    <SketchPicker color={color} onChange={(nextColor: ColorResult) => setColor(nextColor.hex)} />
                </div>
            )}
        </div>
    )
}
