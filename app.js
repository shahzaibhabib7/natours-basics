const express = require('express');
const morgan = require('morgan');

// after new project structure video
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');


//////////////////////////////////////////////////////////////////////////////////
// SETTING UP EXPRESS AND BASIC ROUTING
//////////////////////////////////////////////////////////////////////////////////

/*
// STEP 1
// "express" is a function, which upon calling will add a bunch of methods
// to our "app" variable here.
const app = express();


// STEP 3 - Define Route
// Routing means basically to determine how an application responds to a certain 
// client request, so to a certain URL.
// actually it is not just the URL, but also the HTTP method which is used for that 
// request. (remember that from http lecture we had before)

// again route is just a URL, which in this case is just the root URL and also the
// HTTP method, which is "get. what we want to happen when someone hits that URL 
// with the "get" request goes into the callback function.
app.get('/', (req, res) => {
    // so the node app or express app is all about request and responses, simply 
    // because this is how the web actually works.
    // res.send('Hello, from the server side!');

    // by using this json method here, will automatically set our content type to
    // "application/json"
    res.status(200).json({ message: 'Hello, from the server side!', app: 'Natours' });
});

app.post('/', (req, res) => {
    res.send('You can post to this endpoint...');
});



// STEP 2
const port = 3000;
// callback function that will be called as soon as the server starts listening
app.listen(port, () => {
    console.log(`App running on port ${port}...`);
});
*/



//////////////////////////////////////////////////////////////////////////////////
// STARTING OUR API - HANDLING GET REQUEST
//////////////////////////////////////////////////////////////////////////////////

/*

// STEP 1
// "express" is a function, which upon calling will add a bunch of methods
// to our "app" variable here.
const app = express();
// STEP 6
// "express.json()" is Middleware - just a function that can modify the 
// incomming request data. it is called middleware because it stands in
// middle of the request and the response. so it is just a step that the 
// request goes through while it is being processed. 
// and the step the request goes through in this example is simply that 
// the data from the body is added to it, so added to the request object.
app.use(express.json());


// STEP 4
// Reading data
const tours = JSON.parse(fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`));


// STEP 3
// we always should specify the version of the API, we could also do it in
// the SUBDOMAIN
app.get('/api/v1/tours', (req, res) => {
    // before sending the tours data we need to actually read the data
    res.status(200).json({
        status: 'success',
        results: tours.length,
        data: {
            tours
        }
    });
});



// using ":" we created a variabe called "id"
// for multiple variables '/api/v1/tours/:id:name:age'
// we can also have optional parameters using ":variableName?"
app.get('/api/v1/tours/:id', (req, res) => {
    console.log(req.param);

    // we need to convert parameter variables from string to number
    // multiplying a number of type string to a number converts it
    // into a number
    const id = req.params.id * 1;

    // find method will basically create an array which only conatin
    // the element where the condition is true.
    const tour = tours.find(el => el.id === id);

    // to check if the user is not requesting a data that does not exist
    // if (id > tours.length)
    if (!tour) {
        return res.status(404).json({
            status: 'fail',
            message: 'Invalid ID'
        });
    }

    res.status(200).json({
        status: 'success',
        data: {
            tour
        }
    });
});



// STEP 5
app.post('/api/v1/tours', (req, res) => {
    // with POST request we can send data from client to the server
    // and this data is ideally available on the request.
    // so the "req" object holds all the data so all the information
    // about the request that was done and if the request contain
    // some data that was sent well than that data should be on the 
    // request.
    // Express does not put that body data on the request, and so in 
    // order to have that data available, we have to use something
    // called "MIDDLEWARE".
    // so "body" is the property that is gonna be available on the 
    // request because we used that middleware
    // console.log(req.body);

    // first thing we need to do is to figure out the id for the new
    // object. Remember from the REST APIs, is that when we create a
    // new object, we never specify the id of the new object. The DB
    // usually takes care of that. 
    // but in this case we do not have any DB, so we are gonna take
    // the id of the last object then add 1 to that.
    const newID = tours[tours.length - 1].id + 1;
    // allows us to create a new object by merging two existing object
    // together
    const newTour = Object.assign({ id: newID }, req.body);
    tours.push(newTour);

    fs.writeFile(`${__dirname}/dev-data/data/tours-simple.json`, JSON.stringify(tours), err => {
        res.status(201).json({
            status: 'success',
            data: {
                tour: newTour
            }
        });
    });

    // so we always need to send back something in order to finish the 
    // request/response cycle.
    // res.send('Done');
});


app.patch('/api/v1/tours/:id', (req, res) => {

    // to check if the user is not requesting a data that does not exist
    if (req.params.id * 1 > tours.length) {
        return res.status(404).json({
            status: 'fail',
            message: 'Invalid ID'
        });
    }

    res.status(200).json({
        status: 'success',
        data: {
            tours: '<Updated tour here...>'
        }
    });
});


app.delete('/api/v1/tours/:id', (req, res) => {

    // to check if the user is not requesting a data that does not exist
    if (req.params.id * 1 > tours.length) {
        return res.status(404).json({
            status: 'fail',
            message: 'Invalid ID'
        });
    }

    // 204 means "No Content"
    res.status(204).json({
        status: 'success',
        data: null
    });
});



// STEP 2
const port = 3000;
// callback function that will be called as soon as the server starts listening
app.listen(port, () => {
    console.log(`App running on port ${port}...`);
});
*/




