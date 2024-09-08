import { useState, useRef } from 'react';
import './EditorOverlay.scss';
import Layers from './components/Layers/Layers';
import { Button } from '@chakra-ui/react';
import VisualizationSidebar from './components/VisualizationSidebar/VisualizationSidebar';
import SettingsSidebar from './components/SettingsSidebar/SettingsSidebar';
import useEditorStore from '../editorStore';
import SaveModal from './components/SaveModal/SaveModal';

function EditorOverlay() {
    const [settingsSidebarOpen, setSettingsSidebarOpen] = useState(false);
    const [visualizationSidebarOpen, setVisualizationSidebarOpen] = useState(false);

    const { zoomIn, zoomOut, resetView } = useEditorStore();

    const saveModalRef = useRef<any>(null);

    return (
        <div id='editor-overlay'>
            <SaveModal ref={saveModalRef} />
            <div id='unsupported-resolution-cover'>
                <span>Unsupported Resolution</span>
            </div>

            <Layers />
            <div id='editor-overlay-btns'>
                <div className='btn-group'>
                    <Button onClick={() => saveModalRef.current.openModal()}>
                        <i className="fa-solid fa-floppy-disk"></i>
                    </Button>
                </div>
                <div className='btn-group'>
                    <Button
                        onClick={() =>
                            setSettingsSidebarOpen(!settingsSidebarOpen)
                        }
                    >
                        <i className="fa-solid fa-earth-oceania"></i>
                    </Button>
                    <Button
                        onClick={() =>
                            setVisualizationSidebarOpen(
                                !visualizationSidebarOpen
                            )
                        }
                    >
                        <i className='fa-solid fa-palette'></i>
                    </Button>
                </div>
                <div className='btn-group'>
                    <Button onClick={zoomIn}>
                        <i className='fa-solid fa-magnifying-glass-plus'></i>
                    </Button>
                    <Button onClick={zoomOut}>
                        <i className='fa-solid fa-magnifying-glass-minus'></i>
                    </Button>
                    <Button onClick={resetView}>
                        <i className="fa-solid fa-arrows-to-dot"></i>
                    </Button>
                </div>
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