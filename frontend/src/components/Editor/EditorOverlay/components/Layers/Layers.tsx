import { useState } from 'react';
import './Layers.scss';
import { ILayer } from '../../../../../ts/interfaces/generation/ILayer';
import useStore from '../../../editorStore';
import Layer from '../Layer/Layer';
import { Button } from '@chakra-ui/react';
import { NodeTypeEnum } from '../../../../../ts/enums/NodeTypeEnum';
import ScrollContainer from '../../../../Basic/ScrollContainer/ScrollContainer';

export default function Layers({}: any) {
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
                    <i
                        className={`fa-solid fa-arrow-${expanded ? 'down' : 'up'}`}
                    ></i>
                </Button>
                {expanded && listJSX}
            </div>
        </div>
    );
}
