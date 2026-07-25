import { useCallback, useEffect, useState } from 'react';
import ToolPanel from '../../../../components/ToolPanel/ToolPanel';
import useAppStore from '../../../../appStore';
import { parseWorldSaveData, type WorldSaveData } from '../../../../ts/utils/worldSaveData';
import useEditorStore from '../../editorStore';
import './SaveModal.scss';

const SAVE_NAME = 'world.json';

type Props = { modalOpen: boolean; setModalOpen: (open: boolean) => void };
type WorldSaveFile = WorldSaveData & { name: string };

export default function SaveModal({ modalOpen, setModalOpen }: Props) {
    const { addNotification } = useAppStore();
    const editor = useEditorStore();
    const [worldSaveFile, setWorldSaveFile] = useState<WorldSaveFile | null>(null);

    const closePanel = useCallback(() => {
        setModalOpen(false);
        setWorldSaveFile(null);
    }, [setModalOpen]);

    const saveToDevice = useCallback(() => {
        const data: WorldSaveData = {
            worldSettings: editor.worldSettings,
            layers: editor.layers,
            visualizationSettings: editor.visualizationSettings,
        };
        const url = URL.createObjectURL(new Blob([JSON.stringify(data)], { type: 'application/json' }));
        const link = Object.assign(document.createElement('a'), { href: url, download: SAVE_NAME });
        link.click();
        URL.revokeObjectURL(url);
        closePanel();
    }, [closePanel, editor.layers, editor.visualizationSettings, editor.worldSettings]);

    useEffect(() => {
        const saveOnShortcut = (event: KeyboardEvent) => {
            if (event.ctrlKey && event.key === 's') {
                event.preventDefault();
                saveToDevice();
            }
        };
        document.addEventListener('keydown', saveOnShortcut);
        return () => document.removeEventListener('keydown', saveOnShortcut);
    }, [saveToDevice]);

    function loadFile(file: File) {
        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const data = parseWorldSaveData(JSON.parse(String(event.target?.result)));
                setWorldSaveFile({ name: file.name, ...data });
                addNotification({ type: 'success', text: `Loaded <b>${file.name}</b> successfully` });
            } catch {
                addNotification({ type: 'error', text: `File <b>${file.name}</b> is not a valid world save file` });
            }
        };
        reader.readAsText(file);
    }

    function applyLoadedWorld() {
        if (!worldSaveFile) return;
        editor.setWorldSettings(worldSaveFile.worldSettings);
        editor.setLayers(worldSaveFile.layers);
        editor.setVisualizationSettings(worldSaveFile.visualizationSettings);
        addNotification({ type: 'success', text: `Applied <b>${worldSaveFile.name}</b> successfully` });
        closePanel();
    }

    const footer = (
        <div className='panel-actions'>
            <button type='button' className='ui-button' onClick={saveToDevice}>
                <i className='fa-solid fa-download' aria-hidden='true'></i> Save world
            </button>
            <button type='button' className='ui-button primary-btn' disabled={!worldSaveFile} onClick={applyLoadedWorld}>
                Load world
            </button>
        </div>
    );

    return (
        <ToolPanel open={modalOpen} onClose={closePanel} title='Save / Load' eyebrow='World file' footer={footer}>
            <p className='panel-intro'>Download this world or choose a saved JSON file to replace it.</p>
            <label className='file-picker'>
                <input
                    type='file'
                    accept='.json,application/json'
                    onChange={(event) => event.target.files?.[0] && loadFile(event.target.files[0])}
                />
                <i className='fa-solid fa-file-arrow-up' aria-hidden='true'></i>
                <strong>{worldSaveFile?.name || 'Choose world file'}</strong>
                <span>JSON files only</span>
            </label>
        </ToolPanel>
    );
}
