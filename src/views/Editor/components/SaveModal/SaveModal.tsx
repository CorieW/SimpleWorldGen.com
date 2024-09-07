import { useEffect } from 'react'
import Modal from '../../../../components/Modal/Modal'
import { Button } from '@chakra-ui/react'
import useStore from '../../editorStore'
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

    function convertToJSONString(worldSettings: any, layers: any, visualizationSettings: any) {
        const json = {
            worldSettings,
            layers,
            visualizationSettings
        }
        return JSON.stringify(json)
    }

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
        setModalOpen(false)
    }

    function loadFromDevice(e: any) {
        const file = e.target.files?.[0]
        if (file) {
            const reader = new FileReader()
            reader.onload = (e) => {
                const jsonStr = e.target?.result as string
                const json = JSON.parse(jsonStr)
                setWorldSettings(json.worldSettings)
                setLayers(json.layers)
                setVisualizationSettings(json.visualizationSettings)
                setModalOpen(false)
            }
            reader.readAsText(file)
        }
    }

    const contentJSX = (
        <div className='w-full'>
            <h1 className='text-2xl font-bold text-center'>Save / Load</h1>
            {/* <FileUploadRoot maxW="xl" alignItems="stretch" maxFiles={10}>
                <FileUploadDropzone />
                <FileUploadList />
            </FileUploadRoot> */}
            <input
                type='file'
                accept='.json'
                onChange={ (e) => {
                    loadFromDevice(e)
                } }
            />
        </div>
    )

    const bottomBarJSX = (
        <div className='flex justify-between w-full'>
            <div>
                <Button
                    className='modal-btn'
                    onClick={ () => {
                        // Save to device
                        saveToDevice()
                    } }
                    colorScheme='green'
                >
                    Save to Device
                </Button>
            </div>
            <div>
                <Button
                    colorScheme='gray'
                    size='md'
                    onClick={() => setModalOpen(false)}
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
                setModalOpen={setModalOpen}
                contentJSX={contentJSX}
                bottomBarJSX={bottomBarJSX}
            />
        </div>
  )
}