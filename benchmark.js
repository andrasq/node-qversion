qversion = require('./qversion');
semver = require('semver');

for (nloops=0; nloops<10; nloops++) {
    t1 = Date.now();
    //for (i=0; i<10000; i++) x = qversion.version_match("v1.1", "1");
    for (i=0; i<10000; i++) x = qversion.version_match("v1.1", "1.2 || 1");
    t2 = Date.now();
    console.log("qversion match", t2-t1, x);

    t1 = Date.now();
    //for (i=0; i<10000; i++) x = semver.satisfies("v1.1.0", "1");
    for (i=0; i<10000; i++) x = semver.satisfies("v1.1.0", "1.2 || 1");
    // "Invalid Version: v1.1"
    t2 = Date.now();
    console.log("semversion satisfies", t2-t1, x);
}
