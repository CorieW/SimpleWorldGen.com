import './NodesModal.scss'
import Modal from '../../../../Basic/Modal/Modal'
import useStore from '../../../editorStore'
import { Button } from '@chakra-ui/react'
import { INode } from '../../../../../ts/interfaces/generation/INode'
import Node from './Node/Node'
import { NodeEffectEnum } from '../../../../../ts/enums/NodeEffectEnum'

type Props = {}

export default function NodesModal({}: Props) {
    const {
        activeFormLayerId,
        setActiveFormLayerId,
        removeLayer,
        canMoveLayer,
        moveLayer,
        addNode,
        getLayer,
    } = useStore()

    const layer = getLayer(activeFormLayerId)

    function closeForm() {
        setActiveFormLayerId(-1)
    }

    function removeThisLayer() {
        removeLayer(activeFormLayerId)
        closeForm()
    }

    function getNodes(): INode[] {
        const nodes: INode[] = []

        if (!layer) return nodes

        let currentNode: INode | null = layer.beginningNode
        while (currentNode) {
            nodes.push(currentNode)
            currentNode = currentNode.nextNode
        }

        return nodes
    }

    function getEffectSymbol(effect: NodeEffectEnum | null): JSX.Element | string {
        switch (effect) {
            case NodeEffectEnum.Add:
                return <i className="fa-solid fa-plus"></i>
            case NodeEffectEnum.Subtract:
                return <i className="fa-solid fa-minus"></i>
            case NodeEffectEnum.Multiply:
                return <i className="fa-solid fa-times"></i>
            case NodeEffectEnum.Divide:
                return <i className="fa-solid fa-divide"></i>
            default:
                return ''
        }
    }

    function contentJSX() {
        return (
            <div className='nodes-container'>
                {getNodes().map((node, index) => (
                    <>
                        {index !== 0 && getEffectSymbol(node.effect)}
                        <Node key={index} {...node} />
                    </>
                ))}
            </div>
        )
    }

    function bottomBarJSX() {
        return (
            <div id='nodes-modal-bottom-bar'>
                <div>
                    <Button
                        colorScheme='green'
                        size='md'
                        onClick={() => addNode(null, activeFormLayerId)}
                    >
                        <i className='fa-solid fa-plus'></i>
                    </Button>
                    <Button
                        colorScheme='red'
                        size='md'
                        onClick={removeThisLayer}
                    >
                        <i className='fa-solid fa-trash'></i>
                    </Button>
                    <Button
                        colorScheme='blue'
                        size='md'
                        isDisabled={!canMoveLayer(activeFormLayerId, 'left')}
                        onClick={() => moveLayer(activeFormLayerId, 'left')}
                    >
                        <i className='fa-solid fa-arrow-left'></i>
                    </Button>
                    <Button
                        colorScheme='blue'
                        size='md'
                        isDisabled={!canMoveLayer(activeFormLayerId, 'right')}
                        onClick={() => moveLayer(activeFormLayerId, 'right')}
                    >
                        <i className='fa-solid fa-arrow-right'></i>
                    </Button>
                </div>
                <div>
                    <Button
                        colorScheme='gray'
                        size='md'
                        onClick={closeForm}
                    >
                        Close
                    </Button>
                </div>
            </div>
        )
    }

    return (
        <div id='nodes-modal-container'>
            <Modal modalOpen={activeFormLayerId !== -1} setModalOpen={closeForm} contentJSX={contentJSX()} bottomBarJSX={bottomBarJSX()} />
        </div>
    )
}