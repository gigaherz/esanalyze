/**
 * Created by JetBrains WebStorm.
 * User: gigaherz
 * Date: 19/04/12
 * Time: 21:46
 * To change this template use File | Settings | File Templates.
 */

(function main()
{
    'use strict';

    function objectLength(obj) {
        var size = 0, key;
        for (key in obj) {
            if (obj.hasOwnProperty(key)) {
                size++;
            }
        }
        return size;
    }

    function extractContextsRecursively(context) {
        var l = context.childContexts.length;
        var o = objectLength(context.variables);

        if (o === 0 && l === 0) {
            return null;
        }

        var vars = {};
        var children = [];

        if (o > 0) {
            for (var key in context.variables) {
                if (context.variables.hasOwnProperty(key)) {
                    if (context.variables[key].knownType === null) {
                        vars[key] = 'unknown type (value type:' +
                                    typeof context.variables[key] + ')';
                    }
                    else {
                        vars[key] = context.variables[key].knownType;
                    }
                }
            }
        }

        for (var i = 0; i < l; i++) {
            var t = extractContextsRecursively(context.childContexts[i]);
            if (t) {
                children.push(t);
            }
        }

        if (o === 0) {
            if (children.length === 1) {
                return children[0];
            }

            if (children.length === 0) {
                return null;
            }
        }

        return {
            variables: vars,
            childContexts: children
        };
    }

    var Reflect = require('esprima');
    var Instrument = require('./instrument.js').instrument;

    var original = (function loadCode(src) {
        var fs = require('fs');

        var contents = fs.readFileSync(src);

        return Reflect.parse(contents, {
            loc: true,
            source: src
        });
    })('./examples/tests.js');

    var instrumented = Instrument.walk(original);

    var context = extractContextsRecursively(instrumented.context);

    // Show context tree
    process.stdout.write('Context tree: ' +
                         JSON.stringify(context, null, '  ') + '\n');
})();