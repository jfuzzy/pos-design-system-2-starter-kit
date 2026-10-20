import { LightningElement } from 'lwc';

const categoryOptions = [
    { label: 'Major Courses', value: 'major' },
    { label: 'Option Courses', value: 'option' },
    { label: 'Minor Courses', value: 'minor' },
    { label: 'Thesis (Capstone) Courses', value: 'thesis' }
];

const baseColumns = [
    { label: 'Course Title', fieldName: 'title'},
    { label: 'Course ID', fieldName: 'cid' },
    { label: 'Grade', fieldName: 'grade' },
    { label: 'Credits', fieldName: 'credits' },
    {
        label: 'Section',
        fieldName: 'placement',
        type: 'coursePlacement',
        initialWidth: 200,
        typeAttributes: {
            value: { fieldName: 'placement' },
            rowId: { fieldName: 'id' },
            options: categoryOptions,
            variant: 'bare'
        }
    }
];

const searchColumns = [
    ...baseColumns,
    {
        label: 'Add to Plan',
        type: 'button',
        typeAttributes: {
            label: 'Add to Plan',
            name: 'addToPlan',
            variant: 'brand'
        }
    }
];

const planColumns = [
    ...baseColumns,
    {
        label: '',
        fieldName: 'remove',
        type: 'button-icon',
      //  initialWidth: 50,
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
    { id: '1', title: 'CROSS CULTURAL MANAGEMENT', cid: 'MGMT-546', grade: 'A+', credits: '3' },
    { id: '2', title: 'ADVANCED INFORMATION SYSTEMS', cid: 'BA-572', grade: 'B-', credits: '4' }
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

function createPlanCourse(course, placement) {
    return {
        ...course,
        placement,
        remove: 'utility:delete'
    };
}

export default class posCoursesCombo extends LightningElement {
    searchColumns = searchColumns;
    planColumns = planColumns;
    transferSearchTerm = '';
    transcriptSearchTerm = '';
    futureSearchTerm = '';

    transcriptCourses = transcriptCourseData.map(course => ({ ...course, placement: 'major' }));
    transferCourses = transferCourseData.map(course => ({ ...course, placement: '' }));
    futureCourses = futureCourseData.map(course => ({ ...course, placement: '' }));
    majorCourses = transcriptCourseData.map(course => createPlanCourse(course, 'major'));

    handleTransferSearch(event) {
        this.transferSearchTerm = event.detail.value ?? '';
    }

    handleTranscriptSearch(event) {
        this.transcriptSearchTerm = event.detail.value ?? '';
    }

    handleFutureSearch(event) {
        this.futureSearchTerm = event.detail.value ?? '';
    }

    handleSearchPlacementChange(event) {
        const { rowId, placement } = event.detail;
        const sourceField = this.getSearchField(event.currentTarget.dataset.source);

        this[sourceField] = this[sourceField].map(course =>
            course.id === rowId ? { ...course, placement } : course
        );
    }

    handleAddToPlan(event) {
        if (event.detail.action.name !== 'addToPlan') {
            return;
        }

        const rowId = event.detail.row.id;
        const sourceField = this.getSearchField(event.currentTarget.dataset.source);
        const course = this[sourceField].find(item => item.id === rowId);

        if (!course) {
            return;
        }

        if (sourceField !== 'transcriptCourses') {
            this[sourceField] = this[sourceField].filter(item => item.id !== rowId);
        }

        const placement = course.placement || 'major';
        if (this.majorCourses.some(item => item.id === rowId)) {
            this.majorCourses = this.majorCourses.map(item =>
                item.id === rowId ? createPlanCourse(course, placement) : item
            );
        } else {
            this.majorCourses = [
                ...this.majorCourses,
                createPlanCourse(course, placement)
            ];
        }

        this.updateTranscriptPlacement(rowId, placement);
    }

    handlePlacementChange(event) {
        const { rowId, placement } = event.detail;
        this.majorCourses = this.majorCourses.map(course =>
            course.id === rowId ? { ...course, placement } : course
        );
        this.updateTranscriptPlacement(rowId, placement);
    }

    handlePlanRowAction(event) {
        if (event.detail.action.name !== 'remove') {
            return;
        }

        const rowId = event.detail.row.id;
        this.majorCourses = this.majorCourses.filter(item => item.id !== rowId);
        this.updateTranscriptPlacement(rowId, '');
    }

    updateTranscriptPlacement(rowId, placement) {
        this.transcriptCourses = this.transcriptCourses.map(item =>
            item.id === rowId ? { ...item, placement } : item
        );
    }

    getSearchField(source) {
        const searchFields = {
            transfer: 'transferCourses',
            transcript: 'transcriptCourses',
            future: 'futureCourses'
        };
        const field = searchFields[source];

        if (!field) {
            throw new Error(`Unknown course source: ${source}`);
        }

        return field;
    }

    get filteredTransferCourses() {
        return searchCourses(this.transferCourses, this.transferSearchTerm);
    }

    get filteredTranscriptCourses() {
        return searchCourses(this.transcriptCourses, this.transcriptSearchTerm);
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
}