//////////////////////////////////////////////////////////////////////////////////
// REFACTORING OUR ROUTES
//////////////////////////////////////////////////////////////////////////////////

/*

// STEP 1
// "express" is a function, which upon calling will add a bunch of methods
// to our "app" variable here.
const app = express();
// STEP 6
// "express.json()" is Middleware - just a function that can modify the 
// incomming request data. it is called middleware because it stands in
// middle of the request and the response. so it is just a step that the 
// request goes through while it is being processed. 
// and the step the request goes through in this example is simply that 
// the data from the body is added to it, so added to the request object.
app.use(express.json());
// STEP 4
// Reading data
const tours = JSON.parse(fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`));


const getAllTours = (req, res) => {
    // before sending the tours data we need to actually read the data
    res.status(200).json({
        status: 'success',
        results: tours.length,
        data: {
            tours
        }
    });
};

const getTour = (req, res) => {
    console.log(req.param);

    // we need to convert parameter variables from string to number
    // multiplying a number of type string to a number converts it
    // into a number
    const id = req.params.id * 1;

    // find method will basically create an array which only conatin
    // the element where the condition is true.
    const tour = tours.find(el => el.id === id);

    // to check if the user is not requesting a data that does not exist
    // if (id > tours.length)
    if (!tour) {
        return res.status(404).json({
            status: 'fail',
            message: 'Invalid ID'
        });
    }

    res.status(200).json({
        status: 'success',
        data: {
            tour
        }
    });
};

const createTour = (req, res) => {
    const newID = tours[tours.length - 1].id + 1;
    // allows us to create a new object by merging two existing object
    // together
    const newTour = Object.assign({ id: newID }, req.body);
    tours.push(newTour);

    fs.writeFile(`${__dirname}/dev-data/data/tours-simple.json`, JSON.stringify(tours), err => {
        res.status(201).json({
            status: 'success',
            data: {
                tour: newTour
            }
        });
    });

    // so we always need to send back something in order to finish the 
    // request/response cycle.
    // res.send('Done');
};

const updateTour = (req, res) => {

    // to check if the user is not requesting a data that does not exist
    if (req.params.id * 1 > tours.length) {
        return res.status(404).json({
            status: 'fail',
            message: 'Invalid ID'
        });
    }

    res.status(200).json({
        status: 'success',
        data: {
            tours: '<Updated tour here...>'
        }
    });
}

const deleteTour = (req, res) => {

    // to check if the user is not requesting a data that does not exist
    if (req.params.id * 1 > tours.length) {
        return res.status(404).json({
            status: 'fail',
            message: 'Invalid ID'
        });
    }

    // 204 means "No Content"
    res.status(204).json({
        status: 'success',
        data: null
    });
}



// // we always should specify the version of the API, we could also do it in
// // the SUBDOMAIN
// app.get('/api/v1/tours', getAllTours);
// // using ":" we created a variabe called "id"
// // for multiple variables '/api/v1/tours/:id:name:age'
// // we can also have optional parameters using ":variableName?"
// app.get('/api/v1/tours/:id', getTour);
// // STEP 5
// app.post('/api/v1/tours', createTour);
// app.patch('/api/v1/tours/:id', updateTour);
// app.delete('/api/v1/tours/:id', deleteTour);



app.route('/api/v1/tours').get(getAllTours).post(createTour);
app.route('/api/v1/tours/:id').get(getTour).patch(updateTour).delete(deleteTour);


// STEP 2
const port = 3000;
// callback function that will be called as soon as the server starts listening
app.listen(port, () => {
    console.log(`App running on port ${port}...`);
});

*/



