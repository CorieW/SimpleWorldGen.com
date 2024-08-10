import { useState, useEffect, useRef } from 'react';
import './NodeEditorModal.scss';
import useStore from '../../editorStore';
import {
    Button,
    Divider,
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
    }, [activeFormNodeId]);

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
            onChange={(val: any) =>
                setCurrentNode({ ...currentNode, effect: val as NodeEffectEnum } as INode)
            }
            options={Object.values(NodeEffectEnum).map((effectType: any) => ({
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
            onChange={(val: any) =>
                setCurrentNode({ ...currentNode, type: val as NodeTypeEnum } as INode)
            }
            options={Object.values(NodeTypeEnum).map((nodeType: any) => ({
                value: nodeType,
                label: nodeType,
            }))}
        />
    );

    console.log(nodeFirstInLayer);

    const contentJSX = () => (
        <div id='node-editor-modal-content-container'>
            <div className='display-container'>
                <div className='inner-container'>
                    <canvas id='editor-form-canvas' ref={canvasRef}></canvas>
                </div>
            </div>
            <div className='form-container'>
                <h2 className='title'>Edit Node</h2>
                <Stack spacing={3}>
                    {!nodeFirstInLayer && nodeEffectSelectJSX()}
                    {nodeTypeSelectJSX()}
                    <Divider />
                    {currentNode && currentNode.type === NodeTypeEnum.Noise &&
                        NoiseNodeEditorSection(
                            { node: currentNode as INoiseNode, setNode: setCurrentNode }
                        )
                    }
                </Stack>
            </div>
        </div>
    );

    const bottomBarJSX = () => (
        <div id='node-editor-modal-bottom-bar'>
            <div>
                <Button
                    colorScheme='red'
                    size='md'
                    onClick={removeThisNode}
                >
                    <i className='fa-solid fa-trash'></i>
                </Button>
                <Button
                    colorScheme='blue'
                    size='md'
                    isDisabled={!canMoveNode(activeFormNodeId, 'up')}
                    onClick={() => moveNode(activeFormNodeId, 'up')}
                >
                    <i className='fa-solid fa-arrow-up'></i>
                </Button>
                <Button
                    colorScheme='blue'
                    size='md'
                    isDisabled={!canMoveNode(activeFormNodeId, 'down')}
                    onClick={() => moveNode(activeFormNodeId, 'down')}
                >
                    <i className='fa-solid fa-arrow-down'></i>
                </Button>
            </div>
            <div>
                <Button
                    colorScheme='gray'
                    size='md'
                    onClick={closeEditorForm}
                >
                    Cancel
                </Button>
                <Button
                    colorScheme='green'
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
            <Modal modalOpen={activeFormNodeId !== -1} setModalOpen={closeForm} contentJSX={contentJSX()} bottomBarJSX={bottomBarJSX()} />
        </div>
    );
}

function NoiseNodeEditorSection(props: { node: INoiseNode; setNode: Function }) {
    const { node, setNode } = props;
    const { noiseType } = node as INoiseNode;

    const simplexNoiseJSX = () => {
        let simplexNoiseNode = node as ISimplexNoiseNode;
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
                <Stack spacing={3}>
                    <Input
                        type='number'
                        label='Octaves'
                        value={octaves}
                        precision={0}
                        step={1}
                        min={1}
                        max={8}
                        onChange={(val: any) =>
                            setNode({
                                ...simplexNoiseNode,
                                octaves: val,
                            })
                        }
                    />
                    <Input
                        type='number'
                        label='Persistence'
                        value={persistence}
                        step={0.1}
                        onChange={(val: any) =>
                            setNode({
                                ...simplexNoiseNode,
                                persistence: val,
                            })
                        }
                    />
                    <Input
                        type='number'
                        label='Lacunarity'
                        value={lacunarity}
                        step={0.1}
                        onChange={(val: any) =>
                            setNode({
                                ...simplexNoiseNode,
                                lacunarity: val,
                            })
                        }
                    />
                    <Input
                        type='number'
                        label='Frequency'
                        value={frequency}
                        step={0.1}
                        onChange={(val: any) =>
                            setNode({
                                ...simplexNoiseNode,
                                frequency: val,
                            })
                        }
                    />
                    <HStack gap={3}>
                        <Input
                            type='number'
                            label='Offset X'
                            value={offsetX}
                            step={1}
                            onChange={(val: any) =>
                                setNode({
                                    ...simplexNoiseNode,
                                    offsetX: val,
                                })
                            }
                        />
                        <Input
                            type='number'
                            label='Offset Y'
                            value={offsetY}
                            step={1}
                            onChange={(val: any) =>
                                setNode({
                                    ...simplexNoiseNode,
                                    offsetY: val,
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
                onChange={(val: any) =>
                    setNode({
                        ...node,
                        seed: val,
                    })
                }
            />
            <Input
                label='Noise Type'
                type='select'
                placeholder='Select noise type'
                size='md'
                value={noiseType || ''}
                onChange={(val: any) =>
                    setNode({
                        ...node,
                        noiseType: val as NoiseTypeEnum,
                    })
                }
                options={Object.values(NoiseTypeEnum).map((noiseType: any) => ({
                    value: noiseType,
                    label: noiseType,
                }))}
            />
            <Input
                type='number'
                label='Multiplier'
                value={node && node.multiplier}
                step={0.1}
                onChange={(val: any) =>
                    setNode({
                        ...node,
                        multiplier: val,
                    })
                }
            />
            {noiseType === NoiseTypeEnum.Simplex && simplexNoiseJSX()}
        </>
    );
}
