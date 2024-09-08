import { useEffect, useState } from 'react'
import Modal from '../../../../components/Modal/Modal'
import { Button } from '@chakra-ui/react'
import useStore from '../../../../appStore'
import useEditorStore from '../../editorStore'
import Dropzone from '../../../../components/Dropzone/Dropzone'
import { IWorldSettings } from '../../../../ts/interfaces/IWorldSettings'
import { ILayer } from '../../../../ts/interfaces/ILayer'
import { IVisualizationSetting } from '../../../../ts/interfaces/visualization/IVisualizationSetting'
// import {
//     FileUploadDropzone,
//     FileUploadList,
//     FileUploadRoot,
//   } from "@/components/ui/file-button"

type Props = {
    modalOpen: boolean
    setModalOpen: (modalOpen: boolean) => void
}

interface WorldSaveFile {
    name: string
    worldSettings: IWorldSettings
    layers: ILayer[]
    visualizationSettings: IVisualizationSetting[]
}

export default function SaveModal(props: Props) {
    const SAVE_NAME = 'world.json'

    const { modalOpen, setModalOpen } = props

    const {
        addNotification
    } = useStore()

    const {
        worldSettings,
        setWorldSettings,
        layers,
        setLayers,
        visualizationSettings,
        setVisualizationSettings,
    } = useEditorStore()

    const [worldSaveFile, setWorldSaveFile] = useState<WorldSaveFile | null>(null)

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
        setModalOpen(false)
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
                        text: 'Invalid JSON file'
                    })
                    return
                }

                addNotification({
                    type: 'success',
                    text: 'File loaded successfully'
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

    return (
        <div>
            <Modal
                modalOpen={modalOpen}
                setModalOpen={(modalOpen: boolean) => {
                    setModalOpen(modalOpen)
                    if (!modalOpen) {
                        setWorldSaveFile(null)
                    }
                }}
                contentJSX={contentJSX}
                bottomBarJSX={bottomBarJSX}
            />
        </div>
  )
}