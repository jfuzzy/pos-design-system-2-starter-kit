import LightningDatatable from 'lightning/datatable';
import coursePlacementTemplate from './coursePlanDatatable.html';

export default class coursePlanDatatable extends LightningDatatable {
    static customTypes = {
        coursePlacement: {
            template: coursePlacementTemplate,
            standardCellLayout: true,
            typeAttributes: ['options', 'rowId', 'value']
        }
    };
}
