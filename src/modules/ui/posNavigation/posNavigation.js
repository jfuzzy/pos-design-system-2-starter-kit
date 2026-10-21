import { LightningElement } from 'lwc';
import { navigate } from '../../../router';
import { POS_NAVIGATION_LINKS } from '../../../posNavigation.config';

export default class PosNavigation extends LightningElement {
    steps = POS_NAVIGATION_LINKS.map(link => ({
        ...link,
        className: 'slds-card'
    }));

    handleNavClick(event) {
        const step = this.steps.find(({ id }) => id === event.currentTarget.dataset.id);
        if (step?.path) {
            navigate(step.path);
        }
    }
}


  

  
