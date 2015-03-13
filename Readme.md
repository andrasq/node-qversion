qversion
========

quick version number comparator

Compares semantic version numbers.  Semantic version numbers are a dotted
numeric tuple in the form _major . minor . patch_.  QVersion allows any number
of dotted fields, but npm and node use exactly 3.

WORK IN PROGRESS

        QVersion = require('qversion');
        QVersion.version_compare("1.1.2", "1.1.3");     // => -1

        ver = new QVersion();
        ver.match("1.1.*", "1.1.3");                    // => true
        ver.match("1.1.2,1.1.3", "1.1.3");              // => true

## Functions

### QVersion.version_compare( ver1, ver2 )

compare the two version numbers, return less than zero if ver1 is less than
ver2, 0 if they are the same, greater than zero if ver1 is greater than ver2.

### QVersion.version_match( pattern, version )

test the version against the pattern, and return true if the version matches

### qv = new QVersion( )

QVersion object caches results to speed repeated lookups

### qv.compare( ver1, ver2 )

cached version_compare

### qv.match( patt, ver )

cached version_match
