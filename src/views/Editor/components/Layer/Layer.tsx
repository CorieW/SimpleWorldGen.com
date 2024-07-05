import { useState, useEffect } from 'react';
import './Layer.scss';
import Node from '../Node/Node';
import { INode } from '../../../../ts/interfaces/INode';
import { ILayer } from '../../../../ts/interfaces/ILayer';
import editorStore from '../../editorStore';
import appStore from '../../../../appStore';
import { Button } from '@chakra-ui/react';
import ConfirmableInput from '../../../../components/ConfirmableInput/ConfirmableInput';
import { NodeEffectEnum } from '../../../../ts/enums/NodeEffectEnum';
import { NodeTypeEnum } from '../../../../ts/enums/NodeTypeEnum';
import ScrollContainer from '../../../../components/ScrollContainer/ScrollContainer';

export default function Layer(props: ILayer) {
    const { id, name, beginningNode } = props;

    const { addNotification } = appStore();

    const {
        layers,
        modifyLayer,
        removeLayer,
        addNode,
        getNewNodeId,
        canMoveLayer,
        moveLayer,
    } = editorStore();

    const [expanded, setExpanded] = useState<boolean>(false);
    const [nodes, setNodes] = useState<INode[]>([]);

    useEffect(() => {
        setNodes(getAllNodes(beginningNode));
    }, [props]);

    function getAllNodes(node: INode): INode[] {
        if (node.nextNode) {
            return [node, ...getAllNodes(node.nextNode)];
        } else {
            return [node];
        }
    }

    function removeThisLayer() {
        removeLayer(id);
    }

    function addNodeToTopOfLayer() {
        // Todo: Simplify this function
        const newNodeId = getNewNodeId();
        addNode(
            {
                id: newNodeId,
                type: NodeTypeEnum.Noise,
                effect: NodeEffectEnum.Add,
                nextNode: null,
            },
            id
        );
    }

    function changeLayerName(value: string) {
        // Check if name is unique (don't include the current layer in the check)
        const layerIsUnique = layers
            .filter((layer) => layer.id !== id)
            .every((layer) => layer.name !== value);

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

        console.log(newName);

        modifyLayer(id, { ...props, name: newName });
    }

    const expandBtnJSX = () => (
        <button className='expand-btn' onClick={() => setExpanded(!expanded)}>
            <i
                className={`fa-solid fa-chevron-${expanded ? 'down' : 'up'}`}
            ></i>
        </button>
    );

    return (
        <div className='layer-container'>
            <ConfirmableInput
                value={name}
                changeValue={(value: string) => changeLayerName(value)}
            />
            <div className='inner-layer-container'>
                <ScrollContainer mode='vertical'>
                    <ul className={`node-list ${expanded ? 'expanded' : ''}`}>
                        {nodes.map((node: INode, index: number) => (
                            <Node key={index} {...node} />
                        ))}
                    </ul>
                </ScrollContainer>
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
                    className='add-btn'
                    colorScheme='transparent'
                    size='sm'
                    onClick={addNodeToTopOfLayer}
                >
                    <i className='fa-solid fa-plus'></i>
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
            {nodes.length > 1 && expandBtnJSX()}
        </div>
    );
}