//////////////////////////////////////////////////////////////////////////////////
// CREATING OUR OWN MIDDLEWARE
//////////////////////////////////////////////////////////////////////////////////

/*

const app = express();
app.use(express.json());

// our own middleware
// this middleware applies to each and every single request. And that's
// because we didn't specify any route.
app.use((req, res, next) => {
    console.log('Hello from the middleware :)');

    // if we dont call next function then the request-response cycle
    // will really be stuck at this point. we wouldn't be able to move 
    // on and would never ever send back response to the client.
    next();
});

app.use((req, res, next) => {
    // so pretend we have some route handler that really needs the 
    // information about when exactly the request happens.
    req.requestTime = new Date().toISOString();
    next();
});

// Reading data
const tours = JSON.parse(fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`));


const getAllTours = (req, res) => {
    console.log(req.requestTime);
    // before sending the tours data we need to actually read the data
    res.status(200).json({
        status: 'success',
        requestedAt: req.requestTime,
        results: tours.length,
        data: {
            tours
        }
    });
};

const getTour = (req, res) => {
    console.log(req.param);
    const id = req.params.id * 1;
    // find method will basically create an array which only conatin
    // the element where the condition is true.
    const tour = tours.find(el => el.id === id);

    // to check if the user is not requesting a data that does not exist
    // if (id > tours.length)
    if (!tour) {
        return res.status(404).json({
            status: 'fail',
            message: 'Invalid ID'
        });
    }

    res.status(200).json({
        status: 'success',
        data: {
            tour
        }
    });
};

const createTour = (req, res) => {
    const newID = tours[tours.length - 1].id + 1;
    // allows us to create a new object by merging two existing object
    // together
    const newTour = Object.assign({ id: newID }, req.body);
    tours.push(newTour);

    fs.writeFile(`${__dirname}/dev-data/data/tours-simple.json`, JSON.stringify(tours), err => {
        res.status(201).json({
            status: 'success',
            data: {
                tour: newTour
            }
        });
    });

    // so we always need to send back something in order to finish the 
    // request/response cycle.
    // res.send('Done');
};

const updateTour = (req, res) => {

    // to check if the user is not requesting a data that does not exist
    if (req.params.id * 1 > tours.length) {
        return res.status(404).json({
            status: 'fail',
            message: 'Invalid ID'
        });
    }

    res.status(200).json({
        status: 'success',
        data: {
            tours: '<Updated tour here...>'
        }
    });
}

const deleteTour = (req, res) => {

    // to check if the user is not requesting a data that does not exist
    if (req.params.id * 1 > tours.length) {
        return res.status(404).json({
            status: 'fail',
            message: 'Invalid ID'
        });
    }

    // 204 means "No Content"
    res.status(204).json({
        status: 'success',
        data: null
    });
}


app.route('/api/v1/tours').get(getAllTours).post(createTour);
app.route('/api/v1/tours/:id').get(getTour).patch(updateTour).delete(deleteTour);


// STEP 2
const port = 3000;
// callback function that will be called as soon as the server starts listening
app.listen(port, () => {
    console.log(`App running on port ${port}...`);
});

*/




//////////////////////////////////////////////////////////////////////////////////
// USING 3RD-PARTY MIDDLEWARE
//////////////////////////////////////////////////////////////////////////////////

