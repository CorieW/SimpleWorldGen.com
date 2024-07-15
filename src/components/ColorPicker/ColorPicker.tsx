import { useState } from 'react'
import { SketchPicker } from 'react-color'
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
            <Button onClick={() => setDisplayColorPicker(!displayColorPicker)} style={{backgroundColor: color}}></Button>
            {displayColorPicker && (
                <div className="color-picker">
                    <SketchPicker color={color} onChange={(color: any) => setColor(color.hex)} />
                </div>
            )}
        </div>
    )
}