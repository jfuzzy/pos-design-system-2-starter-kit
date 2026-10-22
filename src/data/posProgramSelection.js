import programConfig from './posProgramConfig.json';

const selectionStorageKey = 'pos-program-selection';
const selectionFields = Object.keys(programConfig.defaultSelection);

export const degreeOptions = programConfig.degrees.map(({ id, label }) => ({
    label,
    value: id
}));
export const majorOptions = programConfig.majors.map(({ id, label }) => ({
    label,
    value: id
}));
export const minorOptions = programConfig.minors.map(({ id, label }) => ({
    label,
    value: id
}));
export const optionOptions = programConfig.options.map(({ id, label }) => ({
    label,
    value: id
}));
export const thesisModeOptions = programConfig.thesisModes;

export function loadProgramSelection() {
    const storedSelection = window.localStorage.getItem(selectionStorageKey);
    if (!storedSelection) {
        return { ...programConfig.defaultSelection };
    }

    const parsedSelection = JSON.parse(storedSelection);
    if (
        !parsedSelection ||
        typeof parsedSelection !== 'object' ||
        Array.isArray(parsedSelection) ||
        selectionFields.some(field => typeof parsedSelection[field] !== 'string')
    ) {
        throw new Error('Stored program selection is invalid.');
    }

    return parsedSelection;
}

export function saveProgramSelection(selection) {
    window.localStorage.setItem(selectionStorageKey, JSON.stringify(selection));
}

function getEntryRequirements(entries, id, degreeId, fallback) {
    if (!id) {
        return fallback;
    }

    const entry = entries.find(item => item.id === id);
    if (!entry) {
        throw new Error(`Unknown program selection: ${id}`);
    }

    return entry.requirements[degreeId] ?? fallback;
}

function sumSelectionRequirements(entries, ids, degreeId, fallback) {
    const selectedIds = ids.filter(Boolean);
    if (selectedIds.length === 0) {
        return fallback;
    }

    return selectedIds.reduce(
        (total, id) => total + getEntryRequirements(entries, id, degreeId, fallback),
        0
    );
}

export function getProgramRequirements(selection) {
    const degree = programConfig.degrees.find(item => item.id === selection.degree);
    if (!degree) {
        throw new Error(`Unknown degree selection: ${selection.degree}`);
    }

    const defaults = degree.requirements;
    const requirements = {
        major: getEntryRequirements(programConfig.majors, selection.major, degree.id, defaults.major),
        minor: sumSelectionRequirements(
            programConfig.minors,
            [selection.minor1, selection.minor2],
            degree.id,
            defaults.minor
        ),
        option: sumSelectionRequirements(
            programConfig.options,
            [selection.option1, selection.option2],
            degree.id,
            defaults.option
        ),
        thesis: defaults[selection.thesisMode]
    };

    if (typeof requirements.thesis !== 'number') {
        throw new Error(`Unknown thesis mode selection: ${selection.thesisMode}`);
    }

    requirements.total = Object.values(requirements).reduce((total, credits) => total + credits, 0);
    return requirements;
}
