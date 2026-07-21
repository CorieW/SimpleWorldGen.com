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

    function renderContent() {
        return (
            <div className='nodes-modal-content'>
                <div className='nodes-heading'>
                    <span>Layer graph</span>
                    <h1>{layer?.name || 'Layer'}</h1>
                    <p>Select a node to tune how this layer is generated.</p>
                </div>
                <div className='nodes-container'>
                    {getNodes().map((node, index) => (
                        <Fragment key={node.id}>
                            {index !== 0 && <span className='effect-symbol'>{getEffectSymbol(node.effect)}</span>}
                            <Node {...node} />
                        </Fragment>
                    ))}
                </div>
            </div>
        )
    }

    function renderFooter() {
        return (
            <div id='nodes-modal-bottom-bar'>
                <div>
                    <Button
                        className='add-btn icon-btn'
                        aria-label='Add node'
                        title='Add node'
                        colorPalette='green'
                        size='md'
                        onClick={() => addNode(null, activeFormLayerId)}
                    >
                        <i className='fa-solid fa-plus'></i>
                    </Button>
                    <Button
                        className='danger-btn icon-btn'
                        aria-label='Delete layer'
                        title='Delete layer'
                        colorPalette='red'
                        size='md'
                        onClick={removeThisLayer}
                    >
                        <i className='fa-solid fa-trash'></i>
                    </Button>
                    <Button
                        className='move-btn icon-btn'
                        aria-label='Move layer left'
                        title='Move layer left'
                        colorPalette='blue'
                        size='md'
                        disabled={!canMoveLayer(activeFormLayerId, 'left')}
                        onClick={() => moveLayer(activeFormLayerId, 'left')}
                    >
                        <i className='fa-solid fa-arrow-left'></i>
                    </Button>
                    <Button
                        className='move-btn icon-btn'
                        aria-label='Move layer right'
                        title='Move layer right'
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
            <Modal open={activeFormLayerId !== -1} onClose={closeForm} footer={renderFooter()}>
                {renderContent()}
            </Modal>
        </div>
    )
}
