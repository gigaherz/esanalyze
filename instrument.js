/**
 * Created with JetBrains WebStorm.
 * User: gigaherz
 * Date: 25/08/12
 * Time: 14:48
 * To change this template use File | Settings | File Templates.
 */


(function (exports) {
    'use strict';

    var instrument = walker.createWalker();

instrument.enterProgram = function (
        node, parent, fieldName, siblings, index) {
    node.context = {
        type: 'program',
        parent: null,
        parentFunction: null,
        variables: {},
        childContexts: []
    };
    node.context.parentFunction = node.context;
};

instrument.enterAssignmentExpression = function (
        node, parent, fieldName, siblings, index) {
    node.context = parent.context;
};
instrument.enterArrayExpression = function (
        node, parent, fieldName, siblings, index) {
    node.context = parent.context;
};
instrument.enterBinaryExpression = function (
        node, parent, fieldName, siblings, index) {
    node.context = parent.context;
};
instrument.enterBlockStatement = function (
        node, parent, fieldName, siblings, index) {
    node.context = {
        type: 'block',
        parent: parent.context,
        parentFunction: parent.context.parentFunction,
        variables: {},
        childContexts: []
    };
    parent.context.childContexts.push(node.context);
};
instrument.enterCallExpression = function (
        node, parent, fieldName, siblings, index) {
    node.context = parent.context;
};
instrument.enterCatchClause = function (
        node, parent, fieldName, siblings, index) {
    node.context = parent.context;
};
instrument.enterConditionalExpression = function (
        node, parent, fieldName, siblings, index) {
    node.context = parent.context;
};
instrument.enterDoWhileStatement = function (
        node, parent, fieldName, siblings, index) {
    node.context = parent.context;
};
instrument.enterExpressionStatement = function (
        node, parent, fieldName, siblings, index) {
    node.context = parent.context;
};
instrument.enterForStatement = function (
        node, parent, fieldName, siblings, index) {
    node.context = parent.context;
};
instrument.enterForInStatement = function (
        node, parent, fieldName, siblings, index) {
    node.context = parent.context;
};
instrument.enterFunctionDeclaration = function (
        node, parent, fieldName, siblings, index) {
    node.context = {
        type: 'function',
        parent: parent.context,
        parentFunction: null,
        variables: {},
        childContexts: []
    };
    node.context.parentFunction = node.context;
    parent.context.childContexts.push(node.context);
};
instrument.enterFunctionExpression = function (
        node, parent, fieldName, siblings, index) {
    node.context = {
        type: 'function',
        parent: parent.context,
        parentFunction: null,
        variables: {},
        childContexts: []
    };
    node.context.parentFunction = node.context;
    parent.context.childContexts.push(node.context);
};
instrument.enterIfStatement = function (
        node, parent, fieldName, siblings, index) {
    node.context = parent.context;
};
instrument.enterLabeledStatement = function (
        node, parent, fieldName, siblings, index) {
    node.context = parent.context;
};
instrument.enterLogicalExpression = function (
        node, parent, fieldName, siblings, index) {
    node.context = parent.context;
};
instrument.enterMemberExpression = function (
        node, parent, fieldName, siblings, index) {
    node.context = parent.context;
};
instrument.enterNewExpression = function (
        node, parent, fieldName, siblings, index) {
    node.context = parent.context;
};
instrument.enterObjectExpression = function (
        node, parent, fieldName, siblings, index) {
    node.context = parent.context;
};
instrument.enterProperty = function (node, parent, fieldName, siblings, index) {
    node.context = parent.context;
};
instrument.enterReturnStatement = function (
        node, parent, fieldName, siblings, index) {
    node.context = parent.context;
};
instrument.enterSequenceExpression = function (
        node, parent, fieldName, siblings, index) {
    node.context = parent.context;
};
instrument.enterSwitchStatement = function (
        node, parent, fieldName, siblings, index) {
    node.context = parent.context;
};
instrument.enterSwitchCase = function (
        node, parent, fieldName, siblings, index) {
    node.context = parent.context;
};
instrument.enterThrowStatement = function (
        node, parent, fieldName, siblings, index) {
    node.context = parent.context;
};
instrument.enterTryStatement = function (
        node, parent, fieldName, siblings, index) {
    node.context = parent.context;
};
instrument.enterUnaryExpression = function (
        node, parent, fieldName, siblings, index) {
    node.context = parent.context;
};
instrument.enterUpdateExpression = function (
        node, parent, fieldName, siblings, index) {
    node.context = parent.context;
};
instrument.enterVariableDeclaration = function (
        node, parent, fieldName, siblings, index) {
    node.context = parent.context;
};
instrument.enterVariableDeclarator = function (
        node, parent, fieldName, siblings, index) {
    node.context = parent.context;
};
instrument.enterWithStatement = function (
        node, parent, fieldName, siblings, index) {
    node.context = parent.context;
};
instrument.enterWhileStatement = function (
        node, parent, fieldName, siblings, index) {
    node.context = parent.context;
};

instrument.exitParams = function (nodes, parent, fieldName, siblings, index) {

    for (var i = 0; i < nodes.length; i++) {

        var id = nodes[i].name;

        parent.context.parentFunction.variables['$' + id] = {
            knownType: 'dynamic',
            value: null
        };
    }

    return nodes;
};

instrument.exitVariableDeclarator = function (
        node, parent, fieldName, siblings, index) {

    var id = '$' + node.id.name;

    var ctx = (parent.kind === 'let' || parent.kind === 'const') ?
            parent.context :
            parent.context.parentFunction;

    var vRef = ctx.variables[id];

    if (vRef && vRef.knownType !== 'uninitialized' && node.init) {
        warn(node.init, 'Duplicate definition of "' + node.id.name +
                        '" in the same context replaces a previous value!');
    }

    if (node.init) {
        if (!node.init.resultType) {
            error(node.init, "Result type not assigned to node.init: " +
                             node.init.type + ', ' + node.init.resultType);
        }

        ctx.variables[id] = {
            knownType: node.init.resultType,
            value: node.init.resultValue
        };
    } else {
        ctx.variables['$' + node.id.name] = {
            knownType: 'uninitialized',
            value: node.init
        };
    }

    return node;
};

function findVariable(ctx, name) {
    while (ctx) {

        var vRef = ctx.variables['$' + name];

        if (vRef) {
            return vRef;
        }

        ctx = ctx.parent;
    }

    return undefined;
}

instrument.exitAssignmentExpression = function (
        node, parent, fieldName, siblings, index) {

    if (node.left.type === 'Identifier') {

        if (!node.right.resultType) {
            error(node,  "Result type not assigned to node.right: " +
                         node.right.type + ', ' + node.right.resultType);
        }

        var vRef = findVariable(node.context, node.left.name);

        if (!vRef) {
            warn(node.left, 'Assignation of undeclared variable "' +
                            node.left.name + '"!');

            parent.context.parentFunction.variables['$' + node.left.name] = {
                knownType: node.right.resultType,
                value: node.right.resultValue
            };

        } else {

            var newType = node.right.resultType;
            var newValue = node.right.resultValue;

            if(vRef.knownType === 'object' &&
               newType === 'null') {
                newType = 'object';
            }

            if (vRef.knownType &&
                vRef.knownType !== 'uninitialized' &&
                vRef.knownType !== 'dynamic' &&
                vRef.knownType !== node.right.resultType &&
                (
                        vRef.knownType !== 'object' ||
                        node.right.resultType !== 'null'
                        ) &&
                (
                        vRef.knownType !== 'null' ||
                        node.right.resultType !== 'null'
                        )) {

                if(node.right.resultType !== 'dynamic') {
                    warn(node,
                            'Variable assigned with multiple different value types');
                } else {
                    warn(node,
                            'Variable potentially assigned with multiple different value types');
                }
                newType = 'dynamic';
                newValue = null;
            }

            vRef.knownType = newType;
            vRef.value = newValue;
        }

        node.resultType = node.right.resultType;
        node.resultValue = node.right.resultValue;
    }
    return node;
};

instrument.walkLiteral = function (node, parent, fieldName, siblings, index) {

    var number = parseFloat(node.value);

    if (!isNaN(number)) {
        node.resultType = 'number';
        node.resultValue = number;
    } else if (node.value === 'true') {
        node.resultType = 'boolean';
        node.resultValue = true;
    } else if (node.value === 'false') {
        node.resultType = 'boolean';
        node.resultValue = false;
    } else if (node.value === 'null') {
        node.resultType = 'null';
        node.resultValue = null;
    } else {
        node.resultType = 'string';
        node.resultValue = node.value;
    }

    return node;
};

instrument.walkIdentifier = function (
        node, parent, fieldName, siblings, index) {

    node.resultType = 'undefined';
    node.resultValue = null;

    var vRef = findVariable(parent.context, node.name);

    if (vRef && vRef.knownType) {
        node.resultType = vRef.knownType;
        node.resultValue = vRef.value;
    }

    return node;
};

instrument.exitUnaryExpression = function (
        node, parent, fieldName, siblings, index) {

    // TODO: implement type inference and expression simplification

    if (!node.argument.resultType) {
        throw "Result type not assigned to node.argument: " +
              node.argument.type + ', ' + node.argument.resultType;
    }

    node.resultType = node.argument.resultType;
    node.resultValue = node.argument.resultValue;

    return node;
};

instrument.exitBinaryExpression = function (
        node, parent, fieldName, siblings, index) {

    // TODO: implement type inference and expression simplification

    if (!node.left.resultType) {
        throw "Result type not assigned to node.left: " + node.left.type +
              ', ' + node.left.resultType;
    }

    if (!node.right.resultType) {
        throw "Result type not assigned to node.right: " + node.right.type +
              ', ' + node.right.resultType;
    }

    node.resultType = 'dynamic';
    node.resultValue = null;

    return node;
};

instrument.exitLogicalExpression = function (
        node, parent, fieldName, siblings, index) {

    // TODO: implement type inference and expression simplification

    if (!node.left.resultType) {
        throw "Result type not assigned to node.left: " + node.left.type +
              ', ' + node.left.resultType;
    }

    if (!node.right.resultType) {
        throw "Result type not assigned to node.right: " + node.right.type +
              ', ' + node.right.resultType;
    }

    node.resultType = 'boolean';
    node.resultValue = null;

    return node;
};

instrument.exitMemberExpression = function (
        node, parent, fieldName, siblings, index) {

    // TODO: implement inference for members

    node.resultType = 'dynamic';
    node.resultValue = null;

    return node;
};

instrument.exitNewExpression = function (
        node, parent, fieldName, siblings, index) {

    // TODO: inference for object parts

    node.resultType = 'object';
    node.resultValue = null;

    return node;
};

instrument.exitProperty = function (node, parent, fieldName, siblings, index) {

    if (node.kind === 'get' || node.kind === 'set') {
        //TODO: Type inference for function return values
        node.resultType = 'dynamic';
        node.resultValue = null;
    } else {
        node.resultType = node.value.resultType;
        node.resultValue = node.value.resultValue;
    }

    return node;
};

instrument.exitObjectExpression = function (
        node, parent, fieldName, siblings, index) {
    /*
     var i, computedObject = {};

     var props = node.properties;

     for (i = 0; i < props.length; i++) {
     var rt = props[i].resultType;
     if (rt === 'number' || rt === 'boolean' || rt === 'null') {

     }
     }*/

    node.resultType = 'object';
    node.resultValue = null;

    return node;
};

instrument.exitArrayExpression = function (
        node, parent, fieldName, siblings, index) {

    node.resultType = 'array';
    node.resultValue = null;

    return node;
};

instrument.exitFunctionExpression = function (
        node, parent, fieldName, siblings, index) {

    node.resultType = 'function';
    node.resultValue = null;

    return node;
};

instrument.exitCallExpression = function (
        node, parent, fieldName, siblings, index) {

    //TODO: Type inference for function return values

    node.resultType = 'dynamic';
    node.resultValue = null;

    return node;
};

    exports.instrument = instrument;

    return exports;
}(typeof exports === 'undefined' ? (walker = {}) : exports));
