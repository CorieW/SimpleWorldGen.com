import { useEffect, useRef } from 'react';
import './Node.scss';
import { INode } from '../../../../ts/interfaces/INode';
import useStore from '../../editorStore';
import { Button } from '@chakra-ui/react';
import { Drawer } from '../../../../ts/utils/Drawer';
import { NodeValueCalculator } from '../../../../ts/utils/LayerValueCalculator';

export default function Node(props: INode) {
    const { id } = props;
    const { layers, openForm, canMoveNode, moveNode, removeNode, getNode, getLayerWithNode } = useStore();

    const node = getNode(id);

    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        // Update the canvas when the node changes
        if (!node) return;

        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const nodeDrawer = new Drawer(canvas, (x, y) => {
            // Get a copy of the layer of the node
            const layer = getLayerWithNode(id);
            if (!layer) return 0;
            const layerCopy = JSON.parse(JSON.stringify(layer));

            // Remove the next node from the current node
            let currentNode = layerCopy.beginningNode;
            while (currentNode) {
                if (currentNode.id === id) {
                    currentNode.nextNode = null;
                    break;
                }
                currentNode = currentNode.nextNode;
            }

            // Calculate the value of the node
            // Includes all the nodes prior to this one
            // Ignore the next node(s)
            const nodeValueCalculator = new NodeValueCalculator(layerCopy.beginningNode);
            return nodeValueCalculator.calculateValue(x, y);
        });
        nodeDrawer.drawNode();
    }, [node]);


    return (
        <div className='node-container'>
            <canvas width={100} height={100}
            ref={canvasRef} className='node-canvas'></canvas>
            <button className='edit-btn' onClick={() => openForm(props.id)}>
                <i className='fa-solid fa-pen edit-node-icon'></i>
            </button>
            <div className='bottom-bar'>
                <Button
                    className='move-btn'
                    isDisabled={!canMoveNode(id, 'up')}
                    onClick={() => moveNode(id, 'up')}
                >
                    <i className='fa-solid fa-arrow-up'></i>
                </Button>
                <Button
                    className='delete-btn'
                    onClick={() => {
                        removeNode(id);
                        console.log(id);
                    }}
                >
                    <i className='fa-solid fa-trash'></i>
                </Button>
                <Button
                    className='move-btn'
                    isDisabled={!canMoveNode(id, 'down')}
                    onClick={() => moveNode(id, 'down')}
                >
                    <i className='fa-solid fa-arrow-down'></i>
                </Button>
            </div>
        </div>
    );
}
