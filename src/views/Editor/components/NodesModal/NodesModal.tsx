import { Fragment, type ReactNode } from 'react';
import ToolPanel from '../../../../components/ToolPanel/ToolPanel';
import IconButton from '../../../../components/IconButton/IconButton';
import { INode } from '../../../../ts/interfaces/INode';
import { NodeEffectEnum } from '../../../../ts/enums/NodeEffectEnum';
import useStore from '../../editorStore';
import Node from './Node/Node';
import './NodesModal.scss';

export default function NodesModal() {
    const store = useStore();
    const layer = store.getLayer(store.activeFormLayerId);

    function closePanel() {
        store.setActiveFormLayerId(-1);
    }

    function removeLayer() {
        store.removeLayer(store.activeFormLayerId);
        closePanel();
    }

    function getNodes(): INode[] {
        const nodes: INode[] = [];
        let node = layer?.beginningNode || null;
        while (node) {
            nodes.push(node);
            node = node.nextNode;
        }
        return nodes;
    }

    const footer = (
        <div className='panel-actions node-actions'>
            <IconButton icon='fa-plus' label='Add node' onClick={() => store.addNode(null, store.activeFormLayerId)} />
            <IconButton icon='fa-trash' label='Delete layer' className='danger-btn' onClick={removeLayer} />
            <IconButton
                icon='fa-arrow-left'
                label='Move layer left'
                disabled={!store.canMoveLayer(store.activeFormLayerId, 'left')}
                onClick={() => store.moveLayer(store.activeFormLayerId, 'left')}
            />
            <IconButton
                icon='fa-arrow-right'
                label='Move layer right'
                disabled={!store.canMoveLayer(store.activeFormLayerId, 'right')}
                onClick={() => store.moveLayer(store.activeFormLayerId, 'right')}
            />
        </div>
    );

    return (
        <ToolPanel
            open={store.activeFormLayerId !== -1 && store.activeFormNodeId === -1}
            onClose={closePanel}
            title={layer?.name || 'Layer'}
            eyebrow='Layer graph'
            footer={footer}
        >
            <p className='panel-intro'>Select a node to tune how this layer is generated.</p>
            <div className='nodes-container'>
                {getNodes().map((node, index) => (
                    <Fragment key={node.id}>
                        {index > 0 && <span className='effect-symbol'>{effectSymbol(node.effect)}</span>}
                        <Node {...node} />
                    </Fragment>
                ))}
            </div>
        </ToolPanel>
    );
}

function effectSymbol(effect: NodeEffectEnum | null): ReactNode {
    const icons: Partial<Record<NodeEffectEnum, string>> = {
        [NodeEffectEnum.Add]: 'fa-plus',
        [NodeEffectEnum.Subtract]: 'fa-minus',
        [NodeEffectEnum.Multiply]: 'fa-times',
        [NodeEffectEnum.Divide]: 'fa-divide',
    };
    return icons[effect as NodeEffectEnum]
        ? <i className={`fa-solid ${icons[effect as NodeEffectEnum]}`} aria-hidden='true'></i>
        : null;
}
