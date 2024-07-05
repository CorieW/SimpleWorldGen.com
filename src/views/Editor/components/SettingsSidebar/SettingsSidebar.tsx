import { useEffect, useState } from 'react';
import Sidebar from '../../../../components/Sidebar/Sidebar';
import {
    Text,
    Button,
    Stack,
    FormControl,
    FormLabel,
    Switch,
    NumberInput,
    NumberInputField,
    NumberInputStepper,
    NumberIncrementStepper,
    NumberDecrementStepper,
} from '@chakra-ui/react';
import useStore from '../../editorStore';
import { IWorldSettings } from '../../../../ts/interfaces/IWorldSettings';

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
        console.log('Applying settings');
        setWorldSettings(currentSettings);
    }

    function closeMenu() {
        setCurrentSettings(worldSettings);
        setSidebarOpen(false);
    }

    const fadeOffOptionsJSX = (
        <>
            <NumberInput
                value={xFadeOffPercentage}
                precision={2}
                step={0.05}
                min={0}
                max={1}
                onChange={(valueString) =>
                    setCurrentSettings({
                        ...currentSettings,
                        xFadeOffPercentage: parseFloat(valueString),
                    })
                }
            >
                <NumberInputField placeholder='Fade Off Percentage' />
                <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                </NumberInputStepper>
            </NumberInput>
            <NumberInput
                value={yFadeOffPercentage}
                precision={2}
                step={0.05}
                min={0}
                max={1}
                onChange={(valueString) =>
                    setCurrentSettings({
                        ...currentSettings,
                        yFadeOffPercentage: parseFloat(valueString),
                    })
                }
            >
                <NumberInputField placeholder='Fade Off Percentage' />
                <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                </NumberInputStepper>
            </NumberInput>
        </>
    );

    const contentJSX = (
        <>
            <Stack spacing={1}>
                <Text fontSize={'lg'} fontWeight={600}>
                    World Dimensions
                </Text>
                <NumberInput
                    value={worldWidth}
                    step={100}
                    onChange={(val) =>
                        setCurrentSettings({
                            ...currentSettings,
                            worldWidth: val
                        })
                    }
                >
                    <NumberInputField placeholder='Width'/>
                    <NumberInputStepper>
                        <NumberIncrementStepper />
                        <NumberDecrementStepper />
                    </NumberInputStepper>
                </NumberInput>
                <NumberInput
                    value={worldHeight}
                    step={100}
                    onChange={(val) =>
                        setCurrentSettings({
                            ...currentSettings,
                            worldHeight: val
                        })
                    }
                >
                    <NumberInputField placeholder='Height'/>
                    <NumberInputStepper>
                        <NumberIncrementStepper />
                        <NumberDecrementStepper />
                    </NumberInputStepper>
                </NumberInput>
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
