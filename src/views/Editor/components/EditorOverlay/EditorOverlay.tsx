import { useState } from 'react';
import './EditorOverlay.scss';
import Layers from '../Layers/Layers';
import NodeEditorModal from '../NodeEditorForm/NodeEditorModal';
import { Button } from '@chakra-ui/react';
import VisualizationSidebar from '../VisualizationSidebar/VisualizationSidebar';
import SettingsSidebar from '../SettingsSidebar/SettingsSidebar';
import NodesModal from '../NodesModal/NodesModal';
import SaveModal from '../SaveModal/SaveModal';

type Props = {
    zoomIn: () => void;
    zoomOut: () => void;
    resetView: () => void;
}

function EditorOverlay(props: Props) {
    const [saveModalOpen, setSaveModalOpen] = useState(false);
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
                        id='save-btn'
                        className={`tool-btn ${saveModalOpen ? 'active' : ''}`}
                        aria-label='Save or load world'
                        aria-pressed={saveModalOpen}
                        title='Save / Load'
                        onClick={() => setSaveModalOpen(true)}
                    >
                        <i className='fa-solid fa-save' aria-hidden='true'></i>
                    </Button>
                    <Button
                        id='settings-btn'
                        className={`tool-btn ${settingsSidebarOpen ? 'active' : ''}`}
                        aria-label='Open world settings'
                        aria-pressed={settingsSidebarOpen}
                        title='World settings'
                        onClick={() =>
                            setSettingsSidebarOpen(!settingsSidebarOpen)
                        }
                    >
                        <i className='fa-solid fa-cog' aria-hidden='true'></i>
                    </Button>
                    <Button
                        id='toggle-visualization-menu-btn'
                        className={`tool-btn ${visualizationSidebarOpen ? 'active' : ''}`}
                        aria-label='Open visualization settings'
                        aria-pressed={visualizationSidebarOpen}
                        title='Visualization settings'
                        onClick={() =>
                            setVisualizationSidebarOpen(
                                !visualizationSidebarOpen
                            )
                        }
                    >
                        <i className='fa-solid fa-palette' aria-hidden='true'></i>
                    </Button>
                </div>
                <div className='btn-group zoom-btns'>
                    <Button className='tool-btn' id='zoom-in-btn' aria-label='Zoom in' title='Zoom in' onClick={props.zoomIn}>
                        <i className='fa-solid fa-magnifying-glass-plus' aria-hidden='true'></i>
                    </Button>
                    <Button className='tool-btn' id='zoom-out-btn' aria-label='Zoom out' title='Zoom out' onClick={props.zoomOut}>
                        <i className='fa-solid fa-magnifying-glass-minus' aria-hidden='true'></i>
                    </Button>
                    <Button className='tool-btn' id='reset-view-btn' aria-label='Reset view' title='Reset view' onClick={props.resetView}>
                        <i className="fa-solid fa-arrows-to-dot" aria-hidden='true'></i>
                    </Button>
                </div>
            </div>

            <SaveModal
                modalOpen={saveModalOpen}
                setModalOpen={setSaveModalOpen}
            />
            <SettingsSidebar
                sidebarOpen={settingsSidebarOpen}
                setSidebarOpen={setSettingsSidebarOpen}
            />
            <VisualizationSidebar
                sidebarOpen={visualizationSidebarOpen}
                setSidebarOpen={setVisualizationSidebarOpen}
            />
        </div>
    );
}

export default EditorOverlay;
