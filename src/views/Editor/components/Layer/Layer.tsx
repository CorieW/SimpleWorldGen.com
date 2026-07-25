import { useState, useEffect, useRef } from 'react';
import './Layer.scss';
import { ILayer } from '../../../../ts/interfaces/ILayer';
import editorStore from '../../editorStore';
import appStore from '../../../../appStore';
import { Drawer } from '../../../../ts/utils/Drawer';
import { NodeValueCalculator } from '../../../../ts/utils/LayerValueCalculator';
import IconButton from '../../../../components/IconButton/IconButton';

export default function Layer(props: ILayer) {
    const { id, name, beginningNode } = props;

    const { addNotification } = appStore();

    const {
        layers,
        modifyLayer,
        removeLayer,
        getLayer,
        canMoveLayer,
        moveLayer,
        setActiveFormLayerId,
    } = editorStore();

    const [loaded, setLoaded] = useState(false);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const node = beginningNode;

    useEffect(() => {
        // Update the canvas when the node changes
        if (!node) return;

        const canvas = canvasRef.current;
        if (!canvas) return;

        const width = canvas.width;
        const height = canvas.height;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const layer = getLayer(id);
        if (!layer) return;

        setLoaded(false);

        const nodeValueCalculator = new NodeValueCalculator(layer.beginningNode);
        let cancelled = false;

        nodeValueCalculator.calculateMap(width, height).then((map) => {
            if (cancelled) return;

            const array: number[] = [];
            map.forEach((row) => {
                row.forEach((value) => {
                    array.push(value * 255);
                    array.push(value * 255);
                    array.push(value * 255);
                    array.push(255);
                });
            });

            const nodeDrawer = new Drawer(canvas, array);
            nodeDrawer.drawNode();

            setLoaded(true);
        }).catch((error: unknown) => {
            if (!cancelled) {
                console.error('Unable to render the layer preview.', error);
                setLoaded(true);
            }
        });

        return () => {
            cancelled = true;
            nodeValueCalculator.terminateWorker();
        };
    }, [getLayer, id, node]);

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
        <li className='layer-container'>
            <div className='inner-layer-container preview-surface preview-surface--interactive'>
                <canvas width={100} height={100}
                ref={canvasRef} className='node-canvas'></canvas>
                <div className={`loading-container-a ${loaded ? 'hidden' : ''}`}>
                    <i className='fa-solid fa-spinner fa-spin'></i>
                </div>
                <button
                    className='edit-btn preview-edit'
                    aria-label={`Edit ${name}`}
                    title={`Edit ${name}`}
                    onClick={() => setActiveFormLayerId(id)}
                >
                    <i className='fa-solid fa-pen edit-node-icon' aria-hidden='true'></i>
                    <span>Edit nodes</span>
                </button>
            </div>
            <input
                key={name}
                className='layer-name-input'
                aria-label='Layer name'
                defaultValue={name}
                onBlur={(event) => changeLayerName(event.currentTarget.value)}
                onKeyDown={(event) => {
                    if (event.key === 'Enter') event.currentTarget.blur();
                    if (event.key === 'Escape') {
                        event.currentTarget.value = name;
                        event.currentTarget.blur();
                    }
                }}
            />
            <div className='btns-container'>
                <IconButton
                    icon='fa-arrow-left'
                    label={`Move ${name} left`}
                    className='move-btn'
                    disabled={!canMoveLayer(id, 'left')}
                    onClick={() => moveLayer(id, 'left')}
                />
                <IconButton
                    icon='fa-trash'
                    label={`Delete ${name}`}
                    className='delete-btn'
                    onClick={removeThisLayer}
                />
                <IconButton
                    icon='fa-arrow-right'
                    label={`Move ${name} right`}
                    className='move-btn'
                    disabled={!canMoveLayer(id, 'right')}
                    onClick={() => moveLayer(id, 'right')}
                />
            </div>
        </li>
    );
}
