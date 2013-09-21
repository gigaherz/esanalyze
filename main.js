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

    var Reflect = require('esprima');
    var Instrument = require('./instrument.js').instrument;

    var original = (function loadCode(src) {
        var fs = require('fs');

        var contents = fs.readFileSync(src);

        return Reflect.parse(contents, {
            loc: true,
            source: src
        });
    })('./examples/primatests.js');

    var instrumented = Instrument.walk(original);

    var context = JSON.stringify(instrumented.context);

    // Show context tree
    process.stdout.write('Context tree: ' +
                         JSON.stringify(context, null, '  ') + '\n');
})();