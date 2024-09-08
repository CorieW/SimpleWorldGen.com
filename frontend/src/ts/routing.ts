const HOME_ROOT = '/';
const EDITOR_ROOT = '/editor';
const WORLDS_ROOT = '/worlds';
const SETTINGS_ROOT = '/settings';

function getEditorPath(id: string): string {
    return `${EDITOR_ROOT}?id=${id}`;
}

export default {
    HOME_ROOT,
    EDITOR_ROOT,
    WORLDS_ROOT,
    SETTINGS_ROOT,
    getEditorPath
}