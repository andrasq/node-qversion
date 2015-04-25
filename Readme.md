qversion
========

quick version number comparator

Compares semantic version numbers.  Semantic version numbers are a dotted
numeric tuple in the form _major . minor . patch_.  QVersion allows any number
of dotted fields, but npm and node use exactly 3.

        QVersion = require('qversion');
        QVersion.version_compare("1.1.2", "1.1.10");    // => -1

        ver = new QVersion();
        ver.match("1.1.3", "1.1.*");                    // => true
        ver.match("1.1.3", "1.1.2,1.1.3");              // => true


## Installation

        npm install qversion
        qunit test-qversion.js

If you already have semver installed, you can run the benchmark:

        $ node node_modules/qversion/benchmark.js
        qversion match 23 true
        semversion satisfies 368 true
        qversion match 15 true
        semversion satisfies 339 true

## Functions

### QVersion.version_compare( ver1, ver2 )

compare the two version numbers, return less than zero if ver1 is less than
ver2, 0 if they are the same, greater than zero if ver1 is greater than ver2.
A match has to be exact, `1` is not `1.0` is not `1.0.0`.

### QVersion.version_match( version, pattern )

test the version against the pattern, and return `true` if the version
matches.  The pattern may be specified as a match template or a
comma-separated list of templates.  Each template may be a:

        1.1,1.2         comma-list of templates
        1.1.1-1.1.7     range match
        1.1.*           prefix match
        1.1.x           prefix match (same as 1.1.*)
        1.1             prefix match (same as 1.1.*)
        >1.1            relative match (also >=, <, <=)
        *               any version (wildcard match)

The semantics of approximate match `~1.1` are not yet well defined; currently it is
implemented as a prefix match.

### qv = new QVersion( [options] )

QVersion object caches results to speed repeated lookups

Options:

- `version_compare` - function that compares two versions and returns -1, 0 or 1 as above
- `version_match` - function that matches a version against a pattern as above

### qv.compare( ver1, ver2 )

cached version_compare

### qv.match( ver, patt )

cached version_match


## Limitations

- QVersion does not implement full [SemVer](http://semver.org) semantics
- patch suffixes (eg 1.2.1-patch3) are not supported

## Todo

- unit test version_match
- unit test QVersion
- write a version_select() that returns best match of desired vs available
- support non-numeric version numbers?

## Related Work

- [semver](https://npmjs.org/package/semver)
- [semver.org](http://semver.org)
