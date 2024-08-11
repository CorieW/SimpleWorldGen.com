import './World.scss'
import IWorldInfo from '../../../ts/interfaces/IWorldInfo';
import routing from '../../../ts/routing';

type Props = {
    worldInfo: IWorldInfo;
}

export default function World(props: Props) {
    const { worldInfo } = props;

    return (
        <div className='world'>
            <h3>{worldInfo.name}</h3>
            <img src={worldInfo.imgUri} alt='World Image' />
            <div className='btns-container'>
                <br />
                <a href={routing.getEditorPath(worldInfo.id.toString())} className='view-btn' target='_blank' rel='noreferrer'>View</a>
            </div>
        </div>
    )
}