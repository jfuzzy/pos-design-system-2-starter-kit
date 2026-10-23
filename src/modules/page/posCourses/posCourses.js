import { LightningElement } from 'lwc';
import alerts from '../../../data/posCourseAlerts.json';
import {
    getProgramRequirements,
    loadProgramSelection
} from '../../../data/posProgramSelection';

const categoryOptions = [
    { label: 'Major Courses', value: 'major' },
    { label: 'Option Courses', value: 'option' },
    { label: 'Minor Courses', value: 'minor' },
    { label: 'Thesis (Capstone) Courses', value: 'thesis' }
];

const baseColumns = [
    {
        label: 'Section',
        fieldName: 'placement',
        type: 'coursePlacement',
        initialWidth: 300,
        typeAttributes: {
            value: { fieldName: 'placement' },
            rowId: { fieldName: 'id' },
            options: categoryOptions,
            variant: 'bare'
        }
    },
    { label: 'Course Title', fieldName: 'title'},
    { label: 'Course ID', fieldName: 'cid' },
    { label: 'Grade', fieldName: 'grade', initialWidth: 100 },
    { label: 'Credits', fieldName: 'credits', initialWidth: 100 }
];

const planColumns = [
    ...baseColumns,
    {
        label: '',
        fieldName: 'remove',
        type: 'button-icon',
        initialWidth: 50,
        typeAttributes: {
            iconName: { fieldName: 'remove' },
            alternativeText: 'Remove course',
            title: 'Remove course',
            name: 'remove',
            variant: 'bare',
            iconClass: 'slds-button__icon_large slds-icon-text-error'
        }
    }
];

const transcriptCourseData = [
    { id: '1', title: 'CROSS CULTURAL MANAGEMENT HAS A VERY LONG TITLE SO THAT IT EXTENDS BEYOND THE DEFAULT COLUMN WIDTH', cid: 'MGMT-546', grade: 'A+', credits: '3' },
    { id: '2', title: 'ADVANCED INFORMATION SYSTEMS', cid: 'BA-572', grade: 'B-', credits: '4' },
    { id: '3', title: 'BUSINESS LAW', cid: 'BA-571', grade: 'A', credits: '3' },
    { id: '4', title: 'ORGANIZATIONAL BEHAVIOR', cid: 'MGMT-545', grade: 'B+', credits: '3' },
    { id: '5', title: 'FINANCIAL MANAGEMENT', cid: 'BA-574', grade: '', credits: '4' },
    { id: '6', title: 'OPERATIONS MANAGEMENT', cid: 'BA-576', grade: '', credits: '3' },
    { id: '7', title: 'INTERNATIONAL BUSINESS', cid: 'BA-577', grade: 'A', credits: '3' },
    { id: '8', title: 'MANAGEMENT INFORMATION SYSTEMS', cid: 'BA-578', grade: 'B+', credits: '4' }
];

const transferCourseData = [
    { id: 'transfer-1', title: 'Principles of Accounting', cid: 'ACCT-511', grade: 'A', credits: '4' },
    { id: 'transfer-2', title: 'Introduction to Economics', cid: 'ECON-501', grade: 'A', credits: '4' },
    { id: 'transfer-3', title: 'Business Statistics', cid: 'BA-575', grade: 'B+', credits: '4' }
];

const futureCourseData = [
    { id: 'future-1', title: 'Business Analytics', cid: 'BA-573', grade: '', credits: '3' },
    { id: 'future-2', title: 'Strategic Management', cid: 'MGMT-580', grade: '', credits: '3' },
    { id: 'future-3', title: 'Marketing Strategy', cid: 'MKTG-555', grade: '', credits: '3' }
];

function searchCourses(courses, searchTerm) {
    const term = searchTerm.trim().toLowerCase();
    if (!term) {
        return courses;
    }

    return courses.filter(course =>
        [course.title, course.cid, course.grade, course.credits]
            .some(value => value.toLowerCase().includes(term))
    );
}

function createPlanCourse(course, placement, origin = course.origin) {
    return {
        ...course,
        placement,
        origin,
        remove: 'utility:delete'
    };
}

function sumCourseCredits(courses) {
    return courses.reduce((total, course) => {
        const credits = Number(course.credits);
        if (!String(course.credits).trim() || !Number.isFinite(credits) || credits < 0) {
            throw new Error(`Invalid credit value for course ${course.id}`);
        }

        return total + credits;
    }, 0);
}

export default class posCourses extends LightningElement {
    columns = baseColumns;
    planColumns = planColumns;
    alerts = alerts;
    transferSearchTerm = '';
    transcriptSearchTerm = '';
    futureSearchTerm = '';

    transcriptCourses = transcriptCourseData.map(course => ({ ...course, placement: 'major' }));
    transferCourses = transferCourseData.map(course => ({ ...course, placement: '' }));
    futureCourses = futureCourseData.map(course => ({ ...course, placement: '' }));
    majorCourses = transcriptCourseData.map(course => createPlanCourse(course, 'major', 'transcript'));
    optionCourses = [];
    minorCourses = [];
    thesisCourses = [];
    programSelection = {};

    connectedCallback() {
        this.programSelection = loadProgramSelection();
    }

