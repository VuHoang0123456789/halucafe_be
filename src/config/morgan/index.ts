const morgan = require('morgan');

function MorganFunc(app: any) {
    app.use(
        morgan(function (tokens: any, req: any, res: any) {
            return [
                'method: ' + tokens.method(req, res),
                'url: ' + tokens.url(req, res),
                'status: ' + tokens.status(req, res),
                'content-length: ' + tokens.res(req, res, 'content-length'),
                'response-time: ' + tokens['response-time'](req, res) + 'ms',
            ].join(', ');
        }),
    );
}

module.exports = MorganFunc;

export {};
