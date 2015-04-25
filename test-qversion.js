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
            var i;
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
        'should match versions': function(t) {
            cases = [
                // version, pattern, yes/no
                ['1', '*', true],
                ['1.2', '*', true],
                ['1.2.3', '*', true],
                ['1.1.3', '1', true],
                ['1.1.3', '1.1', true],
                ['1.1.3', '1.1.3', true],
                ['1.1.3', '1.1.2', false],
                ['1', '1|2', true],
                ['v1.1', '1.2 || 1', true],
            ];
            var i;
            for (i=0; i<cases.length; i++) {
                var cmp = version_match(cases[i][0], cases[i][1]);
                t.equal(cmp, cases[i][2], cases[i][0] + " :: " + cases[i][1] + " => " + cmp);
            }
            t.done();
        },
    },

    'QVersion': {
        setUp: function(done) {
            this.qv = new QVersion();
            done();
        },

        'should use passed-in compare and match functions and caches results': function(t) {
            var called = 0;
            var qv = new QVersion({
                version_compare: function(a,b){ called += 1; return 0; },
                version_match: function(a,b){ called += 1; return 0; },
            });
            qv.compare("1.2.3", "1.2");
            t.equal(called, 1, "called our compare");
            qv.match("1.2.3", "~1");
            t.equal(called, 2, "called our match");
            qv.compare("1.2.3", "1.2");
            t.equal(called, 2, "cached compare result");
            qv.match("1.2.3", "~1");
            t.equal(called, 2, "cached match result");
            t.done();
        },

        'speed of 100k compares': function(t) {
            var a = "1.2.3", b = "1.2.4";
            var i, x, qv = this.qv;
            for (i=0; i<100000; i++) x = qv.compare(a, b);
            // 3.6ms for 100k
            t.done();
        },
    },
};
