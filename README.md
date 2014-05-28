***Merco*** is Express middleware for merging and minifying JS files in run time. It also support cache busting.


How to use it ?
==

install merco module:

- `npm install merco`


use merco as middleware:

- `app.use(merco.init(params));`


set route from which you want to serve files:

- `app.get('/build/*', merco.route);`

use it in template (.ejs):

    <% getJS('PATH/TO/FILE1') %>
    <% getJS('PATH/TO/FILE2') %>

    <%= printJS() %>


Params
==

***route*** - route from which you want to serve files

***version*** - cache buster, good practice is to use package.version

***filePath*** - location of raw js files

***buildPath*** - location where processed files should be stored (need write permissions on that folder)

***sKey*** - secret key that will be used for encryption

***cache*** - default true, in dev environment set cache to false

Why run time ?
==
- in case of large application and big number of files doing this in run time is much more convinient
- this is also useful in case of multivariant tests when we want to have different js for different variants
- it's easier to use in some case

Notes
==

For better performance use caching on nginx or akamai.


