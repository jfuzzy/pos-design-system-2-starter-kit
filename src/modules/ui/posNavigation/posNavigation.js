import { LightningElement } from 'lwc';
import { navigate } from '../../../router';

export default class PosNavigation extends LightningElement {

    steps = [
        {
            id: 'overview',
            label: 'Overview',
            path: '/pos',
            className: 'slds-card'
        },
        {
            id: 'coursePlan',
            label: 'Build Course Plan',
            path: '/pos-courses',
            className: 'slds-card'
        },
        {
            id: 'coursePlanSingle',
            label: 'Course Plan Single',
            path: '/pos-coursescombo',
            className: 'slds-card'
        },
        {
            id: 'committee',
            label: 'Select Committee',
            path: '/pos-committee',
            className: 'slds-card'
        },
        {
            id: 'requirements',
            label: 'Additional Requirements',
            path: '/pos-additional',
            className: 'slds-card' 
        },
        {
            id: 'review',
            label: 'Review & Submit',
            path: '/pos-review',
            className: 'slds-card'
        }
    ];
    handleNavClick(event) {
        const step = this.steps.find(({ id }) => id === event.currentTarget.dataset.id);
        if (step?.path) {
            navigate(step.path);
        }
    }
}


  

  
