import { useState, useEffect, useRef } from 'react';
import './NodeEditorModal.scss';
import useStore from '../../editorStore';
import {
    Button,
    Separator,
    Stack,
    HStack
} from '@chakra-ui/react';
import Input from '../../../../components/Input/Input';
import { INode } from '../../../../ts/interfaces/INode';
import { NodeTypeEnum } from '../../../../ts/enums/NodeTypeEnum';
import { NodeEffectEnum } from '../../../../ts/enums/NodeEffectEnum';
import { NoiseTypeEnum } from '../../../../ts/enums/NoiseTypeEnum';
import { INoiseNode } from '../../../../ts/interfaces/INoiseNode';
import { ISimplexNoiseNode } from '../../../../ts/interfaces/ISimplexNoiseNode';
import Modal from '../../../../components/Modal/Modal';
import { Drawer } from '../../../../ts/utils/Drawer';
import { NodeValueCalculator } from '../../../../ts/utils/LayerValueCalculator';

export default function NodeEditorModal() {
    const {
        activeFormNodeId,
        setActiveFormNodeId,
        removeNode,
        getNode,
        isNodeFirstInLayer,
        modifyNode,
        canMoveNode,
        moveNode,
    } = useStore();

    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [currentNode, setCurrentNode] = useState<INode | null>(null);

    const nodeFirstInLayer = isNodeFirstInLayer(activeFormNodeId);

    useEffect(() => {
        if (activeFormNodeId === -1) return;

        // Copy the node to prevent modifying the original node
        const nodeCopy = JSON.parse(JSON.stringify(getNode(activeFormNodeId))) as INode;
        setCurrentNode(nodeCopy);

        // Clear the canvas when the node changes
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }, [activeFormNodeId, getNode]);

    useEffect(() => {
        // Update the canvas when the node changes
        if (!currentNode) return;

        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const nodeDrawer = new Drawer(canvas, (x, y) => {
            // Calculate the value of only this node
            const nodeValueCalculator = new NodeValueCalculator({ ...currentNode, nextNode: null });
            return nodeValueCalculator.calculateValue(x, y);
        });
        nodeDrawer.drawNode();
    }, [currentNode]);

    function removeThisNode() {
        removeNode(activeFormNodeId);
        closeForm();
    }

    function closeEditorForm() {
        closeForm();
    }

    function applyChanges() {
        if (!currentNode) return;

        modifyNode(activeFormNodeId, currentNode);
        closeForm();
    }

    function closeForm() {
        setActiveFormNodeId(-1);
    }

    const nodeEffectSelectJSX = () => (
        <Input
            label='Node Effect'
            type='select'
            placeholder='Select the node effect'
            size='md'
            value={currentNode && currentNode.effect || ''}
            onChange={(value) =>
                setCurrentNode({ ...currentNode, effect: value as NodeEffectEnum } as INode)
            }
            options={Object.values(NodeEffectEnum).map((effectType) => ({
                value: effectType,
                label: effectType,
            }))}
        />
    );

    const nodeTypeSelectJSX = () => (
        <Input
            label='Node Type'
            type='select'
            size='md'
            value={currentNode && currentNode.type || ''}
            onChange={(value) =>
                setCurrentNode({ ...currentNode, type: value as NodeTypeEnum } as INode)
            }
            options={Object.values(NodeTypeEnum).map((nodeType) => ({
                value: nodeType,
                label: nodeType,
            }))}
        />
    );

    const renderContent = () => (
        <div id='node-editor-modal-content-container'>
            <div className='node-editor-heading'>
                <span>Node configuration</span>
                <h1>Edit node</h1>
            </div>
            <div className='display-container'>
                <div className='inner-container'>
                    <canvas id='editor-form-canvas' ref={canvasRef}></canvas>
                </div>
            </div>
            <div className='form-container'>
                <Stack gap={3}>
                    {!nodeFirstInLayer && nodeEffectSelectJSX()}
                    {nodeTypeSelectJSX()}
                    <Separator />
                    {currentNode && currentNode.type === NodeTypeEnum.Noise &&
                        NoiseNodeEditorSection(
                            { node: currentNode as INoiseNode, setNode: setCurrentNode }
                        )
                    }
                </Stack>
            </div>
        </div>
    );

    const renderFooter = () => (
        <div id='node-editor-modal-bottom-bar'>
            <div>
                <Button
                    className='danger-btn icon-btn'
                    aria-label='Delete node'
                    title='Delete node'
                    colorPalette='red'
                    size='md'
                    onClick={removeThisNode}
                >
                    <i className='fa-solid fa-trash'></i>
                </Button>
                <Button
                    className='move-btn icon-btn'
                    aria-label='Move node up'
                    title='Move node up'
                    colorPalette='blue'
                    size='md'
                    disabled={!canMoveNode(activeFormNodeId, 'up')}
                    onClick={() => moveNode(activeFormNodeId, 'up')}
                >
                    <i className='fa-solid fa-arrow-up'></i>
                </Button>
                <Button
                    className='move-btn icon-btn'
                    aria-label='Move node down'
                    title='Move node down'
                    colorPalette='blue'
                    size='md'
                    disabled={!canMoveNode(activeFormNodeId, 'down')}
                    onClick={() => moveNode(activeFormNodeId, 'down')}
                >
                    <i className='fa-solid fa-arrow-down'></i>
                </Button>
            </div>
            <div>
                <Button
                    className='modal-btn'
                    colorPalette='gray'
                    size='md'
                    onClick={closeEditorForm}
                >
                    Cancel
                </Button>
                <Button
                    className='primary-btn'
                    colorPalette='green'
                    size='md'
                    onClick={applyChanges}
                >
                    Apply
                </Button>
            </div>
        </div>
    );

    return (
        <div
            id='node-editor-modal-container'
        >
            <Modal open={activeFormNodeId !== -1} onClose={closeForm} footer={renderFooter()}>
                {renderContent()}
            </Modal>
        </div>
    );
}

