import './WorldCard.scss'
import IWorldInfo from '../../../ts/interfaces/IWorldInfo';
import routing from '../../../ts/routing';
import Button from '../../../components/Basic/Button/Button';

type Props = {
    worldInfo: IWorldInfo;
}

export default function WorldCard(props: Props) {
    const { worldInfo } = props;

    return (
        <div className='world-card'>
            <h3>{worldInfo.name}</h3>
            <img src={worldInfo.imgUri} alt='World Image' />
            <div className='btns-container'>
                <br />
                <Button linkButton={true} href={routing.getEditorPath(worldInfo.id.toString())} className='view-btn' target='_blank' rel='noreferrer'>View World</Button>
            </div>
        </div>
    )
}