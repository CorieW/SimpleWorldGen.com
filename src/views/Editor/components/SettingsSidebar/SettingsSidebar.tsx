import { useEffect, useState } from 'react';
import ToolPanel from '../../../../components/ToolPanel/ToolPanel';
import Input from '../../../../components/Input/Input';
import ColorField from '../../../../components/Input/ColorField';
import { IWorldSettings } from '../../../../ts/interfaces/IWorldSettings';
import useStore from '../../editorStore';
import './SettingsSidebar.scss';

type Props = {
    sidebarOpen: boolean;
    setSidebarOpen: (sidebarOpen: boolean) => void;
};

export default function SettingsSidebar({ sidebarOpen, setSidebarOpen }: Props) {
    const { worldSettings, setWorldSettings, randomizeSeeds } = useStore();
    const [currentSettings, setCurrentSettings] = useState<IWorldSettings>({ ...worldSettings });

    const {
        worldWidth,
        fadeOff,
        xFadeOffPercentage,
        yFadeOffPercentage,
        backgroundColor,
    } = currentSettings;

    useEffect(() => {
        setCurrentSettings({ ...worldSettings });
    }, [worldSettings]);

    function updateCurrentSettings(settings: Partial<IWorldSettings>) {
        setCurrentSettings((current) => ({ ...current, ...settings }));
    }

    function updateWorldSize(size: number) {
        // World generation currently requires equal dimensions.
        updateCurrentSettings({ worldWidth: size, worldHeight: size });
    }

    function closeMenu() {
        setCurrentSettings({ ...worldSettings });
        setSidebarOpen(false);
    }

    const content = (
        <>
            <section className='settings-section'>
                <h3>
                    <i className='fa-solid fa-expand' aria-hidden='true'></i>
                    World dimensions
                </h3>
                <Input label='World size' type='number' value={worldWidth} step={100} onChange={updateWorldSize} />
            </section>

            <section className='settings-section'>
                <h3>
                    <i className='fa-solid fa-fill-drip' aria-hidden='true'></i>
                    World appearance
                </h3>
                <ColorField
                    label='Background color'
                    color={backgroundColor}
                    onChange={(color) => updateCurrentSettings({ backgroundColor: color })}
                />
            </section>

            <section className='settings-section'>
                <label className='toggle-field' htmlFor='fade-off-toggle'>
                    <span>
                        <strong>Fade off</strong>
                        <small>Blend the world edges into the background</small>
                    </span>
                    <input
                        id='fade-off-toggle'
                        type='checkbox'
                        checked={fadeOff}
                        onChange={(event) => updateCurrentSettings({ fadeOff: event.target.checked })}
                    />
                    <span className='toggle-track' aria-hidden='true'><span></span></span>
                </label>
                {fadeOff && (
                    <div className='form-row'>
                        <Input
                            label='X'
                            type='number'
                            value={xFadeOffPercentage}
                            step={0.05}
                            min={0}
                            max={1}
                            onChange={(value) => updateCurrentSettings({ xFadeOffPercentage: value })}
                        />
                        <Input
                            label='Y'
                            type='number'
                            value={yFadeOffPercentage}
                            step={0.05}
                            min={0}
                            max={1}
                            onChange={(value) => updateCurrentSettings({ yFadeOffPercentage: value })}
                        />
                    </div>
                )}
            </section>

            <section className='settings-section'>
                <h3>
                    <i className='fa-solid fa-wand-magic-sparkles' aria-hidden='true'></i>
                    Generation
                </h3>
                <button type='button' className='ui-button wide-btn' onClick={randomizeSeeds}>
                    <i className='fa-solid fa-dice' aria-hidden='true'></i>
                    Randomize seeds
                </button>
            </section>
        </>
    );

    const actions = (
        <div className='panel-actions'>
            <button type='button' className='ui-button apply-settings-btn primary-btn' onClick={() => setWorldSettings(currentSettings)}>
                Apply
            </button>
        </div>
    );

    return (
        <ToolPanel
            open={sidebarOpen}
            onClose={closeMenu}
            title='World settings'
            footer={actions}
        >
            {content}
        </ToolPanel>
    );
}
