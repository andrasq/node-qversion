/**
 * Copyright 2015 Andras Radics
 * andras at andrasq dot com
 */

assert = require('assert');

QVersion = require('./qversion.js');
version_compare = QVersion.version_compare;
version_match = QVersion.version_match;

module.exports = {
    'version_compare': {
        'should compare versions': function(t) {
            cases = [
                // ver1, ver2, expected
                ['', '', 0],
                ['', '1', -1],
                ['1', '', 1],
                ['1', '1', 0],
                ['1', '2', -1],
                ['1', '0', 1],
                ['2', '10', -1],
                ['10', '2', 1],
                ['1.1', '1.1', 0],
                ['1.1', '1.2', -1],
                ['1.1', '1.0', 1],
                ['1.1', '1.0.1', 1],
                ['1.1', '1.1.0', -1],       // TBD: match or not?
                ['1.1', '1.1.1', -1],
                ['1.2', '1.10', -1],
                ['1.10', '1.2', 1],
                ['1.1.1', '1.1.1', 0],
                ['1.1.1', '1.1.2', -1],
                ['1.1.1', '1.1.0', 1],
                ['1.1.2', '1.1.10', -1],
                ['1.2.1', '1.1.10', 1],
                ['1.1.1', '1.1.1.1', -1],
            ];
            for (i=0; i<cases.length; i++) {
                var diff = version_compare(cases[i][0], cases[i][1]);
                diff = diff < 0 ? -1 : diff == 0 ? 0 : 1;
                var relop = cases[i][2] < 0 ? ' < ' : cases[i][2] == 0 ? ' == ' : ' > ';
                t.equal(diff, cases[i][2], cases[i][0] + relop + cases[i][1] + " => " + diff);
            }
            t.done();
        },

        'speed of 100k compares': function(t) {
            var a = "1.2.3", b = "1.2.4";
            var i, x;
            for (i=0; i<100000; i++) x = version_compare(a, b);
            // 30ms for 100k
            t.done();
        },
    },

    'version_match': {
    },

    'QVersion': {
        setUp: function(done) {
            this.qv = new QVersion();
            done();
        },

        'speed of 100k compares': function(t) {
            var a = "1.2.3", b = "1.2.4";
            var i, x, qv = this.qv;
            for (i=0; i<100000; i++) x = qv.compare(a, b);
            // 4ms for 100k
            t.done();
        },
    },
};
