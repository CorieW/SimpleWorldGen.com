import { useState, useEffect, useRef } from 'react';
import './Node.scss';
import { INode } from '../../../../../ts/interfaces/INode';
import useStore from '../../../editorStore';
import { Drawer } from '../../../../../ts/utils/Drawer';
import { NodeValueCalculator } from '../../../../../ts/utils/LayerValueCalculator';

export default function Node(props: INode) {
    const { id } = props;
    const {
        getNode,
        getLayerWithNode,
        setActiveFormNodeId
    } = useStore();

    const node = getNode(id);

    const [loaded, setLoaded] = useState(false);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        // Update the canvas when the node changes
        if (!node) return;

        const canvas = canvasRef.current;
        if (!canvas) return;

        const width = canvas.width;
        const height = canvas.height

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Get a copy of the layer of the node
        const layer = getLayerWithNode(id);
        if (!layer) return;
        const layerCopy = JSON.parse(JSON.stringify(layer));

        setLoaded(false);

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
        nodeValueCalculator.calculateMap(width, height).then((map) => {
            let array: number[] = [];
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
        });
    }, [node]);

    return (
        <div className='node-container'>
            <canvas ref={canvasRef} className='node-canvas'></canvas>
            <div className={`loading-container-a ${loaded ? 'hidden' : ''}`}>
                <i className="fa-solid fa-spinner fa-spin"></i>
            </div>
            <button className='edit-btn' onClick={() => setActiveFormNodeId(id)}></button>
        </div>
    );
}
