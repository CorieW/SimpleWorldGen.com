import { useState } from 'react';
import './EditorOverlay.scss';
import Layers from '../Layers/Layers';
import NodeEditorModal from '../NodeEditorForm/NodeEditorModal';
import { Button } from '@chakra-ui/react';
import VisualizationSidebar from '../VisualizationSidebar/VisualizationSidebar';
import SettingsSidebar from '../SettingsSidebar/SettingsSidebar';
import NodesModal from '../NodesModal/NodesModal';

type Props = {
    zoomIn: () => void;
    zoomOut: () => void;
    resetView: () => void;
}

function EditorOverlay(props: Props) {
    const [settingsSidebarOpen, setSettingsSidebarOpen] = useState(false);
    const [visualizationSidebarOpen, setVisualizationSidebarOpen] =
        useState(false);

    return (
        <div id='editor-overlay'>
            <div id='unsupported-resolution-cover'>
                <span>Unsupported Resolution</span>
            </div>

            <Layers />
            <NodesModal />
            <NodeEditorModal />
            <div id='editor-overlay-btns'>
                <div className='btn-group menu-btns'>
                    <Button
                        id='settings-btn'
                        onClick={() =>
                            setSettingsSidebarOpen(!settingsSidebarOpen)
                        }
                    >
                        <i className='fa-solid fa-cog'></i>
                    </Button>
                    <Button
                        id='toggle-visualization-menu-btn'
                        onClick={() =>
                            setVisualizationSidebarOpen(
                                !visualizationSidebarOpen
                            )
                        }
                    >
                        <i className='fa-solid fa-palette'></i>
                    </Button>
                </div>
                <div className='btn-group zoom-btns'>
                    <Button id='zoom-in-btn' onClick={props.zoomIn}>
                        <i className='fa-solid fa-magnifying-glass-plus'></i>
                    </Button>
                    <Button id='zoom-out-btn' onClick={props.zoomOut}>
                        <i className='fa-solid fa-magnifying-glass-minus'></i>
                    </Button>
                    <Button id='reset-view-btn' onClick={props.resetView}>
                        <i className="fa-solid fa-arrows-to-dot"></i>
                    </Button>
                </div>
                {/* <div> // TODO: Implement save functionality
                    <Button id='save-btn'>
                        <i className='fa-solid fa-save'></i>
                    </Button>
                </div> */}
            </div>

            {
                <SettingsSidebar
                    sidebarOpen={settingsSidebarOpen}
                    setSidebarOpen={setSettingsSidebarOpen}
                />
            }
            {
                <VisualizationSidebar
                    sidebarOpen={visualizationSidebarOpen}
                    setSidebarOpen={setVisualizationSidebarOpen}
                />
            }
        </div>
    );
}

export default EditorOverlay;
