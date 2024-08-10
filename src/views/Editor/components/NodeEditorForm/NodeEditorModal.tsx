import { useState, useEffect, useRef } from 'react';
import './NodeEditorModal.scss';
import useStore from '../../editorStore';
import {
    Button,
    Divider,
    Select,
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
        <Select
            placeholder='Select the node effect'
            size='md'
            value={currentNode && currentNode.effect || ''}
            onChange={(e) =>
                setCurrentNode({ ...currentNode, effect: e.target.value as NodeEffectEnum } as INode)
            }
        >
            {Object.values(NodeEffectEnum).map((effectType: any) => (
                <option key={effectType} value={effectType}>
                    {effectType}
                </option>
            ))}
        </Select>
    );

    const nodeTypeSelectJSX = () => (
        <Select
            placeholder='Select the node effect'
            size='md'
            value={currentNode && currentNode.type || ''}
            onChange={(e) =>
                setCurrentNode({ ...currentNode, type: e.target.value as NodeTypeEnum } as INode)
            }
        >
            {Object.values(NodeTypeEnum).map((nodeType: any) => (
                <option key={nodeType} value={nodeType}>
                    {nodeType}
                </option>
            ))}
        </Select>
    );

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
                        onChange={(valString: any) =>
                            setNode({
                                ...simplexNoiseNode,
                                octaves: valString,
                            })
                        }
                    />
                    <Input
                        type='number'
                        label='Persistence'
                        value={persistence}
                        step={0.1}
                        onChange={(valString: any) =>
                            setNode({
                                ...simplexNoiseNode,
                                persistence: valString,
                            })
                        }
                    />
                    <Input
                        type='number'
                        label='Lacunarity'
                        value={lacunarity}
                        step={0.1}
                        onChange={(valString: any) =>
                            setNode({
                                ...simplexNoiseNode,
                                lacunarity: valString,
                            })
                        }
                    />
                    <Input
                        type='number'
                        label='Frequency'
                        value={frequency}
                        step={0.1}
                        onChange={(valString: any) =>
                            setNode({
                                ...simplexNoiseNode,
                                frequency: valString,
                            })
                        }
                    />
                    <HStack gap={3}>
                        <Input
                            type='number'
                            label='Offset X'
                            value={offsetX}
                            step={1}
                            onChange={(valString: any) =>
                                setNode({
                                    ...simplexNoiseNode,
                                    offsetX: valString,
                                })
                            }
                        />
                        <Input
                            type='number'
                            label='Offset Y'
                            value={offsetY}
                            step={1}
                            onChange={(valString: any) =>
                                setNode({
                                    ...simplexNoiseNode,
                                    offsetY: valString,
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
                onChange={(valString: any) =>
                    setNode({
                        ...node,
                        seed: valString,
                    })
                }
            />
            <Input
                label='Noise Type'
                placeholder='Select noise type'
                size='md'
                value={noiseType || ''}
                onChange={(valueString: any) =>
                    setNode({
                        ...node,
                        noiseType: valueString as NoiseTypeEnum,
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
                onChange={(valString: any) =>
                    setNode({
                        ...node,
                        multiplier: valString,
                    })
                }
            />
            {noiseType === NoiseTypeEnum.Simplex && simplexNoiseJSX()}
        </>
    );
}
