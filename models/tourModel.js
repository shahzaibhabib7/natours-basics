const mongoose = require('mongoose');
const slugify = require('slugify');
const validator = require('validator');



const tourSchema = new mongoose.Schema({
    name: {
        type: String,
        // This is called VALIDATOR
        required: [true, 'A tour must have a name'],
        unique: true,
        trim: true,
        maxlength: [40, 'A tour name must have less or equal then 40 characters'],
        minlength: [10, 'A tour name must have more or equal then 10 characters'],
        // validate: [validator.isAlpha, 'Tour name must only contain characters']
    },
    slug: String,
    duration: {
        type: Number,
        required: [true, 'A tour must have a duration']
    },
    maxGroupSize: {
        type: Number,
        required: [true, 'A tour must have a group size']
    },
    difficulty: {
        type: String,
        required: [true, 'A tour must have a difficulty'],
        enum: {
            values: ['easy', 'medium', 'difficult'],
            message: 'Difficulty is either: easy, medium or difficult'
        }
    },
    ratingsAverage: {
        type: Number,
        default: 4.5,
        min: [1, 'Rating must be above 1.0'],
        max: [5, 'Rating must be below 5.0']
    },
    ratingsQuantity: {
        type: Number,
        default: 0
    },
    price: {
        type: Number,
        required: [true, 'A tour must have a price']
    },
    priceDiscount: {
        type: Number,
        validate: {
            validator: function (val) {
                // This function will only run for creating new document
                // not for updating
                return val < this.price;
            },
            message: 'Discount price ({VALUE}) should be below regular price'
        }
    },
    summary: {
        type: String,
        trim: true,
        required: [true, 'A tour must have a description']
    },
    description: {
        type: String,
        trim: true
    },
    imageCover: {
        // actually the name of the image, we store images in the 
        // filesystem and store their names in the DB
        type: String,
        required: [true, 'A tour must have a cover image']
    },
    // array of names of type Strings
    images: [String],
    // should be a timestamp that is set by the time that user gets
    // s new tour. and then converted from timestamp to Date by
    // mongoose
    createdAt: {
        type: Date,
        default: Date.now(),
        select: false
    },
    startDates: [Date],
    secretTour: {
        type: Boolean,
        default: false
    }
}, {
    // another object for schema options
    // we need to explicitly define that we need the virtual property
    // in out output
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// we define that VIRTUAL PROPERTIES in the tour schema
// this virtual property will be created each time we "get" some data
// out of the database
// using regular function here because an arrow function does not get
// it's own "this" keyword because the "this" keyword in this case is
// going to be pointing to the current document.
// and usually when we want to use "this" we use a regular function.
tourSchema.virtual('durationWeeks').get(function () {
    return this.duration / 7;
});

// pre middleware - runs before an actual event. and that event in this 
// case is the save event.
// DOCUMENT MIDDLEWARE - runs before .save() and .create() but not on
// .insertMany() 
tourSchema.pre('save', function (next) {
    // this function will be called before an actual document is saved to
    // the DB
    // in the save middleware "this" will point to the currently processed
    // document and that is reason it is called document middleware. 
    // because in this function we have access to the currently processed
    // document, in this case the document that is being saved.
    // console.log(this);

    // SLUG - slug is basically just a string that we can put on the URL,
    // usually based on some string like the name
    this.slug = slugify(this.name, { lower: true });
    // if we have only one middleware function like this one then we dont 
    // need the next() to be called but good to do so
    next();
});

/*
// we can have multiple "pre" and "post" middlewares for the same hook
// and HOOK is what we call the 'save' in tourSchema.post() so we call
// it "pre save" hook
tourSchema.pre('save', function (next) {
    console.log('Will save document...');
    next();
});

tourSchema.post('save', function (doc, next) {
    // post middleware functions are executed after all the pre middleware 
    // functions have completed, so we dont have "this" here instead finished
    // "Document"
    console.log(doc);
    next();
});
*/

// QUERY MIDDLEWARE
// we can also copy and paste the above query middleware for "findOne" hook
// but that would not be good instead we use "regular expression" it will
// run for "find", "findOne", "findOneAndDelete", "findOneAndRemove" etc.
tourSchema.pre(/^find/, function (next) {
    // keep in mind that "this" here is now a QUERY OBJECT
    // so we can chain all of the methods that we have for 
    // the queries
    // we do not have "secretTours" set for the previous tours in DB,
    // so mongoose will add "secretTours" and set it to false here
    this.find({ secretTour: { $ne: true } });

    this.start = Date.now();
    next();
});

// this will have access to all the documents that returned
tourSchema.post(/^find/, function (docs, next) {
    console.log(`Query took ${Date.now() - this.start} milliseconds!`);
    // console.log(docs);
    next();
});


// AGGREGATION MIDDLEWARE
tourSchema.pre('aggregate', function (next) {
    // in QUERY MIDDLEWARE "this" points to the CURRENTN QUERRY
    // in DOCUMENT MIDDLEWARE "this" points to the CURRENT DOCUMENT
    // in AGGREGATION MIDDLEWARE "this" points to the CURRENT AGGREGATION OBJECT
    this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });
    console.log(this.pipeline());
    next();
});

const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;