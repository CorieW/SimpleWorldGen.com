import { useEffect, useRef, useState } from 'react';
import ToolPanel from '../../../../components/ToolPanel/ToolPanel';
import IconButton from '../../../../components/IconButton/IconButton';
import Input from '../../../../components/Input/Input';
import { NodeTypeEnum } from '../../../../ts/enums/NodeTypeEnum';
import { NodeEffectEnum } from '../../../../ts/enums/NodeEffectEnum';
import { NoiseTypeEnum } from '../../../../ts/enums/NoiseTypeEnum';
import { INode } from '../../../../ts/interfaces/INode';
import { INoiseNode } from '../../../../ts/interfaces/INoiseNode';
import { ISimplexNoiseNode } from '../../../../ts/interfaces/ISimplexNoiseNode';
import { Drawer } from '../../../../ts/utils/Drawer';
import { NodeValueCalculator } from '../../../../ts/utils/LayerValueCalculator';
import enumOptions from '../../../../ts/utils/enumOptions';
import useStore from '../../editorStore';
import './NodeEditorModal.scss';

export default function NodeEditorModal() {
    const {
        activeFormNodeId,
        setActiveFormNodeId,
        getNode,
        isNodeFirstInLayer,
        modifyNode,
        removeNode,
        canMoveNode,
        moveNode,
    } = useStore();
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [node, setNode] = useState<INode | null>(null);
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        if (activeFormNodeId === -1) return;
        const sourceNode = getNode(activeFormNodeId);
        setNode(sourceNode ? structuredClone(sourceNode) : null);
    }, [activeFormNodeId, getNode]);

    useEffect(() => {
        if (!node) return;

        const canvas = canvasRef.current;
        if (!canvas) return;

        const width = canvas.width;
        const height = canvas.height;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        setLoaded(false);

        const nodeValueCalculator = new NodeValueCalculator({ ...node, nextNode: null });
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
                console.error('Unable to render the node editor preview.', error);
                setLoaded(true);
            }
        });

        return () => {
            cancelled = true;
            nodeValueCalculator.terminateWorker();
        };
    }, [node]);

    function closePanel() {
        setActiveFormNodeId(-1);
    }

    function applyChanges() {
        if (!node) return;
        modifyNode(activeFormNodeId, node);
        closePanel();
    }

    function deleteNode() {
        removeNode(activeFormNodeId);
        closePanel();
    }

    const footer = (
        <div className='panel-actions node-editor-actions'>
            <div>
                <IconButton icon='fa-trash' label='Delete node' className='danger-btn' onClick={deleteNode} />
                <IconButton
                    icon='fa-arrow-up'
                    label='Move node up'
                    disabled={!canMoveNode(activeFormNodeId, 'up')}
                    onClick={() => moveNode(activeFormNodeId, 'up')}
                />
                <IconButton
                    icon='fa-arrow-down'
                    label='Move node down'
                    disabled={!canMoveNode(activeFormNodeId, 'down')}
                    onClick={() => moveNode(activeFormNodeId, 'down')}
                />
            </div>
            <button type='button' className='ui-button primary-btn' onClick={applyChanges}>Apply</button>
        </div>
    );

    return (
        <ToolPanel
            open={activeFormNodeId !== -1}
            onClose={closePanel}
            title={`Node ${activeFormNodeId}`}
            eyebrow='Node configuration'
            footer={footer}
        >
            <div className='node-preview preview-surface'>
                <div className={`loading-container-a ${loaded ? 'hidden' : ''}`}>
                    <i className='fa-solid fa-spinner fa-spin'></i>
                </div>
                <canvas ref={canvasRef}></canvas>
                <span>Preview</span>
            </div>
            {node && (
                <div className='form-stack'>
                    {!isNodeFirstInLayer(activeFormNodeId) && (
                        <Input
                            label='Node effect'
                            type='select'
                            value={node.effect || ''}
                            options={enumOptions(NodeEffectEnum)}
                            onChange={(effect) => setNode({ ...node, effect: effect as NodeEffectEnum })}
                        />
                    )}
                    <Input
                        label='Node type'
                        type='select'
                        value={node.type}
                        options={enumOptions(NodeTypeEnum)}
                        onChange={(type) => setNode({ ...node, type: type as NodeTypeEnum })}
                    />
                    <hr className='form-separator' />
                    {node.type === NodeTypeEnum.Noise && <NoiseFields node={node as INoiseNode} onChange={setNode} />}
                </div>
            )}
        </ToolPanel>
    );
}

const SIMPLEX_FIELDS = [
    { key: 'octaves', label: 'Octaves', step: 1, min: 1, max: 8, precision: 0 },
    { key: 'persistence', label: 'Persistence', step: 0.1 },
    { key: 'lacunarity', label: 'Lacunarity', step: 0.1 },
    { key: 'frequency', label: 'Frequency', step: 0.1 },
    { key: 'offsetX', label: 'Offset X', step: 1 },
    { key: 'offsetY', label: 'Offset Y', step: 1 },
] as const;

function NoiseFields({ node, onChange }: { node: INoiseNode; onChange: (node: INode) => void }) {
    const update = (changes: Partial<INoiseNode>) => onChange({ ...node, ...changes });

    return (
        <div className='form-stack'>
            <Input type='number' label='Seed' value={node.seed} step={1000} precision={0} onChange={(seed) => update({ seed })} />
            <Input
                label='Noise type'
                type='select'
                value={node.noiseType || ''}
                options={enumOptions(NoiseTypeEnum)}
                onChange={(noiseType) => update({ noiseType: noiseType as NoiseTypeEnum })}
            />
            <Input type='number' label='Multiplier' value={node.multiplier} step={0.1} onChange={(multiplier) => update({ multiplier })} />
            {node.noiseType === NoiseTypeEnum.Simplex && (
                <SimplexFields node={node as ISimplexNoiseNode} onChange={onChange} />
            )}
        </div>
    );
}

function SimplexFields({ node, onChange }: { node: ISimplexNoiseNode; onChange: (node: INode) => void }) {
    return SIMPLEX_FIELDS.map((field) => (
        <Input
            key={field.key}
            type='number'
            label={field.label}
            value={node[field.key]}
            step={field.step}
            min={'min' in field ? field.min : undefined}
            max={'max' in field ? field.max : undefined}
            precision={'precision' in field ? field.precision : undefined}
            onChange={(value) => onChange({ ...node, [field.key]: value })}
        />
    ));
}
