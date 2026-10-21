import { LightningElement } from 'lwc';
import { linkHref, navigate, shouldHandleLink } from '../../../router';

export default class posReview extends LightningElement {
    get overviewHref() {
        return linkHref('/pos');
    }

    get coursePlanHref() {
        return linkHref('/pos-coursescombo');
    }

    get committeeHref() {
        return linkHref('/pos-committee');
    }

    get additionalRequirementsHref() {
        return linkHref('/pos-additional');
    }

    handleCardLinkClick(event) {
        if (!shouldHandleLink(event)) return;

        event.preventDefault();
        navigate(event.currentTarget.dataset.path);
    }
}