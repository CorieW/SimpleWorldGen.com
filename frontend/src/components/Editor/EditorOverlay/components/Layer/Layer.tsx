import { useEffect, useRef } from 'react';
import './Layer.scss';
import { ILayer } from '../../../../../ts/interfaces/generation/ILayer';
import editorStore from '../../../editorStore';
import appStore from '../../../../../ts/appStore';
import { Button } from '@chakra-ui/react';
import { Drawer } from '../../../ts/utils/Drawer';
import { NodeValueCalculator } from '../../../ts/utils/LayerValueCalculator';
import ConfirmableInput from '../../../../Basic/ConfirmableInput/ConfirmableInput';

export default function Layer(props: ILayer) {
    const { id, name, beginningNode } = props;

    const { addNotification } = appStore();

    const {
        layers,
        modifyLayer,
        removeLayer,
        getNode,
        getLayerWithNode,
        canMoveLayer,
        moveLayer,
        setActiveFormLayerId,
    } = editorStore();

    const canvasRef = useRef<HTMLCanvasElement>(null);

    const node = getNode(beginningNode.id);

    useEffect(() => {
        // Update the canvas when the node changes
        if (!node) return;

        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const nodeDrawer = new Drawer(canvas, (x, y) => {
            const layer = getLayerWithNode(id);
            if (!layer) return 0;

            const nodeValueCalculator = new NodeValueCalculator(layer.beginningNode);
            return nodeValueCalculator.calculateValue(x, y);
        });
        nodeDrawer.drawNode();
    }, [node]);

    function removeThisLayer() {
        removeLayer(id);
    }

    function changeLayerName(value: string) {
        // Check if name is unique (don't include the current layer in the check)
        const layerIsUnique = layers
            .filter((layer: ILayer) => layer.id !== id)
            .every((layer: ILayer) => layer.name !== value);

        let layerCount = 0;
        if (!layerIsUnique) {
            // Get the highest bracketed number in the name
            layerCount =
                layers.reduce((acc: number, layer: ILayer) => {
                    const match = layer.name.match(/\((\d+)\)/);
                    if (match) {
                        const num = parseInt(match[1]);
                        return num > acc ? num : acc;
                    } else {
                        return acc;
                    }
                }, 0) + 1;

            addNotification({
                type: 'info',
                text: `Layer name "${value}" is not unique. Renamed to "${value} (${layerCount})"`,
            });
        }

        // If there is more than one layer with the same name, add a number to the end of the name
        const newName = layerCount >= 1 ? `${value} (${layerCount})` : value;
        modifyLayer(id, { ...props, name: newName });
    }

    return (
        <div className='layer-container'>
            <ConfirmableInput
                value={name}
                changeValue={(value: string) => changeLayerName(value)}
            />
            <div className='inner-layer-container'>
                <canvas width={100} height={100}
                ref={canvasRef} className='node-canvas'></canvas>
                <button className='edit-btn' onClick={() => setActiveFormLayerId(id)}>
                    <i className='fa-solid fa-pen edit-node-icon'></i>
                </button>
            </div>
            <div className='btns-container'>
                <Button
                    className='move-btn'
                    colorScheme='transparent'
                    size='sm'
                    isDisabled={!canMoveLayer(id, 'left')}
                    onClick={() => moveLayer(id, 'left')}
                >
                    <i className='fa-solid fa-arrow-left'></i>
                </Button>
                <Button
                    className='delete-btn'
                    colorScheme='transparent'
                    size='sm'
                    onClick={removeThisLayer}
                >
                    <i className='fa-solid fa-trash'></i>
                </Button>
                <Button
                    className='move-btn'
                    colorScheme='transparent'
                    size='sm'
                    isDisabled={!canMoveLayer(id, 'right')}
                    onClick={() => moveLayer(id, 'right')}
                >
                    <i className='fa-solid fa-arrow-right'></i>
                </Button>
            </div>
        </div>
    );
}
