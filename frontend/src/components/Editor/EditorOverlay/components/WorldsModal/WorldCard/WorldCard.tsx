import { useState, useEffect } from 'react'
import './WorldCard.scss'
import Button from '../../../../../Basic/Button/Button'

type Props = {
    id: number,
    title: string,
    img: string,
    posterDisplayName: string,
    posterUsername: string,
    posterProfileImg: string,
    bookmarked: boolean,
}

export default function WorldCard(props: Props) {
    const { id, title, img, posterDisplayName, posterUsername, posterProfileImg, bookmarked } = props
    const [isBookmarked, setIsBookmarked] = useState<boolean>(bookmarked)

    useEffect(() => {
        // When bookmarked status changes, send a request to the server to update the bookmark status
    }, [isBookmarked])


    return (
        <div className='world-card'>
            <div className='poster-info-container'>
                <a>
                    <img src={posterProfileImg} alt={posterDisplayName} />
                    <p>{posterDisplayName}</p>
                </a>
            </div>
            <div className='world-display-container'>
                <h3>{title}</h3>
                <img src={img} alt={title} />
                <button className={`bookmark-btn ${isBookmarked ? 'bookmarked' : ''}`} onClick={() => setIsBookmarked(!isBookmarked)}>
                    <i className={`fa${isBookmarked ? 's' : 'r'} fa-bookmark`}></i>
                </button>
            </div>
            <Button
                color='black'
                size='small'
                className='view-btn'
                onClick={() => {
                    // Todo: Show warning if user has unsaved changes
                    // Todo: Set url to /editor?id={id}
                    // Todo: Open the world in the editor
                }}
            >
                View
            </Button>
        </div>
    )
}