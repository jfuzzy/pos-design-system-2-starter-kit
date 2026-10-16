import { LightningElement } from 'lwc';

const columns = [
    { label: 'Course Title', fieldName: 'title' },
    { label: 'Course ID', fieldName: 'cid' },
    { label: 'Grade', fieldName: 'grade' },
    { label: 'Credits', fieldName: 'credits' },
    { label: 'Action', fieldName: 'add' }
];

const transferCourses = [
    { id: 'transfer-1', title: 'Principles of Accounting', cid: 'ACCT-511', grade: 'A', credits: '4', add: '+ Add' },
    { id: 'transfer-2', title: 'Introduction to Economics', cid: 'ECON-501', grade: 'A', credits: '4', add: '+ Add' },
    { id: 'transfer-3', title: 'Business Statistics', cid: 'BA-575', grade: 'B+', credits: '4', add: '+ Add' }
];

const futureCourses = [
    { id: 'future-1', title: 'Business Analytics', cid: 'BA-573', grade: '', credits: '3', add: '+ Add' },
    { id: 'future-2', title: 'Strategic Management', cid: 'MGMT-580', grade: '', credits: '3', add: '+ Add' },
    { id: 'future-3', title: 'Marketing Strategy', cid: 'MKTG-555', grade: '', credits: '3', add: '+ Add' }
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

export default class posCourses extends LightningElement {
    columns = columns;
    transferSearchTerm = '';
    transcriptSearchTerm = '';
    futureSearchTerm = '';

    data = [
        {
            id: '1',
            title: 'CROSS CULTURAL MANAGEMENT',
            cid: 'MGMT-546',
            grade: 'A+',
            credits: '3',
            add: 'Remove'
        },
        {
            id: '2',
            title: 'ADVANCED INFORMATION SYSTEMS',
            cid: 'BA-572',
            grade: 'B-',
            credits: '4',
            add: 'Remove'
        }
    ];

    handleTransferSearch(event) {
        this.transferSearchTerm = event.detail.value ?? '';
    }

    handleTranscriptSearch(event) {
        this.transcriptSearchTerm = event.detail.value ?? '';
    }

    handleFutureSearch(event) {
        this.futureSearchTerm = event.detail.value ?? '';
    }

    get filteredTransferCourses() {
        return searchCourses(transferCourses, this.transferSearchTerm);
    }

    get filteredTranscriptCourses() {
        return searchCourses(this.data, this.transcriptSearchTerm);
    }

    get filteredFutureCourses() {
        return searchCourses(futureCourses, this.futureSearchTerm);
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