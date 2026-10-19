import { api, LightningElement } from 'lwc';

export default class coursePlacementSelect extends LightningElement {
    @api options;
    @api rowId;
    @api     value;

    get buttonLabel() {
        const selectedOption = (this.options || []).find(option => option.value === this.value);
        return selectedOption?.label ?? 'Choose';
    }

    handleChange(event) {
        this.dispatchEvent(new CustomEvent('placementchange', {
            detail: {
                rowId: this.rowId,
                placement: event.detail.value
            },
            bubbles: true,
            composed: true
        }));
    }
}
