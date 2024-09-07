import { useEffect, useState } from 'react'
import Modal from '../../../../components/Modal/Modal'
import { Button } from '@chakra-ui/react'
import useStore from '../../editorStore'
import Dropzone from '../../../../components/Dropzone/Dropzone'
// import {
//     FileUploadDropzone,
//     FileUploadList,
//     FileUploadRoot,
//   } from "@/components/ui/file-button"

type Props = {
    modalOpen: boolean
    setModalOpen: (modalOpen: boolean) => void
}

export default function SaveModal(props: Props) {
    const SAVE_NAME = 'world.json'

    const { modalOpen, setModalOpen } = props

    const {
        worldSettings,
        setWorldSettings,
        layers,
        setLayers,
        visualizationSettings,
        setVisualizationSettings,
    } = useStore()

    const [file, setFile] = useState<any>(null)

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
        setFile(null)
    }

    function convertToJSONString(worldSettings: any, layers: any, visualizationSettings: any) {
        const json = {
            worldSettings,
            layers,
            visualizationSettings
        }
        return JSON.stringify(json)
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
                setWorldSettings(json.worldSettings)
                setLayers(json.layers)
                setVisualizationSettings(json.visualizationSettings)
                closeModal()
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
                    setFile(files[0])
                }}
            />
            <Button
                className='modal-btn'
                onClick={ () => {
                    // Load uploaded
                    loadFromDevice(file)
                } }
                colorScheme='gray'
                isDisabled={file === null}
            >
                Load {file ? file.name : 'unavailable'}
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
                        setFile(null)
                    }
                }}
                contentJSX={contentJSX}
                bottomBarJSX={bottomBarJSX}
            />
        </div>
  )
}