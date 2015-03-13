/**
 * qversion -- basic version number management
 *
 * 2015-03-11 - AR.
 */

module.exports = QVersion;

QVersion.version_compare = version_compare;

/**
 * compare two semantic version numbers a and b,
 * return -1 if a is less than, 1 if a is greater than b,
 * 0 if they are the same.
 */
function version_compare( a, b ) {
    var aa = a.split('.');
    var bb = b.split('.');
    for (var i=0; i<aa.length; i++) {
        var ai = aa[i], bi = bb[i];
        if (ai !== bi) {
            if (!bi) return 1;                          // bb was prefix of aa, aa >
            else if (!ai) return -1;                    // aa empty
            return parseInt(ai, 10) - parseInt(bi, 10); // versions differ
        }
    }
    if (aa.length < bb.length) return -1;               // aa was prefix of bb, aa <
    return 0;
}

function isPrefix( prefix, string ) {
    var len = prefix.length;
    for (var i=0; i<len; i++) {
        if (prefix.charCodeAt(i) !== string.charCodeAt(i)) return false;
    }
    return true;
}

/**
 * test whether the version pattern p matches the version v
 * Patterns can look like "~1.1", "1.1.*", "1.1.7"
 */
function version_match( p, v ) {
    // FIXME: match pattern p to version v
    if (p.indexOf(',') >= 0) {
        // comma-list of patterns, match any one
        var patterns = p.split(',');
        for (var i=0; i<patterns.length; i++) {
            if (version_match(patterns[i], v)) return true;
        }
        return false;
    }
    else if (p.indexOf('-') >= 0) {
        // range match (inclusive), both endpoints must match
        var pp = p.split('-');
        return version_compare(pp[0], v) >= 0 && version_compare(v, pp[1]) <= 0;
    }
    else if (p.indexOf('*') >= 0) {
        // prefix match: 1.1.* matches 1.1.7 but not 1.2.0
        return isPrefix(p.slice(0, p.indexOf('*')), v);
    }
    else if (p[0] === '~') {
        // prefix match: ~1.1 matches 1.1.7 but not 1.2.0
        // TODO: bracket the max distance?
        return isPrefix(p.slice(1), v);
    }
    else if (p[0] === '>') {
        // version v is at least p (>=) or greater than p (>)
        if (p[1] === '=') return version_match(p.slice(2), v) >= 0;
        else return version_match(p.slice(1), v) > 0;
    }
    else if (p[0] === '<') {
        // version v is at most p (<=) or less than p (<)
        if (p[1] === '=') return version_match(v, p.slice(2)) <= 0;
        else return version_match(v, p.slice(1)) < 0;
    }
    else {
        // exact match is default, ie 1.1 does not match 1.1.7
        return version_compare(p, v);
    }
    return false;
}

function QVersion( ) {
    this.compareCache = {};
    this.matchCache = {};
}
QVersion.prototype = {
    compare:
    function compare( a, b) {
        if (this.compareCache[a]) {
            var diff = this.compareCache[a][b];
            return (diff !== undefined) ? diff : this.compareCache[a][b] = version_compare(a, b);
        }
        else {
            this.compareCache[a] = {};
            return this.compareCache[a][b] = version_compare(a, b);
        }
    },

    match:
    function match( a, b ) {
        if (this.matchCache[a]) {
            var diff = this.matchCache[a][b];
            return (diff !== undefined) ? diff : this.matchCache[a][b] = version_match(a, b);
        }
        else {
            this.matchCache[a] = {};
            return this.matchCache[a][b] = version_match(a, b);
        }
    },

    flush:
    function flush( ) {
        this.compareCache = {};
    },
};

// quicktest:

///**

assert = require('assert');

data = [
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
for (i=0; i<data.length; i++) {
    var diff = version_compare(data[i][0], data[i][1]);
    switch (data[i][2]) {
    case -1:
        assert(diff < 0,  data[i][0] + " .lt. " + data[i][1] + ", was " + diff);
        break;
    case 0:
        assert(diff == 0, data[i][0] + " .eq. " + data[i][1] + ", was " + diff);
        break;
    case 1:
        assert(diff > 0,  data[i][0] + " .gt. " + data[i][1] + ", was " + diff);
        break;
    }
}

timeit = require('arlib/timeit');

var a = "1.2.3";
var b = "1.2.3";
var x;
timeit(1000000, function(){ x = version_compare(a, b) });
console.log(x);
// 3.8m/s split (3.4m/s as floats)

vc = new QVersion();
timeit(1000000, function(){ x = vc.compare(a, b) });
console.log(x);
// 25m/s

timeit(1000000, function(){ x = vc.match(a, b) });

/**/
