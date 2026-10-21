import { LightningElement } from 'lwc';
import { linkHref, navigate, shouldHandleLink } from '../../../router';
import { POS_NAVIGATION_LINKS } from '../../../posNavigation.config';

const POS_NAVIGATION_LINKS_BY_ID = Object.fromEntries(
    POS_NAVIGATION_LINKS.map(link => [link.id, link])
);

export default class posReview extends LightningElement {
    get overviewHref() {
        return linkHref(POS_NAVIGATION_LINKS_BY_ID.overview.path);
    }

    get coursePlanHref() {
        return linkHref(POS_NAVIGATION_LINKS_BY_ID.coursePlanSingle.path);
    }

    get committeeHref() {
        return linkHref(POS_NAVIGATION_LINKS_BY_ID.committee.path);
    }

    get additionalRequirementsHref() {
        return linkHref(POS_NAVIGATION_LINKS_BY_ID.requirements.path);
    }

    handleCardLinkClick(event) {
        if (!shouldHandleLink(event)) return;

        event.preventDefault();
        navigate(POS_NAVIGATION_LINKS_BY_ID[event.currentTarget.dataset.id].path);
    }
}