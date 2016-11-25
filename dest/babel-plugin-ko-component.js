'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var template = _interopDefault(require('babel-template'));

// template params:
//
// - NAME external property name

var externalTpl = template("\n    const EXTERNAL_NAME = '';\n");

// template params:
//
// - NAME component name
// - EXPORT component export value

var registationTpl = template("\n    const EXPORT_NAME = EXPORT_VALUE;\n\n    EXPORT_NAME.name = EXPORT_NAME.name || EXTERNAL_LABEL_NAME;\n    EXPORT_NAME.style = EXPORT_NAME.style || EXTERNAL_STYLE_NAME;\n    EXPORT_NAME.template = EXPORT_NAME.template || EXTERNAL_TEMPLATE_NAME;\n\n    ko.components.register(EXPORT_NAME);\n");

var EXPORT_NAME = '__ko_component__';
var EXTERNAL_LABEL_NAME = '__ko_component_label__';
var EXTERNAL_STYLE_NAME = '__ko_component_style__';
var EXTERNAL_TEMPLATE_NAME = '__ko_component_template__';

function transpile(ref) {
    var t = ref.types;

    var hasExternalLabelDeclaration = false;
    var hasExternalStyleDeclaration = false;
    var hasExternalTemplateDeclaration = false;

    var variableDeclaratorVisitor = {
        enter: function enter(path) {
            var id = path.node.id;

            if (!id) {
                return;
            }

            switch (id.name) {
                case EXTERNAL_LABEL_NAME:
                    hasExternalLabelDeclaration = true;
                    break;

                case EXTERNAL_STYLE_NAME:
                    hasExternalStyleDeclaration = true;
                    break;

                case EXTERNAL_TEMPLATE_NAME:
                    hasExternalTemplateDeclaration = true;
                    break;
            }
        }
    };

    return {
        visitor: {
            VariableDeclaration: {
                enter: function enter$1(path) {
                    if (path.parentPath.type === 'Program') {
                        path.traverse(variableDeclaratorVisitor);
                    }
                }
            },

            ExportDefaultDeclaration: {
                exit: function exit(path) {
                    if (!hasExternalLabelDeclaration) {
                        path.insertBefore(externalTpl({
                            EXTERNAL_NAME: t.identifier(EXTERNAL_LABEL_NAME)
                        }));
                    }

                    if (!hasExternalStyleDeclaration) {
                        path.insertBefore(externalTpl({
                            EXTERNAL_NAME: t.identifier(EXTERNAL_STYLE_NAME)
                        }));
                    }

                    if (!hasExternalTemplateDeclaration) {
                        path.insertBefore(externalTpl({
                            EXTERNAL_NAME: t.identifier(EXTERNAL_TEMPLATE_NAME)
                        }));
                    }

                    path.insertBefore(registationTpl({
                        EXPORT_VALUE: path.node.declaration,
                        EXPORT_NAME: t.identifier(EXPORT_NAME),
                        EXTERNAL_LABEL_NAME: t.identifier(EXTERNAL_LABEL_NAME),
                        EXTERNAL_STYLE_NAME: t.identifier(EXTERNAL_STYLE_NAME),
                        EXTERNAL_TEMPLATE_NAME: t.identifier(EXTERNAL_TEMPLATE_NAME)
                    }));
                    path.node.declaration = t.identifier(EXPORT_NAME);
                }
            }
        }
    };
}

module.exports = transpile;
