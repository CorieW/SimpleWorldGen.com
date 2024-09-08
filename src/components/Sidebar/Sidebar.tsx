import { useState } from 'react';
import './Sidebar.scss';
import { Button, Text } from '@chakra-ui/react';

type Props = {
    open: boolean;
    setOpen: (menuOpen: boolean) => void;
    onClose: () => void;
    title: string;
    contentJSX: JSX.Element;
    bottomBarContentJSX: JSX.Element | null;
};

export default function Sidebar(props: Props) {
    const { open, setOpen, onClose, title, contentJSX, bottomBarContentJSX } =
        props;

    const [expanded, setExpanded] = useState<boolean>(false);

    function closeSidebar() {
        setOpen(false);
        onClose();
    }

    return (
        <div
            className={`sidebar ${open ? '' : 'hidden'} ${
                expanded ? 'expanded' : ''
            }`}
        >
            <div className='top-bar-container'>
                {/* <Button // ! Temporarily removed expand button
                    className='expand-btn'
                    onClick={() => setExpanded(!expanded)}
                >
                    <i
                        className={`fa-solid fa-${
                            expanded ? 'compress' : 'expand'
                        }`}
                    ></i>
                </Button> */}
                <div></div>
                <Button className='close-btn' onClick={() => closeSidebar()}>
                    <i className='fa-solid fa-times'></i>
                </Button>
            </div>
            <div className='title-container'>
                <Text fontSize='2xl' fontWeight={600}>
                    {title}
                </Text>
            </div>
            <div className='content-container'>{contentJSX}</div>
            <div className='bottom-bar-container'>{bottomBarContentJSX}</div>
        </div>
    );
}
