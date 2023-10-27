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
    app.use('/product', productRouter);
    app.use('/account', accountRouter);
    app.use('/auth', authRouter);
    app.use('/address', addressRouter);
    app.use('/order', orderRouter);
    app.use('/category', categoryRouter);
    app.use('/cart', cartRouter);
    app.use('/chat', chatRouter);
    app.use('/table', tableRouter);
    app.use('/posts', postsRouter);
    app.use('/comments', commentsRouter);
}

module.exports = Route;

export {};