/*

const app = express();
app.use(express.json());


// 1) MIDDLEWARES
// argument to morgan() is how we want the logging to look like
app.use(morgan('dev'));
// calling the morgan function will return a function similar to the 
// one passed to our own middlewares. 

// our own middleware
// this middleware applies to each and every single request. And that's
// because we didn't specify any route.
app.use((req, res, next) => {
    console.log('Hello from the middleware :)');

    // if we dont call next function then the request-response cycle
    // will really be stuck at this point. we wouldn't be able to move 
    // on and would never ever send back response to the client.
    next();
});

app.use((req, res, next) => {
    // so pretend we have some route handler that really needs the 
    // information about when exactly the request happens.
    req.requestTime = new Date().toISOString();
    next();
});

// Reading data
const tours = JSON.parse(fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`));


// 2) ROUTE HANDLERS
const getAllTours = (req, res) => {
    console.log(req.requestTime);
    // before sending the tours data we need to actually read the data
    res.status(200).json({
        status: 'success',
        requestedAt: req.requestTime,
        results: tours.length,
        data: {
            tours
        }
    });
};

const getTour = (req, res) => {
    console.log(req.param);
    const id = req.params.id * 1;
    // find method will basically create an array which only conatin
    // the element where the condition is true.
    const tour = tours.find(el => el.id === id);

    // to check if the user is not requesting a data that does not exist
    // if (id > tours.length)
    if (!tour) {
        return res.status(404).json({
            status: 'fail',
            message: 'Invalid ID'
        });
    }

    res.status(200).json({
        status: 'success',
        data: {
            tour
        }
    });
};

const createTour = (req, res) => {
    const newID = tours[tours.length - 1].id + 1;
    // allows us to create a new object by merging two existing object
    // together
    const newTour = Object.assign({ id: newID }, req.body);
    tours.push(newTour);

    fs.writeFile(`${__dirname}/dev-data/data/tours-simple.json`, JSON.stringify(tours), err => {
        res.status(201).json({
            status: 'success',
            data: {
                tour: newTour
            }
        });
    });

    // so we always need to send back something in order to finish the 
    // request/response cycle.
    // res.send('Done');
};

const updateTour = (req, res) => {

    // to check if the user is not requesting a data that does not exist
    if (req.params.id * 1 > tours.length) {
        return res.status(404).json({
            status: 'fail',
            message: 'Invalid ID'
        });
    }

    res.status(200).json({
        status: 'success',
        data: {
            tours: '<Updated tour here...>'
        }
    });
}

const deleteTour = (req, res) => {

    // to check if the user is not requesting a data that does not exist
    if (req.params.id * 1 > tours.length) {
        return res.status(404).json({
            status: 'fail',
            message: 'Invalid ID'
        });
    }

    // 204 means "No Content"
    res.status(204).json({
        status: 'success',
        data: null
    });
}


// 3) ROUTES
app.route('/api/v1/tours').get(getAllTours).post(createTour);
app.route('/api/v1/tours/:id').get(getTour).patch(updateTour).delete(deleteTour);


// 4) START THE SERVER
// STEP 2
const port = 3000;
// callback function that will be called as soon as the server starts listening
app.listen(port, () => {
    console.log(`App running on port ${port}...`);
});

*/


//////////////////////////////////////////////////////////////////////////////////
// IMPLEMENTING USERS ROUTE
//////////////////////////////////////////////////////////////////////////////////

