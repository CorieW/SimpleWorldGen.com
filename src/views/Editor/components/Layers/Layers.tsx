import { useState } from 'react';
import './Layers.scss';
import { ILayer } from '../../../../ts/interfaces/ILayer';
import useStore from '../../editorStore';
import Layer from '../Layer/Layer';
import { Button } from '@chakra-ui/react';
import { NodeTypeEnum } from '../../../../ts/enums/NodeTypeEnum';
import ScrollContainer from '../../../../components/ScrollContainer/ScrollContainer';

export default function Layers() {
    const { layers, getNewLayerId, getNewNodeId, addLayer } = useStore();

    const [expanded, setExpanded] = useState<boolean>(true);

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
                    <li className='add-layer-listing'>
                        <Button className='add-layer-btn' onClick={addNewLayer} aria-label='Add a new layer'>
                            <i className='fa-solid fa-plus' aria-hidden='true'></i>
                            <span>New layer</span>
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
                    className='toggle-layers-btn'
                    size='sm'
                    aria-expanded={expanded}
                    aria-label={expanded ? 'Collapse layers' : 'Expand layers'}
                    onClick={() => setExpanded(!expanded)}
                >
                    <span>Layers</span>
                    <i
                        className={`fa-solid fa-chevron-${expanded ? 'down' : 'up'}`}
                        aria-hidden='true'
                    ></i>
                </Button>
                {expanded && listJSX}
            </div>
        </div>
    );
}
