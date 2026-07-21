import './NodesModal.scss'
import { Fragment, type ReactNode } from 'react'
import Modal from '../../../../components/Modal/Modal'
import useStore from '../../editorStore'
import { Button } from '@chakra-ui/react'
import { INode } from '../../../../ts/interfaces/INode'
import Node from './Node/Node'
import { NodeEffectEnum } from '../../../../ts/enums/NodeEffectEnum'

export default function NodesModal() {
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

    function getEffectSymbol(effect: NodeEffectEnum | null): ReactNode {
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
                    <Fragment key={node.id}>
                        {index !== 0 && getEffectSymbol(node.effect)}
                        <Node {...node} />
                    </Fragment>
                ))}
            </div>
        )
    }

    function bottomBarJSX() {
        return (
            <div id='nodes-modal-bottom-bar'>
                <div>
                    <Button
                        colorPalette='green'
                        size='md'
                        onClick={() => addNode(null, activeFormLayerId)}
                    >
                        <i className='fa-solid fa-plus'></i>
                    </Button>
                    <Button
                        colorPalette='red'
                        size='md'
                        onClick={removeThisLayer}
                    >
                        <i className='fa-solid fa-trash'></i>
                    </Button>
                    <Button
                        colorPalette='blue'
                        size='md'
                        disabled={!canMoveLayer(activeFormLayerId, 'left')}
                        onClick={() => moveLayer(activeFormLayerId, 'left')}
                    >
                        <i className='fa-solid fa-arrow-left'></i>
                    </Button>
                    <Button
                        colorPalette='blue'
                        size='md'
                        disabled={!canMoveLayer(activeFormLayerId, 'right')}
                        onClick={() => moveLayer(activeFormLayerId, 'right')}
                    >
                        <i className='fa-solid fa-arrow-right'></i>
                    </Button>
                </div>
                <div>
                    <Button
                        colorPalette='gray'
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
