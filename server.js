const app = require('express')();
const bodyparser = require('body-parser');
const config = require('./module/config');
global.config = require('./module/config');
const mongoose = require('mongoose');
const webRouter = require('./module/routes/web');
const apiRouter = require('./module/routes/api/index');

// Connection to Database
mongoose.connect('mongodb://127.0.0.1:27017/hamtripp');
mongoose.Promise = global.Promise;


app.use(bodyparser.urlencoded({extended:false}));
app.use(bodyparser.json({type:'application/json'}));

app.use('/api', apiRouter)
app.use('/', webRouter);

app.listen(config.port, () => {
    console.log(`server running at port ${config.port}`);
})

