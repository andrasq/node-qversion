qversion
========

quick version number comparator

Compares semantic version numbers.  Semantic version numbers are a dotted
numeric tuple in the form _major . minor . patch_.  QVersion allows any number
of dotted fields, but npm and node use exactly 3.

        QVersion = require('qversion');
        QVersion.version_compare("1.1.2", "1.1.3");     // => -1

        ver = new QVersion();
        ver.match("1.1.3", "1.1.*");                    // => true
        ver.match("1.1.3", "1.1.2,1.1.3");              // => true

## Installation

        npm install qversion
        node_modules/.bin/qunit test-qversion.js

## Functions

### QVersion.version_compare( ver1, ver2 )

compare the two version numbers, return less than zero if ver1 is less than
ver2, 0 if they are the same, greater than zero if ver1 is greater than ver2.

### QVersion.version_match( version, pattern )

compare the version against the pattern for equality, and return true if the
version matches.  The pattern may be specified as a match template or a
comma-separated list of match templates.  Each template may be a:

        1.1.1-1.1.7     range match
        1.1.*           prefix match
        ~1.1            approximate version (TBD: also prefix match?)
        >1.1            relative match (also >=, <, <=)
        *               any version (wildcard match)

### qv = new QVersion( )

QVersion object caches results to speed repeated lookups

### qv.compare( ver1, ver2 )

cached version_compare

### qv.match( patt, ver )

cached version_match


## Todo

- finish Readme
- unit test version_match
- unit test QVersion
- write version_select() to return best match of desired vs available
