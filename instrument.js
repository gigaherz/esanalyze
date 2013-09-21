/**
 * Created with JetBrains WebStorm.
 * User: gigaherz
 * Date: 25/08/12
 * Time: 14:48
 * To change this template use File | Settings | File Templates.
 */

var Context = (function ContextClosure(){
    'use strict';

    function Context(parent, loc, type, isFunction){
        this.loc = loc.start;
        this.parent = parent;
        this.type = type;
        this.variables = {};
        this.childContexts = [];

        if(isFunction) {
            this.parentFunction = this;
        } else {
            this.parentFunction = this.parent.parentFunction;
        }

        if(this.parent) {
            parent.push(this);
        }
    }

    Context.prototype.push = function pushChild(ctx) {
        this.childContexts.push(ctx);
    };

    Context.prototype.insert = function insertVariable(
            name, type, value, isLet) {
        var rName = '$' + name;
        var ctx = isLet ? this : this.parentFunction;

        ctx.variables[rName] = {
            type: type,
            value: value,
            context: ctx
        };
    };

    Context.prototype.find = function findVariable(name) {
        var rName = '$' + name;
        var ctx = this;

        while (ctx) {
            if (rName in ctx.variables) {
                return ctx.variables[rName];
            }

            ctx = ctx.parent;
        }

        return undefined;
    };

    function objectLength(obj) {
        var size = 0, key;
        for (key in obj) {
            if (obj.hasOwnProperty(key)) {
                size++;
            }
        }
        return size;
    }

    Context.prototype.toJSON = function toJSON() {

        var hasVariables = objectLength(this.variables) > 0;

        var vars = {};
        var children = [];

        if (hasVariables) {
            for (var key in this.variables) {
                if (this.variables.hasOwnProperty(key)) {
                    if (this.variables[key].type === null) {
                        vars[key] = 'unknown (value type:' +
                                    typeof this.variables[key].value + ')';
                    }
                    else {
                        vars[key] = this.variables[key].type;
                    }
                }
            }
        }

        for (var i = 0, l = this.childContexts.length; i < l; i++) {
            var t = this.childContexts[i].toJSON();
            if (t) {
                children.push(t);
            }
        }

        if (!hasVariables && children.length === 1) {
            return children[0];
        }

        return {
            loc: this.loc.start,
            variables: vars,
            childContexts: children
        };
    };

    return Context;
})();

