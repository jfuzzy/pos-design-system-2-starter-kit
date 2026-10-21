import { LightningElement } from "lwc";
import { navigate } from '../../../router';
import { POS_NAVIGATION_LINKS } from '../../../posNavigation.config';

export default class posCombobox extends LightningElement {
  get statusOptions() {
    return POS_NAVIGATION_LINKS.map(({ path, label }) => ({
      value: path,
      label
    }));
  }

  value = '';

  handleChange(event) {
    this.value = event.detail.value;
    navigate(this.value);
  }
}