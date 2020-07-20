const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Tour = require('./../../models/tourModel');
const { deleteMany } = require('./../../models/tourModel');
// this will read our variables from the file and save them into
// node.js environment variables
dotenv.config({ path: './config.env' });

const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD);

mongoose.connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false
}).then(con => {
    console.log(con.connections);
    console.log('DB Connection Successfull!');
});

// Read JSON file
const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours-simple.json`, 'utf-8'));

// import data into the databse
const importData = async () => {
    try {
        await Tour.create(tours);
        console.log('Data Successfully loaded!');
    } catch (err) {
        console.log(err);
    }
    process.exit();
}

// delete all data from collection
const deleteData = async () => {
    try {
        await Tour.deleteMany();
        console.log('Data Successfully deleted!');
        process.exit();
    } catch (err) {
        console.log(err);
    }
}

if (process.argv[2] === '--import') {
    importData();
} else if (process.argv[2] === '--delete') {
    deleteData();
}

console.log(process.argv);