import { useEffect, useState } from 'react';
import Layers from '../Layers/Layers';
import NodeEditorModal from '../NodeEditorForm/NodeEditorModal';
import VisualizationSidebar from '../VisualizationSidebar/VisualizationSidebar';
import SettingsSidebar from '../SettingsSidebar/SettingsSidebar';
import NodesModal from '../NodesModal/NodesModal';
import SaveModal from '../SaveModal/SaveModal';
import IconButton from '../../../../components/IconButton/IconButton';
import useStore from '../../editorStore';
import './EditorOverlay.scss';

type Props = { zoomIn: () => void; zoomOut: () => void; resetView: () => void };
type Tool = 'save' | 'settings' | 'visualization';

export default function EditorOverlay({ zoomIn, zoomOut, resetView }: Props) {
    const [activeTool, setActiveTool] = useState<Tool | null>(null);
    const { activeFormLayerId, activeFormNodeId, setActiveFormLayerId, setActiveFormNodeId } = useStore();

    useEffect(() => {
        if (activeFormLayerId !== -1 || activeFormNodeId !== -1) setActiveTool(null);
    }, [activeFormLayerId, activeFormNodeId]);

    function toggleTool(tool: Tool) {
        setActiveFormLayerId(-1);
        setActiveFormNodeId(-1);
        setActiveTool((current) => current === tool ? null : tool);
    }

    const menuTools: { tool: Tool; icon: string; label: string }[] = [
        { tool: 'save', icon: 'fa-save', label: 'Save or load world' },
        { tool: 'settings', icon: 'fa-cog', label: 'Open world settings' },
        { tool: 'visualization', icon: 'fa-palette', label: 'Open visualization settings' },
    ];
    const viewTools = [
        { icon: 'fa-magnifying-glass-plus', label: 'Zoom in', action: zoomIn },
        { icon: 'fa-magnifying-glass-minus', label: 'Zoom out', action: zoomOut },
        { icon: 'fa-arrows-to-dot', label: 'Reset view', action: resetView },
    ];

    return (
        <div id='editor-overlay'>
            <div id='unsupported-resolution-cover'><span>Unsupported Resolution</span></div>
            <Layers />
            <div id='editor-overlay-btns'>
                <div className='btn-group menu-btns'>
                    {menuTools.map(({ tool, icon, label }) => (
                        <IconButton
                            key={tool}
                            icon={icon}
                            label={label}
                            className={`tool-btn ${activeTool === tool ? 'active' : ''}`}
                            aria-pressed={activeTool === tool}
                            onClick={() => toggleTool(tool)}
                        />
                    ))}
                </div>
                <div className='btn-group zoom-btns'>
                    {viewTools.map(({ icon, label, action }) => (
                        <IconButton key={label} icon={icon} label={label} className='tool-btn' onClick={action} />
                    ))}
                </div>
            </div>

            <SaveModal modalOpen={activeTool === 'save'} setModalOpen={(open) => setActiveTool(open ? 'save' : null)} />
            <SettingsSidebar sidebarOpen={activeTool === 'settings'} setSidebarOpen={(open) => setActiveTool(open ? 'settings' : null)} />
            <VisualizationSidebar sidebarOpen={activeTool === 'visualization'} setSidebarOpen={(open) => setActiveTool(open ? 'visualization' : null)} />
            <NodesModal />
            <NodeEditorModal />
        </div>
    );
}
