import { useEffect, useState, forwardRef, useImperativeHandle } from 'react'
import { Button } from '@chakra-ui/react'
import useAppStore from '../../../../../ts/appStore'
import useEditorStore from '../../../editorStore'
import Dropzone from '../../../../Basic/Dropzone/Dropzone'
import { IWorldSettings } from '../../../../../ts/interfaces/generation/IWorldSettings'
import { ILayer } from '../../../../../ts/interfaces/generation/ILayer'
import { IVisualizationSetting } from '../../../../../ts/interfaces/visualization/IVisualizationSetting'

type Props = {}

interface WorldSaveFile {
    name: string
    worldSettings: IWorldSettings
    layers: ILayer[]
    visualizationSettings: IVisualizationSetting[]
}

const SaveModal = forwardRef((_: Props, ref) => {
    const SAVE_NAME = 'world.json'

    const {
        openModal,
        closeTopModal,
        addNotification
    } = useAppStore()

    const {
        worldSettings,
        setWorldSettings,
        layers,
        setLayers,
        visualizationSettings,
        setVisualizationSettings,
    } = useEditorStore()

    const [worldSaveFile, setWorldSaveFile] = useState<WorldSaveFile | null>(null)

    useImperativeHandle(ref, () => ({
        openModal(): void {
            openModal({
                contentJSX: contentJSX,
                bottomBarJSX: bottomBarJSX,
                height: 'lg',
                useExactHeight: true,
            })
        },
    }));

    useEffect(() => {
        // On CTRL + S, save to device
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.ctrlKey && e.key === 's') {
                e.preventDefault()
                saveToDevice()
            }
        }

        document.addEventListener('keydown', handleKeyDown)
        return () => {
            document.removeEventListener('keydown', handleKeyDown)
        }
    }, [worldSettings, layers, visualizationSettings])

    /**
     * Close the modal and reset the file state
     */
    function closeModal() {
        closeTopModal()
        setWorldSaveFile(null)
    }

    function convertToJSONString(worldSettings: any, layers: any, visualizationSettings: any) {
        const json = {
            worldSettings,
            layers,
            visualizationSettings
        }
        return JSON.stringify(json)
    }

    function validateJSON(json: any) {
        if (!json.hasOwnProperty('worldSettings')) {
            return false
        }
        if (!json.hasOwnProperty('layers')) {
            return false
        }
        if (!json.hasOwnProperty('visualizationSettings')) {
            return false
        }
        return true
    }

    /**
     * Save the world settings, layers, and visualization settings to the device
     * as a JSON file
     */
    function saveToDevice() {
        // Save to device
        const jsonStr = convertToJSONString(worldSettings, layers, visualizationSettings)
        const blob = new Blob([jsonStr], { type: 'application/json' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = SAVE_NAME
        a.click()
        URL.revokeObjectURL(url)
        closeModal()
    }

    /**
     * Load the file from the device
     * Update the world settings, layers, and visualization settings
     * @param file The file to load
     */
    function loadFromDevice(file: any) {
        if (file) {
            const reader = new FileReader()

            reader.onabort = () => {
                console.error('file reading was aborted')
            }
            reader.onerror = (e) => {
                console.error(e)
            }
            reader.onload = (e) => {
                const jsonStr = e.target?.result as string
                const json = JSON.parse(jsonStr)

                if (!validateJSON(json)) {
                    addNotification({
                        type: 'error',
                        text: `File <b>${file.name}</b> is not a valid world save file`
                    })
                    return
                }

                addNotification({
                    type: 'success',
                    text: `File <b>${file.name}</b> loaded successfully`
                })

                setWorldSaveFile({ name: file.name, ...json })
            }
            reader.readAsText(file)
        }
    }

    const contentJSX = (
        <div className='flex flex-col w-full h-full gap-3'>
            <h1 className='text-2xl font-bold text-center'>Save / Load</h1>
            <Dropzone
                acceptedFileTypes={{
                    'application/json': ['.json']
                }}
                maxFiles={1}
                onDrop={(files) => {
                    if (files.length === 1) {
                        // Load the file
                        loadFromDevice(files[0])
                    }
                }}
            />
            <Button
                className='modal-btn'
                onClick={ () => {
                    // Apply the world settings, layers, and visualization settings
                    setWorldSettings(worldSaveFile?.worldSettings)
                    setLayers(worldSaveFile?.layers)
                    setVisualizationSettings(worldSaveFile?.visualizationSettings)

                    addNotification({
                        type: 'success',
                        text: 'Applied loaded file'
                    })

                    closeModal()
                } }
                colorScheme='gray'
                isDisabled={worldSaveFile === null}
            >
                Load {worldSaveFile ? worldSaveFile.name : 'unavailable'}
            </Button>
        </div>
    )

    const bottomBarJSX = (
        <div className='flex justify-between w-full'>
            <div className='flex gap-1'>
                <Button
                    className='modal-btn'
                    onClick={ () => {
                        // Save to device
                        saveToDevice()
                    } }
                    colorScheme='gray'
                >
                    Save to Device
                </Button>
            </div>
            <div>
                <Button
                    colorScheme='gray'
                    size='md'
                    onClick={() => closeModal()}
                >
                    Close
                </Button>
            </div>
        </div>
    )

    return <></>
})

export default SaveModal;