import { useState, useEffect } from 'react';
import { IVisualizationSetting } from '../../../../ts/interfaces/visualization/IVisualizationSetting';
import useStore from '../../editorStore';
import VisualizationSetting from '../VisualizationSetting/VisualizationSetting';
import ToolPanel from '../../../../components/ToolPanel/ToolPanel';
import { VisualizationColorTypeEnum } from '../../../../ts/enums/VisualizationColorTypeEnum';
import { VisualizationTypeEnum } from '../../../../ts/enums/VisualizationTypeEnum';

type Props = {
    sidebarOpen: boolean;
    setSidebarOpen: (sidebarOpen: boolean) => void;
};

export default function VisualizationSidebar(props: Props) {
    const { sidebarOpen, setSidebarOpen } = props;

    const { visualizationSettings, setVisualizationSettings } = useStore();

    const [currentSettings, setCurrentSettings] = useState<
        IVisualizationSetting[]
    >([]);

    useEffect(() => {
        // Clone the visualization settings
        setCurrentSettings(JSON.parse(JSON.stringify(visualizationSettings)));
    }, [visualizationSettings]);

    function addSetting() {
        const newSettings = [...currentSettings];
        // Add a default setting
        newSettings.push({
            type: VisualizationTypeEnum.Poly,
            colorType: VisualizationColorTypeEnum.Color,
            color: '#000000',
            conditions: [],
        });
        setCurrentSettings(newSettings);
    }

    function closeMenu() {
        setCurrentSettings(visualizationSettings);
        setSidebarOpen(false);
    }

    function applySettings() {
        setVisualizationSettings(currentSettings);
    }

    const content = (
        <>
            {currentSettings.length === 0 && (
                <div className='panel-empty'>
                    <span>No visualizations yet. Add one to start drawing this world.</span>
                </div>
            )}
            {currentSettings.map(
                (_: IVisualizationSetting, index: number) => {
                    return (
                        <VisualizationSetting
                            key={index}
                            index={index}
                            settings={currentSettings}
                            setSettings={setCurrentSettings}
                        />
                    );
                }
            )}
        </>
    );

    const actions = (
        <div className='panel-actions'>
                <button type='button' className='ui-button add-visualization-btn' onClick={addSetting}>
                    <i className='fa-solid fa-plus' aria-hidden='true'></i>
                    Add visualization
                </button>
                <button type='button' className='ui-button apply-visualization-btn primary-btn' onClick={applySettings}>
                    Apply
                </button>
        </div>
    );

    return (
        <ToolPanel
            open={sidebarOpen}
            onClose={closeMenu}
            title='Visualization Settings'
            footer={actions}
        >
            {content}
        </ToolPanel>
    );
}