/*

const app = express();
app.use(express.json());


// 1) MIDDLEWARES
// argument to morgan() is how we want the logging to look like
app.use(morgan('dev'));
// calling the morgan function will return a function similar to the 
// one passed to our own middlewares. 

// our own middleware
// this middleware applies to each and every single request. And that's
// because we didn't specify any route.
app.use((req, res, next) => {
    console.log('Hello from the middleware :)');

    // if we dont call next function then the request-response cycle
    // will really be stuck at this point. we wouldn't be able to move 
    // on and would never ever send back response to the client.
    next();
});

app.use((req, res, next) => {
    // so pretend we have some route handler that really needs the 
    // information about when exactly the request happens.
    req.requestTime = new Date().toISOString();
    next();
});

// Reading data
const tours = JSON.parse(fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`));


// 2) ROUTE HANDLERS
const getAllTours = (req, res) => {
    console.log(req.requestTime);
    // before sending the tours data we need to actually read the data
    res.status(200).json({
        status: 'success',
        requestedAt: req.requestTime,
        results: tours.length,
        data: {
            tours
        }
    });
};

const getTour = (req, res) => {
    console.log(req.param);
    const id = req.params.id * 1;
    // find method will basically create an array which only conatin
    // the element where the condition is true.
    const tour = tours.find(el => el.id === id);

    // to check if the user is not requesting a data that does not exist
    // if (id > tours.length)
    if (!tour) {
        return res.status(404).json({
            status: 'fail',
            message: 'Invalid ID'
        });
    }

    res.status(200).json({
        status: 'success',
        data: {
            tour
        }
    });
};

const createTour = (req, res) => {
    const newID = tours[tours.length - 1].id + 1;
    // allows us to create a new object by merging two existing object
    // together
    const newTour = Object.assign({ id: newID }, req.body);
    tours.push(newTour);

    fs.writeFile(`${__dirname}/dev-data/data/tours-simple.json`, JSON.stringify(tours), err => {
        res.status(201).json({
            status: 'success',
            data: {
                tour: newTour
            }
        });
    });

    // so we always need to send back something in order to finish the 
    // request/response cycle.
    // res.send('Done');
};

const updateTour = (req, res) => {

    // to check if the user is not requesting a data that does not exist
    if (req.params.id * 1 > tours.length) {
        return res.status(404).json({
            status: 'fail',
            message: 'Invalid ID'
        });
    }

    res.status(200).json({
        status: 'success',
        data: {
            tours: '<Updated tour here...>'
        }
    });
}

const deleteTour = (req, res) => {

    // to check if the user is not requesting a data that does not exist
    if (req.params.id * 1 > tours.length) {
        return res.status(404).json({
            status: 'fail',
            message: 'Invalid ID'
        });
    }

    // 204 means "No Content"
    res.status(204).json({
        status: 'success',
        data: null
    });
}

const getAllUsers = (req, res) => {
    res.status(500).json({
        status: 'error',
        message: 'This route is not yet defined!'
    });
}

const getUser = (req, res) => {
    res.status(500).json({
        status: 'error',
        message: 'This route is not yet defined!'
    });
}

const createUser = (req, res) => {
    res.status(500).json({
        status: 'error',
        message: 'This route is not yet defined!'
    });
}

const updateUser = (req, res) => {
    res.status(500).json({
        status: 'error',
        message: 'This route is not yet defined!'
    });
}

const deleteUser = (req, res) => {
    res.status(500).json({
        status: 'error',
        message: 'This route is not yet defined!'
    });
}


// 3) ROUTES
// we created a new router and saved it into a new variable
const tourRouter = express.Router();
tourRouter.route('/').get(getAllTours).post(createTour);
tourRouter.route('/:id').get(getTour).patch(updateTour).delete(deleteTour);

const userRouter = express.Router();
userRouter.route('/').get(getAllUsers).post(createUser);
userRouter.route('/:id').get(getUser).patch(updateUser).delete(deleteUser);

// This process is called Mounting the Router, so mounting a new 
// router on a route basically. This should come after all these
// definitions or atleast after declaring the variable.
app.use('api/v1/tours', tourRouter);
app.use('api/v1/users', userRouter);


// 4) START THE SERVER
// STEP 2
const port = 3000;
// callback function that will be called as soon as the server starts listening
app.listen(port, () => {
    console.log(`App running on port ${port}...`);
});

*/



//////////////////////////////////////////////////////////////////////////////////
// A BETTER FILE STRUCTURE
//////////////////////////////////////////////////////////////////////////////////


const app = express();



// 1) MIDDLEWARES
if (process.env.NODE_ENV === 'development') {
    // argument to morgan() is how we want the logging to look like
    app.use(morgan('dev'));
    // calling the morgan function will return a function similar to the 
    // one passed to our own middlewares. 
}

app.use(express.json());

app.use(express.static(`${__dirname}/public`));

// our own middleware
// this middleware applies to each and every single request. And that's
// because we didn't specify any route.
app.use((req, res, next) => {
    console.log('Hello from the middleware :)');

    // if we dont call next function then the request-response cycle
    // will really be stuck at this point. we wouldn't be able to move 
    // on and would never ever send back response to the client.
    next();
});

app.use((req, res, next) => {
    // so pretend we have some route handler that really needs the 
    // information about when exactly the request happens.
    req.requestTime = new Date().toISOString();
    next();
});



// 2) ROUTE HANDLERS


// 3) ROUTES
// This process is called Mounting the Router, so mounting a new 
// router on a route basically. This should come after all these
// definitions or atleast after declaring the variable.
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

module.exports = app;