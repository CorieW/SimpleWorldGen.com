import { useState, useEffect } from 'react';
import './VisualizationSidebar.scss';
import { Button } from '@chakra-ui/react';
import { IVisualizationSetting } from '../../../../ts/interfaces/visualization/IVisualizationSetting';
import useStore from '../../editorStore';
import VisualizationSetting from '../VisualizationSetting/VisualizationSetting';
import Sidebar from '../../../../components/Basic/Sidebar/Sidebar';
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

    const contentJSX = (
        <>
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

    const bottomBarContentJSX = (
        <>
            <div>
                <Button id='add-visualization-btn' onClick={addSetting}>
                    Add
                </Button>
            </div>
            <div>
                <Button id='apply-visualization-btn' onClick={applySettings}>
                    Apply
                </Button>
            </div>
        </>
    );

    return (
        <Sidebar
            open={sidebarOpen}
            setOpen={setSidebarOpen}
            onClose={closeMenu}
            title='Visualization Settings'
            contentJSX={contentJSX}
            bottomBarContentJSX={bottomBarContentJSX}
        />
    );
}
