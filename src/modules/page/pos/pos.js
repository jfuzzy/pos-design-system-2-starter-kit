import { LightningElement } from 'lwc';
import {
    degreeOptions,
    loadProgramSelection,
    majorOptions,
    minorOptions,
    optionOptions,
    saveProgramSelection,
    thesisModeOptions
} from '../../../data/posProgramSelection';

export default class POS extends LightningElement {
    degreeOptions = degreeOptions;
    majorOptions = majorOptions;
    minorOptions = minorOptions;
    optionOptions = optionOptions;
    thesisModeOptions = thesisModeOptions;
    programSelection = {};

    connectedCallback() {
        this.programSelection = loadProgramSelection();
    }

    handleProgramSelectionChange(event) {
        const field = event.currentTarget.dataset.field;
        const value = event.detail.value ?? '';

        if (!Object.prototype.hasOwnProperty.call(this.programSelection, field)) {
            throw new Error(`Unknown program selection field: ${field}`);
        }

        this.programSelection = {
            ...this.programSelection,
            [field]: value
        };
        saveProgramSelection(this.programSelection);
    }

    get selectedDegree() {
        return this.programSelection.degree;
    }

    get selectedMajor() {
        return this.programSelection.major;
    }

    get selectedMinor1() {
        return this.programSelection.minor1;
    }

    get selectedMinor2() {
        return this.programSelection.minor2;
    }

    get selectedOption1() {
        return this.programSelection.option1;
    }

    get selectedOption2() {
        return this.programSelection.option2;
    }

    get selectedThesisMode() {
        return this.programSelection.thesisMode;
    }
}