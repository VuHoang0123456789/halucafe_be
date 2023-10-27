"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const morgan = require('morgan');
function MorganFunc(app) {
    app.use(morgan(function (tokens, req, res) {
        return [
            'method: ' + tokens.method(req, res),
            'url: ' + tokens.url(req, res),
            'status: ' + tokens.status(req, res),
            'content-length: ' + tokens.res(req, res, 'content-length'),
            'response-time: ' + tokens['response-time'](req, res) + 'ms',
        ].join(', ');
    }));
}
module.exports = MorganFunc;