(function (exports) {
    'use strict';

    function printLn(text) {
        process.stdout.write(text + '\n');
    }

    function warn(node, message) {
        printLn('WARNING: At line ' + node.loc.start.line + ' char ' +
                (node.loc.start.column+1) + ': ' + message);
    }

    function error(node, message) {
        printLn('ERROR: At line ' + node.loc.start.line + ' char ' +
                (node.loc.start.column+1) + ': ' + message);
        process.exit(1);
    }

    var walker = require('eswalker'),
        instrument = walker.createWalker();

    instrument.enterProgram = function (node, parent, fieldName, siblings,
                                        index) {
        node.context = new Context(null, node.loc, 'program', true);
    };
    instrument.enterAssignmentExpression = function (node, parent, fieldName,
                                                     siblings, index) {
        node.context = parent.context;
    };
    instrument.enterArrayExpression = function (node, parent, fieldName,
                                                siblings, index) {
        node.context = parent.context;
    };
    instrument.enterBinaryExpression = function (node, parent, fieldName,
                                                 siblings, index) {
        node.context = parent.context;
    };
    instrument.enterBlockStatement = function (node, parent, fieldName,
                                               siblings, index) {
        node.context = new Context(parent.context, node.loc, 'block');
    };
    instrument.enterCallExpression = function (node, parent, fieldName,
                                               siblings, index) {
        node.context = parent.context;
    };
    instrument.enterCatchClause = function (node, parent, fieldName, siblings,
                                            index) {
        node.context = parent.context;
    };
    instrument.enterConditionalExpression = function (node, parent, fieldName,
                                                      siblings, index) {
        node.context = parent.context;
    };
    instrument.enterDoWhileStatement = function (node, parent, fieldName,
                                                 siblings, index) {
        node.context = parent.context;
    };
    instrument.enterExpressionStatement = function (node, parent, fieldName,
                                                    siblings, index) {
        node.context = parent.context;
    };
    instrument.enterForStatement = function (node, parent, fieldName, siblings,
                                             index) {
        node.context = parent.context;
    };
    instrument.enterForInStatement = function (node, parent, fieldName,
                                               siblings, index) {
        node.context = parent.context;
    };
    instrument.enterFunctionDeclaration = function (node, parent, fieldName,
                                                    siblings, index) {
        node.context = new Context(parent.context, node.loc, 'function', true);
    };
    instrument.enterFunctionExpression = function (node, parent, fieldName,
                                                   siblings, index) {
        node.context = new Context(parent.context, node.loc, 'function', true);
    };
    instrument.enterIfStatement = function (node, parent, fieldName, siblings,
                                            index) {
        node.context = parent.context;
    };
    instrument.enterLabeledStatement = function (node, parent, fieldName,
                                                 siblings, index) {
        node.context = parent.context;
    };
    instrument.enterLogicalExpression = function (node, parent, fieldName,
                                                  siblings, index) {
        node.context = parent.context;
    };
    instrument.enterMemberExpression = function (node, parent, fieldName,
                                                 siblings, index) {
        node.context = parent.context;
    };
    instrument.enterNewExpression = function (node, parent, fieldName, siblings,
                                              index) {
        node.context = parent.context;
    };
    instrument.enterObjectExpression = function (node, parent, fieldName,
                                                 siblings, index) {
        node.context = parent.context;
    };
    instrument.enterProperty = function (node, parent, fieldName, siblings,
                                         index) {
        node.context = parent.context;
    };
    instrument.enterReturnStatement = function (node, parent, fieldName,
                                                siblings, index) {
        node.context = parent.context;
    };
    instrument.enterSequenceExpression = function (node, parent, fieldName,
                                                   siblings, index) {
        node.context = parent.context;
    };
    instrument.enterSwitchStatement = function (node, parent, fieldName,
                                                siblings, index) {
        node.context = parent.context;
    };
    instrument.enterSwitchCase = function (node, parent, fieldName, siblings,
                                           index) {
        node.context = parent.context;
    };
    instrument.enterThrowStatement = function (node, parent, fieldName,
                                               siblings, index) {
        node.context = parent.context;
    };
    instrument.enterTryStatement = function (node, parent, fieldName, siblings,
                                             index) {
        node.context = parent.context;
    };
    instrument.enterUnaryExpression = function (node, parent, fieldName,
                                                siblings, index) {
        node.context = parent.context;
    };
    instrument.enterUpdateExpression = function (node, parent, fieldName,
                                                 siblings, index) {
        node.context = parent.context;
    };
    instrument.enterVariableDeclaration = function (node, parent, fieldName,
                                                    siblings, index) {
        node.context = parent.context;
    };
    instrument.enterVariableDeclarator = function (node, parent, fieldName,
                                                   siblings, index) {
        node.context = parent.context;
    };
    instrument.enterWithStatement = function (node, parent, fieldName, siblings,
                                              index) {
        node.context = parent.context;
    };
    instrument.enterWhileStatement = function (node, parent, fieldName,
                                               siblings, index) {
        node.context = parent.context;
    };

    instrument.exitParams = function (
            nodes, parent, fieldName, siblings, index) {

        for (var i = 0; i < nodes.length; i++) {
            parent.context.insert(nodes[i].name, 'dynamic', null);
        }

        return nodes;
    };

    instrument.exitVariableDeclarator = function (
            node, parent, fieldName, siblings, index) {

        var ctx = (parent.kind === 'let' || parent.kind === 'const') ?
                parent.context :
                parent.context.parentFunction;

        var vRef = node.context.find(node.id.name);

        if (vRef && vRef.context === ctx) {
            if(vRef.value && node.init) {
                warn(node, 'Duplicate definition of "' + node.id.name +
                        '" in the same context, replacing a previous value!');
            } else {
                warn(node, 'Duplicate definition of "' + node.id.name +
                        '" in the same context.');
            }

            if (node.init) {
                if (!node.init.resultType) {
                    error(node.init, "Result type not assigned to node.init: " +
                            node.init.type + ', ' + node.init.resultType);
                }

                ctx.insert(node.id.name,
                        node.init.resultType, node.init.resultValue);
            }
        }
        else {
            if (node.init) {
                if (!node.init.resultType) {
                    error(node.init, "Result type not assigned to node.init: " +
                            node.init.type + ', ' + node.init.resultType);
                }

                ctx.insert(node.id.name,
                        node.init.resultType, node.init.resultValue);
            } else {
                ctx.insert(node.id.name, 'uninitialized', null);
            }
        }
        return node;
    };

    instrument.exitAssignmentExpression = function (
            node, parent, fieldName, siblings, index) {

        if (node.left.type === 'Identifier') {

            if (!node.right.resultType) {
                error(node,  "Result type not assigned to node.right: " +
                             node.right.type + ', ' + node.right.resultType);
            }

            var vRef = node.context.find(node.left.name);

            if (!vRef) {
                warn(node.left, 'Assignation of undeclared variable "' +
                                node.left.name + '"!');

                parent.insert(node.left.name, node.right.resultType,
                        node.right.resultValue, false);

            } else {

                var newType = node.right.resultType;
                var newValue = node.right.resultValue;

                if (!node.right.resultType) {
                    warn(node,  "Assignment from uninitialized value.");
                }

                if(vRef.type === 'object' &&
                   newType === 'null') {
                    newType = 'object';
                }

                if (vRef.type &&
                    vRef.type !== 'uninitialized' &&
                    vRef.type !== 'dynamic' &&
                    vRef.type !== newType &&
                    (
                            vRef.type !== 'object' ||
                            newType !== 'null'
                            ) &&
                    (
                            vRef.type !== 'null' ||
                            newType !== 'null'
                            )) {

                    if(node.right.resultType !== 'dynamic') {
                        warn(node,
                                'Variable assigned with multiple different' +
                                ' value types');
                    } else {
                        warn(node,
                                'Variable potentially assigned with multiple' +
                                ' different value types');
                    }
                    newType = 'dynamic';
                    newValue = null;
                }

                vRef.type = newType;
                vRef.value = newValue;
            }

            node.resultType = node.right.resultType;
            node.resultValue = node.right.resultValue;
        }
        return node;
    };

    instrument.walkLiteral = function (
            node, parent, fieldName, siblings, index) {

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

        var vRef = parent.context.find(node.name);

        if (vRef && vRef.type) {
            node.resultType = vRef.type;
            node.resultValue = vRef.value;
        }

        return node;
    };

    instrument.exitConditionalExpression = function (
            node, parent, fieldName, siblings, index) {

        // TODO: implement type inference and expression simplification

        if (!node.consequent.resultType) {
            throw "Result type not assigned to node.consequent: " +
                  node.left.type + ', ' + node.left.resultType;
        }

        if (!node.alternate.resultType) {
            throw "Result type not assigned to node.alternate: " +
                  node.right.type + ', ' + node.right.resultType;
        }

        if(node.test.resultValue === true) {
            node.resultType = node.consequent.resultType;
            node.resultValue = node.consequent.resultValue;
        } else if(node.test.resultValue === false) {
            node.resultType = node.alternate.resultType;
            node.resultValue = node.alternate.resultValue;
        } else {
            node.resultValue = null;

            if(node.consequent.resultType === node.alternate.resultType) {
                node.resultType = node.consequent.resultType;
            } else {
                node.resultType = 'dynamic';
            }
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
