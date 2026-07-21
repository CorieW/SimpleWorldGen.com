import { Fragment, forwardRef, useImperativeHandle, type ReactNode } from 'react'
import './NodesModal.scss'
import useAppStore from '../../../../../ts/appStore'
import useEditorStore from '../../../editorStore'
import { Button } from '@chakra-ui/react'
import { INode } from '../../../../../ts/interfaces/generation/INode'
import Node from './Node/Node'
import { NodeEffectEnum } from '../../../../../ts/enums/NodeEffectEnum'

type Props = {
    nodeId: number
}

const NodesModal = forwardRef((props: Props, ref) => {
    const { nodeId } = props

    const { openModal, closeTopModal } = useAppStore()
    const {
        removeLayer,
        canMoveLayer,
        moveLayer,
        addNode,
        getLayer,
    } = useEditorStore()

    useImperativeHandle(ref, () => ({
        openModal(): void {
            openModal({
                contentJSX: contentJSX(),
                bottomBarJSX: bottomBarJSX(),
            })
        },
    }));

    function removeThisLayer() {
        removeLayer(nodeId)
        closeTopModal()
    }

    function getNodes(): INode[] {
        const nodes: INode[] = []

        const layer = getLayer(nodeId)
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

    const contentJSX = (): ReactNode => {
        return (
            <div id='nodes-modal-content-container'>
                {getNodes().map((node, index) => (
                    <Fragment key={node.id}>
                        {index !== 0 && getEffectSymbol(node.effect)}
                        <Node {...node} />
                    </Fragment>
                ))}
            </div>
        )
    }

    const bottomBarJSX = (): ReactNode => {
        return (
            <div id='nodes-modal-bottom-bar'>
                <div>
                    <Button
                        colorPalette='green'
                        size='md'
                        onClick={() => addNode(null, nodeId)}
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
                        disabled={!canMoveLayer(nodeId, 'left')}
                        onClick={() => moveLayer(nodeId, 'left')}
                    >
                        <i className='fa-solid fa-arrow-left'></i>
                    </Button>
                    <Button
                        colorPalette='blue'
                        size='md'
                        disabled={!canMoveLayer(nodeId, 'right')}
                        onClick={() => moveLayer(nodeId, 'right')}
                    >
                        <i className='fa-solid fa-arrow-right'></i>
                    </Button>
                </div>
                <div>
                    <Button
                        colorPalette='gray'
                        size='md'
                        onClick={closeTopModal}
                    >
                        Close
                    </Button>
                </div>
            </div>
        )
    }

    return <></>
})

export default NodesModal;
