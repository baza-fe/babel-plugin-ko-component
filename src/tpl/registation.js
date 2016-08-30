// template params:
//
// - NAME component name
// - EXPORT component export value

import template from 'babel-template';

export default template(`
    const EXPORT_NAME = EXPORT_VALUE;

    EXPORT_NAME.name = EXPORT_NAME.name || EXTERNAL_LABEL_NAME;
    EXPORT_NAME.style = EXPORT_NAME.style || EXTERNAL_STYLE_NAME;
    EXPORT_NAME.template = EXPORT_NAME.template || EXTERNAL_TEMPLATE_NAME;

    ko.components.register(EXPORT_NAME.name, EXPORT_NAME);
`);
