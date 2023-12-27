const productRouter = require('./product');
const accountRouter = require('./account');
const authRouter = require('../auth/authRouter');
const addressRouter = require('./address');
const orderRouter = require('./order');
const categoryRouter = require('./category');
const cartRouter = require('./cart');
const chatRouter = require('./chat');
const tableRouter = require('./table');
const postsRouter = require('./posts');
const commentsRouter = require('./comments');

function Route(app: any) {
    app.use('/api/product', productRouter);
    app.use('/api/account', accountRouter);
    app.use('/api/auth', authRouter);
    app.use('/api/address', addressRouter);
    app.use('/api/order', orderRouter);
    app.use('/api/category', categoryRouter);
    app.use('/api/cart', cartRouter);
    app.use('/api/chat', chatRouter);
    app.use('/api/table', tableRouter);
    app.use('/api/posts', postsRouter);
    app.use('/api/comments', commentsRouter);
}

module.exports = Route;

export {};
