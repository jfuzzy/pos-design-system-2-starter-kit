import { LightningElement } from "lwc";
export default class posCombobox extends LightningElement {
  statusOptions = [
        { 
        value: "overview", 
        label: "Overview", 
        },
        {
        value: "course-builder",
        label: "Course Builder",
        },
        {
        value: "committe-finder",
        label: "Committee Finder",
        },
        {
        value: "additional-requirements",
        label: "Additional Requirements",
        },
        {
        value: "review-submit",
        label: "Review & Submit",
        },
    ];

  value = "new";

  handleChange(event) {
    // Get the string of the "value" attribute on the selected option
    this.value = event.detail.value;
  }
}