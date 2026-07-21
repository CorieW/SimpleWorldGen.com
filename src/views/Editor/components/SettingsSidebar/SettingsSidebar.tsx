import { useEffect, useState } from 'react';
import { Button } from '@chakra-ui/react';
import Sidebar from '../../../../components/Sidebar/Sidebar';
import Input from '../../../../components/Input/Input';
import ColorPicker from '../../../../components/ColorPicker/ColorPicker';
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
        worldHeight,
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
                <Input label='Width' type='number' value={worldWidth} step={100} onChange={updateWorldSize} />
                <Input label='Height' type='number' value={worldHeight} step={100} onChange={updateWorldSize} />
            </section>

            <section className='settings-section'>
                <h3>
                    <i className='fa-solid fa-fill-drip' aria-hidden='true'></i>
                    World appearance
                </h3>
                <div className='form-row color-field-row'>
                    <ColorPicker
                        color={backgroundColor}
                        setColor={(color) => updateCurrentSettings({ backgroundColor: color })}
                    />
                    <Input
                        className='color-input'
                        value={backgroundColor}
                        placeholder='Hex Color'
                        onChange={(value) => updateCurrentSettings({ backgroundColor: value })}
                    />
                </div>
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
                <Button className='wide-btn' onClick={randomizeSeeds}>
                    <i className='fa-solid fa-dice' aria-hidden='true'></i>
                    Randomize seeds
                </Button>
            </section>
        </>
    );

    const actions = (
        <div>
            <Button className='apply-settings-btn primary-btn' onClick={() => setWorldSettings(currentSettings)}>
                Apply
            </Button>
        </div>
    );

    return (
        <Sidebar
            open={sidebarOpen}
            onClose={closeMenu}
            title='Settings'
            footer={actions}
        >
            {content}
        </Sidebar>
    );
}
