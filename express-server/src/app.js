/* global require */
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const morgan  = require('morgan');
const process = require('process');
const {sequelize} = require('./models')
const config = require('./config/config.js');


const app = express();
app.use(morgan('combined'));
app.use(bodyParser.json())
app.use(cors());


require('../src/routes/routes.js')(app)

app.set('port', process.env.PORT || config.port);


try{
    sequelize.sync().then(() =>{
        app.listen(process.env.PORT || config.port, () => console.log(`App listening on port ${config.port}!`))
    })
}catch(err){
    console.log(`${err}`)
}

