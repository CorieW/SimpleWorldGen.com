import { useCallback, useEffect, useState } from 'react';
import { Button } from '@chakra-ui/react';
import Modal from '../../../../components/Modal/Modal';
import Dropzone from '../../../../components/Dropzone/Dropzone';
import useStore from '../../../../appStore';
import { ILayer } from '../../../../ts/interfaces/ILayer';
import { IWorldSettings } from '../../../../ts/interfaces/IWorldSettings';
import { IVisualizationSetting } from '../../../../ts/interfaces/visualization/IVisualizationSetting';
import useEditorStore from '../../editorStore';
import './SaveModal.scss';

const SAVE_NAME = 'world.json';

type Props = {
    modalOpen: boolean;
    setModalOpen: (modalOpen: boolean) => void;
};

type WorldSaveData = {
    worldSettings: IWorldSettings;
    layers: ILayer[];
    visualizationSettings: IVisualizationSetting[];
};

type WorldSaveFile = WorldSaveData & {
    name: string;
};

export default function SaveModal({ modalOpen, setModalOpen }: Props) {
    const { addNotification } = useStore();
    const {
        worldSettings,
        setWorldSettings,
        layers,
        setLayers,
        visualizationSettings,
        setVisualizationSettings,
    } = useEditorStore();
    const [worldSaveFile, setWorldSaveFile] = useState<WorldSaveFile | null>(null);

    const closeModal = useCallback(() => {
        setModalOpen(false);
        setWorldSaveFile(null);
    }, [setModalOpen]);

    const saveToDevice = useCallback(() => {
        const saveData: WorldSaveData = { worldSettings, layers, visualizationSettings };
        const blob = new Blob([JSON.stringify(saveData)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const downloadLink = document.createElement('a');

        downloadLink.href = url;
        downloadLink.download = SAVE_NAME;
        downloadLink.click();
        URL.revokeObjectURL(url);
        closeModal();
    }, [closeModal, layers, visualizationSettings, worldSettings]);

    useEffect(() => {
        function handleKeyDown(event: KeyboardEvent) {
            if (event.ctrlKey && event.key === 's') {
                event.preventDefault();
                saveToDevice();
            }
        }

        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [saveToDevice]);

    function loadFromDevice(file: File) {
        const reader = new FileReader();

        reader.onerror = (event) => console.error(event);
        reader.onload = (event) => {
            const fileContents = event.target?.result;
            if (typeof fileContents !== 'string') return;

            let parsedData: unknown;
            try {
                parsedData = JSON.parse(fileContents);
            } catch {
                notifyInvalidFile(file.name);
                return;
            }

            if (!isWorldSaveData(parsedData)) {
                notifyInvalidFile(file.name);
                return;
            }

            addNotification({
                type: 'success',
                text: `Loaded <b>${file.name}</b> successfully`,
            });
            setWorldSaveFile({ name: file.name, ...parsedData });
        };
        reader.readAsText(file);
    }

    function notifyInvalidFile(fileName: string) {
        addNotification({
            type: 'error',
            text: `File <b>${fileName}</b> is not a valid world save file`,
        });
    }

    function applyLoadedWorld() {
        if (!worldSaveFile) return;

        setWorldSettings(worldSaveFile.worldSettings);
        setLayers(worldSaveFile.layers);
        setVisualizationSettings(worldSaveFile.visualizationSettings);
        addNotification({
            type: 'success',
            text: `Applied <b>${worldSaveFile.name}</b> successfully`,
        });
        closeModal();
    }

    const content = (
        <div className='save-modal-content'>
            <div className='modal-heading'>
                <span className='modal-heading-icon'>
                    <i className='fa-solid fa-floppy-disk' aria-hidden='true'></i>
                </span>
                <div>
                    <h1>Save / Load</h1>
                    <p>Keep a local copy of your world configuration.</p>
                </div>
            </div>
            <Dropzone
                acceptedFileTypes={{ 'application/json': ['.json'] }}
                maxFiles={1}
                onDrop={(files) => {
                    if (files.length === 1) loadFromDevice(files[0]);
                }}
            />
            <Button
                className='modal-btn primary-btn'
                colorPalette='gray'
                disabled={!worldSaveFile}
                onClick={applyLoadedWorld}
            >
                Load {worldSaveFile?.name || 'unavailable'}
            </Button>
        </div>
    );

    const actions = (
        <div className='modal-actions'>
            <div>
                <Button className='modal-btn' colorPalette='gray' onClick={saveToDevice}>
                    <i className='fa-solid fa-download' aria-hidden='true'></i>
                    Save to device
                </Button>
            </div>
            <div>
                <Button className='modal-btn' colorPalette='gray' size='md' onClick={closeModal}>
                    Close
                </Button>
            </div>
        </div>
    );

    return (
        <Modal
            open={modalOpen}
            onClose={closeModal}
            footer={actions}
        >
            {content}
        </Modal>
    );
}

function isWorldSaveData(value: unknown): value is WorldSaveData {
    if (typeof value !== 'object' || value === null) return false;

    const candidate = value as Partial<WorldSaveData>;
    return (
        typeof candidate.worldSettings === 'object' &&
        candidate.worldSettings !== null &&
        Array.isArray(candidate.layers) &&
        Array.isArray(candidate.visualizationSettings)
    );
}
