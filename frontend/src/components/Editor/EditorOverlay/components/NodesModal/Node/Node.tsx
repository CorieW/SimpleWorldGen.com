import { useEffect, useRef } from 'react';
import './Node.scss';
import { INode } from '../../../../../../ts/interfaces/generation/INode';
import useStore from '../../../../editorStore';
import { Drawer } from '../../../../ts/utils/Drawer';
import { NodeValueCalculator } from '../../../../ts/utils/LayerValueCalculator';

export default function Node(props: INode) {
    const { id } = props;
    const {
        getNode,
        getLayerWithNode,
        setActiveFormNodeId
    } = useStore();

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

            const nodeValueCalculator = new NodeValueCalculator(layerCopy.beginningNode);
            return nodeValueCalculator.calculateValue(x, y);
        });
        nodeDrawer.drawNode();
    }, [node]);

    return (
        <div className='node-container'>
            <canvas ref={canvasRef} className='node-canvas'></canvas>
            <button className='edit-btn' onClick={() => setActiveFormNodeId(id)}></button>
        </div>
    );
}
