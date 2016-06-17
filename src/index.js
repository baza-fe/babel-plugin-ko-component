import externalTpl from './tpl/external';
import registationTpl from './tpl/registation';

const EXPORT_NAME = '__ko_component__';
const EXTERNAL_LABEL_NAME = '__ko_component_label__';
const EXTERNAL_STYLE_NAME = '__ko_component_style__';
const EXTERNAL_TEMPLATE_NAME = '__ko_component_template__';

function transpile({ types: t }) {
    let hasExternalLabelDeclaration = false;
    let hasExternalStyleDeclaration = false;
    let hasExternalTemplateDeclaration = false;

    const variableDeclaratorVisitor = {
        enter(path) {
            const id = path.node.id;

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
                enter(path) {
                    if (path.parentPath.type === 'Program') {
                        path.traverse(variableDeclaratorVisitor);
                    }
                }
            },

            ExportDefaultDeclaration: {
                exit(path) {
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

export default transpile;
