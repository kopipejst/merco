***Merco*** is solution to merge and minify JS files in run time. It's also a cache buster.

[![Build Status](https://travis-ci.org/kopipejst/merco.png)](https://travis-ci.org/kopipejst/merco)

Why run time ?
==
- in case of large application and big number of files run time is much more convinient than build time
- this is also useful in case of multivariant tests when we want to have different js for different variants
- it's easier to use in some case


How to use it ?
==

install merco module:

- `npm install merco`


use merco as middleware:

- `app.use(merco.init(params));`


set route from which you want to serve files:

- `app.get('/build', merco.route);`


Params
==

***route*** - route from which you want to serve files

***version*** - cache buster, good practice is to use package.version

***filePath*** - location of raw js files

***buildPath*** - location where processed files should be stored (need write permissions on that folder)

***sKey*** - secret key that will be used for encryption

***cache*** - default true, in dev environment set cache to false

Notes
==

For better performance use caching on nginx or akamai.


