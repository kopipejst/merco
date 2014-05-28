/**
 * Merging, compressing and cache busting for js
 */

/**
 * Module dependencies.
 */

var fs = require('fs'),
    path = require('path'),
    crypto = require('crypto'),
    async = require('async'),
    uglifyJS = require('uglify-js'),
    _ = require('lodash');


/**
 * Default options.
 * @type {{sKey: string, version: number, route: string, filePath: string, buildPath: string}}
 */

var opts = {
    sKey: 'merco_secret_s',
    version: 0,
    route: 'build',
    filePath: path.dirname(require.main.filename) + '/public',
    buildPath: path.dirname(require.main.filename) + '/public/js/build/min/',
    cache: true
};


/**
 * Merco object.
 */

var merco = {};


/**
 * Setup merco middleware.
 * Add function to locals so they can be used from templates.
 *
 * @param options
 * @returns {Function}
 */

merco.init = function (options) {

    opts = _.defaults(options, opts);

    return function (req, res, next) {

        res.locals.js = [];

        /**
         * Store js file name in storage.
         *
         * @param filename
         */

        res.locals.getJS = function (filename) {
            res.locals.js.push(filename);
        };


        /**
         * Print script tag with js path and name.
         *
         * @returns {string}
         */

        res.locals.printJS = function () {

            var i,
                scripts = [];

            if ('noMerge' in req.query) {

                for (i in res.locals.js) {
                    scripts.push('<script src="' + res.locals.js[i] + '"></script>');
                }

                return scripts.join('');
            }

            return '<script src="/' + opts.route + '/' + getHash(res.locals.js) + '.js"></script>';

        };

        next();

    };

};


/**
 * Merge and minify files.
 *
 * @param req
 * @param res
 */

merco.route = function (req, res) {

    var encrypted = req.params.file.replace(/\.js$/, ''),
        hash = crypto.createHash('md5').update(encrypted).digest("hex"),
        file = opts.version + '.' + hash + '.js';

    fs.exists(opts.buildPath + file, function(exists){

        if (opts.cache && exists) {
            return res.sendfile(opts.buildPath + file);
        }

        var i, result,
            files = getFiles(encrypted),
            functions = [];

        for (i in files) {
            files[i] = opts.filePath + files[i];
            functions.push(getFile(files[i]));
        }

        result = uglifyJS.minify(files);

        async.parallel(functions, function (err, results) {

            var mtimestamp = 0,
                mtime = null,
                atime = null;

            for (var i in results) {

                if (results[i].mtime.getTime() > mtimestamp) {

                    mtimestamp = results[i].mtime.getTime();
                    mtime = results[i].mtime;
                    atime = results[i].atime;

                }

            }

            fs.writeFile(opts.buildPath + file, result.code, function (err) {

                if (err) {

                    res.send(500, 'Error building js');

                } else {

                    fs.utimes(opts.buildPath + file, atime, mtime, function (err) {
                        res.sendfile(opts.buildPath + file);
                    });
                }
            });
        });
    });
};


/**
 * Create hash name of merged file names.
 *
 * @param files
 * @returns {*}
 */

function getHash(files) {

    var hash = files.join(';'),
        cipher = crypto.createCipher('aes-256-cbc', opts.sKey),
        encrypted = cipher.update(hash, 'utf8', 'base64');

    encrypted = encrypted + cipher.final('base64');

    return encrypted;

}


/**
 * Get file names from hash.
 *
 * @param hash
 * @returns {Array}
 */

function getFiles(hash) {

    var decrypted,
        decipher = crypto.createDecipher('aes-256-cbc', opts.sKey);

    decrypted = decipher.update(hash, 'base64', 'utf8');
    decrypted = decrypted + decipher.final('utf8');

    return decrypted.split(';');
}


/**
 * Get file stat.
 *
 * @param file
 * @returns {Function}
 */

function getFile(file) {

    return function (callback) {
        fs.stat(file, function (err, result) {
            return callback(err, result);
        });
    };
}

module.exports = merco;