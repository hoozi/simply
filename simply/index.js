/**
 * simply
 */
var response = require("./libs/response");
exports.App = require("./libs/App.js");
exports.static = require("./libs/static.js");
exports.query = require("./libs/query.js");
exports.post = require("./libs/post.js");
exports.mypost = require("./libs/mypost.js");
exports.text = response.text;
exports.redirect = response.redirect;
exports.download = response.download;
exports.view = response.view;