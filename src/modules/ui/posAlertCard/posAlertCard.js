import { api, LightningElement } from 'lwc';

const STATUS_DETAILS = {
    pass: {
        icon: 'utility:success',
        alternativeText: 'Pass'
    },
    fail: {
        icon: 'utility:error',
        alternativeText: 'Fail'
    },
    manual: {
        icon: 'utility:info',
        alternativeText: 'Manual check'
    }
};

export default class posAlertCard extends LightningElement {
    @api header = '';
    @api body = '';
    @api footer = '';
    @api status = 'manual';

    get statusDetails() {
        const details = STATUS_DETAILS[this.status];
        if (!details) {
            throw new Error(`Unsupported alert status: ${this.status}`);
        }

        return details;
    }

    get statusIcon() {
        return this.statusDetails.icon;
    }

    get statusAlternativeText() {
        return this.statusDetails.alternativeText;
    }
}
