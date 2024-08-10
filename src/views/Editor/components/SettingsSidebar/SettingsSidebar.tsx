import { useEffect, useState } from 'react';
import Sidebar from '../../../../components/Sidebar/Sidebar';
import {
    Text,
    Button,
    Stack,
    FormControl,
    FormLabel,
    Switch,
    HStack,
} from '@chakra-ui/react';
import Input from '../../../../components/Input/Input';
import useStore from '../../editorStore';
import ColorPicker from '../../../../components/ColorPicker/ColorPicker';

type Props = {
    sidebarOpen: boolean;
    setSidebarOpen: (sidebarOpen: boolean) => void;
};

export default function SettingsSidebar(props: Props) {
    const { sidebarOpen, setSidebarOpen } = props;

    const { worldSettings, setWorldSettings, randomizeSeeds } = useStore();

    const [currentSettings, setCurrentSettings] =
        useState<any>(worldSettings);

    const { worldWidth, worldHeight, fadeOff, xFadeOffPercentage, yFadeOffPercentage } =
        currentSettings;

    useEffect(() => {
        // Clone the world settings
        setCurrentSettings(JSON.parse(JSON.stringify(worldSettings)));
    }, [worldSettings]);

    function apply() {
        setWorldSettings(currentSettings);
    }

    function closeMenu() {
        setCurrentSettings(worldSettings);
        setSidebarOpen(false);
    }

    const fadeOffOptionsJSX = (
        <HStack>
            <Input
                label='X'
                type='number'
                value={xFadeOffPercentage}
                step={0.05}
                min={0}
                max={1}
                onChange={(valueString: any) =>
                    setCurrentSettings({
                        ...currentSettings,
                        xFadeOffPercentage: parseFloat(valueString),
                    })
                }
            />
            <Input
                label='Y'
                type='number'
                value={yFadeOffPercentage}
                step={0.05}
                min={0}
                max={1}
                onChange={(valueString: any) =>
                    setCurrentSettings({
                        ...currentSettings,
                        yFadeOffPercentage: parseFloat(valueString),
                    })
                }
            />
        </HStack>
    );

    const contentJSX = (
        <>
            <Stack spacing={1}>
                <Text fontSize={'lg'} fontWeight={600}>
                    World Dimensions
                </Text>
                <Input
                    label='Width'
                    type='number'
                    value={worldWidth}
                    step={100}
                    onChange={(valueString: any) =>
                        setCurrentSettings({
                            ...currentSettings,
                            worldWidth: parseFloat(valueString),
                            worldHeight: parseFloat(valueString) // TODO: Remove this line when world supports different width and height
                        })
                    }
                />
                <Input
                    label='Height'
                    type='number'
                    value={worldHeight}
                    step={100}
                    onChange={(valueString: any) =>
                        setCurrentSettings({
                            ...currentSettings,
                            worldHeight: parseFloat(valueString),
                            worldWidth: parseFloat(valueString) // TODO: Remove this line when world supports different width and height
                        })
                    }
                />
            </Stack>
            <Stack spacing={1}>
                <Text fontSize={'lg'} fontWeight={600}>
                    General
                </Text>
                <HStack>
                <ColorPicker color={currentSettings.backgroundColor} setColor={(color) => setCurrentSettings({...currentSettings, backgroundColor: color})} />
                    <Input
                        className='color-input'
                        value={currentSettings.backgroundColor}
                        placeholder='Hex Color'
                        onChange={(e: any) =>
                            setCurrentSettings({
                                ...currentSettings,
                                backgroundColor: e.target.value,
                            })
                        }
                    />
                </HStack>
            </Stack>
            <Stack spacing={1}>
                <FormControl
                    display='flex'
                    alignItems='center'
                    justifyContent={'space-between'}
                >
                    <FormLabel
                        htmlFor='fade-off-toggle'
                        fontSize={'lg'}
                        fontWeight={600}
                        m={0}
                        flex={1}
                    >
                        Fade Off
                    </FormLabel>
                    <Switch
                        id='fade-off-toggle'
                        size='md'
                        isChecked={fadeOff}
                        onChange={(e) =>
                            setCurrentSettings({
                                ...currentSettings,
                                fadeOff: e.target.checked,
                            })
                        }
                    />
                </FormControl>
                {fadeOff && fadeOffOptionsJSX}
            </Stack>
            {
                // TODO: Add fade off option
            }
            <Stack>
                <Text fontSize={'lg'} fontWeight={600}>
                    Actions
                </Text>
                <Button onClick={randomizeSeeds}>
                    Randomize Seeds
                </Button>
            </Stack>
        </>
    );

    const bottomBarContentJSX = (
        <>
            <div>
                <Button id='apply-visualization-btn' onClick={apply}>
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
            title='Settings'
            contentJSX={contentJSX}
            bottomBarContentJSX={bottomBarContentJSX}
        />
    );
}
