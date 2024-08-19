import './Modal.scss'

export interface IModal {
    contentJSX: JSX.Element
    bottomBarJSX?: JSX.Element
    width?: 'sm' | 'md' | 'lg' | 'xl'
    height?: 'sm' | 'md' | 'lg' | 'xl'
    useExactHeight?: boolean
}

type ModalProps = {
    modal: IModal | null
    open: boolean
    closeFunc: () => void
}

export default function Modal(props: ModalProps) {
    const {
        modal,
        open,
        closeFunc,
    } = props

    if (!modal) return null

    const {
        contentJSX,
        bottomBarJSX,
        width = 'sm',
        height = 'xl',
        useExactHeight = false
    } = modal

    function getModalWidth() {
        switch (width) {
            case 'sm':
                return '30%'
            case 'md':
                return '45%'
            case 'lg':
                return '60%'
            case 'xl':
                return '80%'
            default:
                return '30%'
        }
    }

    function getModalHeight() {
        switch (height) {
            case 'sm':
                return '80%'
            case 'md':
                return '45%'
            case 'lg':
                return '60%'
            case 'xl':
                return '80%'
            default:
                return '30%'
        }
    }

    const styling = {
        width: getModalWidth(),
        height: useExactHeight ? getModalHeight() : 'auto',
        maxHeight: getModalHeight(),
    }

    const bottomBarContainerJSX = (
        <div className='bottom-bar'>
            {bottomBarJSX}
        </div>
    )

    return (
        <div
            id='outer-modal-container'
            className={!open ? 'hidden' : ''}
        >
            <div id='inner-modal-container' style={styling}>
                <div className='top-bar'>
                    <p></p>
                    <button
                        id='close-modal-btn'
                        onClick={ () => closeFunc() }
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