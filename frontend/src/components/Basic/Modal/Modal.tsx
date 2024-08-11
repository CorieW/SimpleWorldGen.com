import './Modal.scss'

type Props = {
    modalOpen: boolean
    setModalOpen: (modalOpen: boolean) => void
    contentJSX: JSX.Element
    bottomBarJSX?: JSX.Element
}

export default function Modal(props: Props) {
    const { modalOpen, setModalOpen, contentJSX, bottomBarJSX } = props

    const bottomBarContainerJSX = (
        <div className='bottom-bar'>
            {bottomBarJSX}
        </div>
    )

    return (
        <div
            id='outer-modal-container'
            className={!modalOpen ? 'hidden' : ''}
        >
            <div id='inner-modal-container'>
                <div className='top-bar'>
                    <p></p>
                    <button
                        id='close-modal-btn'
                        onClick={ () => setModalOpen(false) }
                    >
                        <i className='fa-solid fa-xmark'></i>
                    </button>
                </div>
                <div className='content-container'>
                    {contentJSX}
                </div>
                { bottomBarJSX ? bottomBarContainerJSX : null }
            </div>
        </div>
    )
}