    handleTransferSearch(event) {
        this.transferSearchTerm = event.detail.value ?? '';
    }

    handleTranscriptSearch(event) {
        this.transcriptSearchTerm = event.detail.value ?? '';
    }

    handleFutureSearch(event) {
        this.futureSearchTerm = event.detail.value ?? '';
    }

    handlePlacementChange(event) {
        const { rowId, placement } = event.detail;
        const source = event.currentTarget.dataset.source;
        const destinationField = this.getPlanField(placement);

        if (source === 'transfer' || source === 'future') {
            const sourceField = source === 'transfer' ? 'transferCourses' : 'futureCourses';
            const course = this[sourceField].find(item => item.id === rowId);

            if (!course) {
                return;
            }

            this[sourceField] = this[sourceField].filter(item => item.id !== rowId);
            this[destinationField] = [
                ...this[destinationField],
                createPlanCourse(course, placement, source)
            ];
            return;
        }

        if (source === 'transcript') {
            const course = this.transcriptCourses.find(item => item.id === rowId);

            if (!course || course.placement === placement) {
                return;
            }

            const currentField = course.placement ? this.getPlanField(course.placement) : null;
            if (currentField) {
                this[currentField] = this[currentField].filter(item => item.id !== rowId);
            }

            this[destinationField] = [
                ...this[destinationField],
                createPlanCourse(course, placement, 'transcript')
            ];
            this.transcriptCourses = this.transcriptCourses.map(item =>
                item.id === rowId ? { ...item, placement } : item
            );
            return;
        }

        const sourceField = this.getPlanField(source);
        if (sourceField === destinationField) {
            return;
        }

        const course = this[sourceField].find(item => item.id === rowId);
        if (!course) {
            return;
        }

        this[sourceField] = this[sourceField].filter(item => item.id !== rowId);
        this[destinationField] = [
            ...this[destinationField],
            createPlanCourse(course, placement)
        ];
        this.updateTranscriptPlacement(rowId, placement);
    }

    handlePlanRowAction(event) {
        if (event.detail.action.name !== 'remove') {
            return;
        }

        const sourceField = this.getPlanField(event.currentTarget.dataset.source);
        const rowId = event.detail.row.id;
        const course = this[sourceField].find(item => item.id === rowId);
        if (!course) {
            return;
        }

        this[sourceField] = this[sourceField].filter(item => item.id !== rowId);

        const originFields = {
            transfer: 'transferCourses',
            transcript: 'transcriptCourses',
            future: 'futureCourses'
        };
        const originField = originFields[course.origin];
        if (!originField) {
            throw new Error(`Unknown course origin: ${course.origin}`);
        }

        const { remove, origin, ...sourceCourse } = course;
        if (origin === 'transcript') {
            this.updateTranscriptPlacement(rowId, '');
        } else {
            this[originField] = [
                ...this[originField],
                { ...sourceCourse, placement: '' }
            ];
        }
    }

    updateTranscriptPlacement(rowId, placement) {
        this.transcriptCourses = this.transcriptCourses.map(item =>
            item.id === rowId ? { ...item, placement } : item
        );
    }

    getPlanField(placement) {
        const planFields = {
            major: 'majorCourses',
            option: 'optionCourses',
            minor: 'minorCourses',
            thesis: 'thesisCourses'
        };
        const field = planFields[placement];

        if (!field) {
            throw new Error(`Unknown course category: ${placement}`);
        }

        return field;
    }

    get filteredTransferCourses() {
        return searchCourses(this.transferCourses, this.transferSearchTerm);
    }

    get filteredTranscriptCourses() {
        const plannedCourseIds = new Set([
            ...this.majorCourses,
            ...this.optionCourses,
            ...this.minorCourses,
            ...this.thesisCourses
        ].map(course => course.id));

        return searchCourses(
            this.transcriptCourses.filter(course => !plannedCourseIds.has(course.id)),
            this.transcriptSearchTerm
        );
    }

    get filteredFutureCourses() {
        return searchCourses(this.futureCourses, this.futureSearchTerm);
    }

    get hasTransferSearch() {
        return Boolean(this.transferSearchTerm.trim());
    }

    get hasTranscriptSearch() {
        return Boolean(this.transcriptSearchTerm.trim());
    }

    get hasFutureSearch() {
        return Boolean(this.futureSearchTerm.trim());
    }

    get hasTransferResults() {
        return this.filteredTransferCourses.length > 0;
    }

    get hasTranscriptResults() {
        return this.filteredTranscriptCourses.length > 0;
    }

    get hasFutureResults() {
        return this.filteredFutureCourses.length > 0;
    }

    get requiredCredits() {
        return getProgramRequirements(this.programSelection);
    }

    get totalCreditsAdded() {
        return this.majorCreditsAdded +
            this.optionCreditsAdded +
            this.minorCreditsAdded +
            this.thesisCreditsAdded;
    }

    get majorCreditsAdded() {
        return sumCourseCredits(this.majorCourses);
    }

    get optionCreditsAdded() {
        return sumCourseCredits(this.optionCourses);
    }

    get minorCreditsAdded() {
        return sumCourseCredits(this.minorCourses);
    }

    get thesisCreditsAdded() {
        return sumCourseCredits(this.thesisCourses);
    }
}