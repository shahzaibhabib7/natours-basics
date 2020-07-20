const mongoose = require('mongoose');
const dotenv = require('dotenv');
// this will read our variables from the file and save them into
// node.js environment variables
dotenv.config({ path: './config.env' });
const app = require('./app');


const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD);

mongoose.connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false
}).then(con => {
    console.log(con.connections);
    console.log('DB Connection Successfull!');
});




// console.log(app.get('env'));
// console.log(process.env);

// const port = process.env.PORT || 3000;

const port = process.env.PORT;

app.listen(port, () => {
    console.log(`App running on port ${port}...`);
});