function NoiseNodeEditorSection(props: {
    node: INoiseNode;
    setNode: (node: INoiseNode | ISimplexNoiseNode) => void;
}) {
    const { node, setNode } = props;
    const { noiseType } = node as INoiseNode;

    const simplexNoiseJSX = () => {
        const simplexNoiseNode = node as ISimplexNoiseNode;
        const {
            octaves,
            persistence,
            lacunarity,
            frequency,
            offsetX,
            offsetY,
        } = simplexNoiseNode;

        return (
            <>
                <Stack gap={3}>
                    <Input
                        type='number'
                        label='Octaves'
                        value={octaves}
                        precision={0}
                        step={1}
                        min={1}
                        max={8}
                        onChange={(value) =>
                            setNode({
                                ...simplexNoiseNode,
                                octaves: value,
                            })
                        }
                    />
                    <Input
                        type='number'
                        label='Persistence'
                        value={persistence}
                        step={0.1}
                        onChange={(value) =>
                            setNode({
                                ...simplexNoiseNode,
                                persistence: value,
                            })
                        }
                    />
                    <Input
                        type='number'
                        label='Lacunarity'
                        value={lacunarity}
                        step={0.1}
                        onChange={(value) =>
                            setNode({
                                ...simplexNoiseNode,
                                lacunarity: value,
                            })
                        }
                    />
                    <Input
                        type='number'
                        label='Frequency'
                        value={frequency}
                        step={0.1}
                        onChange={(value) =>
                            setNode({
                                ...simplexNoiseNode,
                                frequency: value,
                            })
                        }
                    />
                    <HStack gap={3}>
                        <Input
                            type='number'
                            label='Offset X'
                            value={offsetX}
                            step={1}
                            onChange={(value) =>
                                setNode({
                                    ...simplexNoiseNode,
                                    offsetX: value,
                                })
                            }
                        />
                        <Input
                            type='number'
                            label='Offset Y'
                            value={offsetY}
                            step={1}
                            onChange={(value) =>
                                setNode({
                                    ...simplexNoiseNode,
                                    offsetY: value,
                                })
                            }
                        />
                    </HStack>
                </Stack>
            </>
        );
    };

    return (
        <>
            <Input
                type='number'
                label='Seed'
                value={node && node.seed}
                step={1000}
                precision={0}
                onChange={(value) =>
                    setNode({
                        ...node,
                        seed: value,
                    })
                }
            />
            <Input
                label='Noise Type'
                type='select'
                placeholder='Select noise type'
                size='md'
                value={noiseType || ''}
                onChange={(value) =>
                    setNode({
                        ...node,
                        noiseType: value as NoiseTypeEnum,
                    })
                }
                options={Object.values(NoiseTypeEnum).map((noiseType) => ({
                    value: noiseType,
                    label: noiseType,
                }))}
            />
            <Input
                type='number'
                label='Multiplier'
                value={node && node.multiplier}
                step={0.1}
                onChange={(value) =>
                    setNode({
                        ...node,
                        multiplier: value,
                    })
                }
            />
            {noiseType === NoiseTypeEnum.Simplex && simplexNoiseJSX()}
        </>
    );
}
