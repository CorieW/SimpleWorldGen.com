import { useState } from 'react';
import './EditorOverlay.scss';
import Layers from '../Layers/Layers';
import useStore from '../../editorStore';
import NodeEditorModal from '../NodeEditorForm/NodeEditorModal';
import { Button } from '@chakra-ui/react';
import VisualizationSidebar from '../VisualizationSidebar/VisualizationSidebar';
import SettingsSidebar from '../SettingsSidebar/SettingsSidebar';

type Props = {};

function EditorOverlay({}: Props) {
    const [settingsSidebarOpen, setSettingsSidebarOpen] = useState(false);
    const [visualizationSidebarOpen, setVisualizationSidebarOpen] =
        useState(false);

    return (
        <div id='editor-overlay'>
            <div id='editor-layers'>
                <Layers />
                <NodeEditorModal />
                <div id='editor-overlay-btns'>
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
        </div>
    );
}

export default EditorOverlay;
