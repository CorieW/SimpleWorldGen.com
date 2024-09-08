import { useState } from 'react';
import './Layers.scss';
import { ILayer } from '../../../../ts/interfaces/ILayer';
import useStore from '../../editorStore';
import Layer from '../Layer/Layer';
import { Button } from '@chakra-ui/react';
import { NodeTypeEnum } from '../../../../ts/enums/NodeTypeEnum';
import ScrollContainer from '../../../../components/ScrollContainer/ScrollContainer';

export default function Layers({}: any) {
    const { layers, getNewLayerId, getNewNodeId, addLayer } = useStore();

    const [expanded, setExpanded] = useState<boolean>(false);

    function addNewLayer() {
        // Todo: Simplify this function
        const newLayerId = getNewLayerId();
        const newNodeId = getNewNodeId();
        addLayer({
            id: newLayerId,
            name: `Layer ${newLayerId}`,
            beginningNode: {
                id: newNodeId,
                type: NodeTypeEnum.Noise,
                effect: null,
                nextNode: null,
            },
        });
    }

    const listJSX = (
        <div className='list-container'>
            <ScrollContainer mode='horizontal'>
                <ul className='layer-list'>
                    {layers.map((layer: ILayer) => (
                        <Layer key={layer.id} {...layer} />
                    ))}
                    <li id='add-layer-listing'>
                        <Button size='sm' onClick={addNewLayer}>
                            <i className='fa-solid fa-plus'></i>
                        </Button>
                    </li>
                </ul>
            </ScrollContainer>
        </div>
    );

    return (
        <div id='layers-container'>
            <div className='inner-container'>
                <Button
                    id='toggle-layers-btn'
                    size='sm'
                    onClick={() => setExpanded(!expanded)}
                >
                    <i className={`fa-solid fa-arrow-${expanded ? 'down' : 'up'}`} />
                    <span>
                        {expanded ? 'Collapse Layers' : 'Expand Layers'}
                    </span>
                </Button>
                {expanded && listJSX}
            </div>
        </div>
    );
}
