const Tour = require('./../models/tourModel');
const APIFeatures = require('./../utils/apiFeatures');



exports.aliasTopTours = (req, res, next) => {
    req.query.limit = '5';
    req.query.sort = '-ratingsAverage,price';
    req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
    next();
}

exports.getAllTours = async (req, res) => {
    try {
        // EXECUTE THE QUERY
        const features = new APIFeatures(Tour.find(), req.query).filter().sort().limitFields().paginate();
        const tours = await features.query;
        // query.sort().select().skip().limit()
        // what allows us to do that is that each of these methods here will always 
        // return a new query that we can then chain on the next method and the next 
        // method and the next and so on, until we finally await the query so that it 
        // can then give us our "document"

        // SEND RESPONSE
        res.status(200).json({
            status: 'success',
            results: tours.length,
            data: {
                tours
            }
        });
    } catch (err) {
        res.status(404).json({
            status: 'fail',
            message: err
        });
    }
};

exports.getTour = async (req, res) => {

    try {
        // using "id" because we specify in the URL parameter in
        // tourRoute.js
        const tour = await Tour.findById(req.params.id);
        // same as Tour.findOne({ _id: req.params.id });

        res.status(200).json({
            status: 'success',
            data: {
                tour
            }
        });
    } catch (err) {
        res.status(404).json({
            status: 'fail',
            message: err
        });
    }
};

exports.createTour = async (req, res) => {

    try {
        // const newTour = new Tour({});
        // newTour.save();

        // the main difference is that in this version we basically call
        // the method directly on the tour while in this first version we
        // called the method on the new Document.
        // "Create" return a promise so in order to get access to the final
        // document as it was created in the database we would have to use 
        // "then()" but we will use "async await"
        // now this Tour.create() will return promise.
        const newTour = await Tour.create(req.body);

        res.status(201).json({
            status: 'success',
            data: {
                tour: newTour
            }
        });
    } catch (err) {
        res.status(404).json({
            status: 'fail',
            message: err
        });
    }

};

exports.updateTour = async (req, res) => {

    try {

        const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        res.status(200).json({
            status: 'success',
            data: {
                tour
            }
        });
    } catch (err) {
        res.status(404).json({
            status: 'fail',
            message: err
        });
    }
}

exports.deleteTour = async (req, res) => {

    try {

        await Tour.findByIdAndDelete(req.params.id);

        // 204 means "No Content"
        res.status(204).json({
            status: 'success',
            data: null
        });
    } catch (err) {
        res.status(404).json({
            status: 'fail',
            message: err
        });
    }

}

// 
exports.getTourStats = async (req, res) => {
    try {
        // aggregation pipeline is a mongodb feature but mongoose of course
        // gives access to it, so that we can us it in the Mongoose driver.

        // so using our "tour" model in order to access the tour collection
        // aggregation pipeline is bit like a regular query and so using the 
        // aggregation pipeline is like doing a regular query, difference is 
        // that in aggregations, we can manipulate the data in a couple of
        // different steps so now lets define these steps.
        // for that we pass-in an array of so called stages. the documents
        // then pass throught these stages one by one in the defined sequence
        // each of the elements in this array will be one of the stages.
        // MATCH - to select / filter certain documents.
        // GROUP - group documents together basically using ACCUMULATORS
        // accumulator is for example even calculating an average.
        const stats = await Tour.aggregate([
            {
                $match: { ratingsAverage: { $gte: 4.5 } }
            },
            {
                $group: {
                    // _id: this is where we specify WHAT WE WANT TO GROUP BY
                    // _id: '$ratingsAverage',
                    _id: { $toUpper: '$difficulty' },
                    numTours: { $sum: 1 },
                    numRatings: { $sum: '$ratingsQuantity' },
                    avgRating: { $avg: '$ratingsAverage' },
                    avgPrice: { $avg: '$price' },
                    minPrice: { $min: '$price' },
                    maxPrice: { $max: '$price' },
                }

            },
            {
                $sort: { avgPrice: 1 }
            },
            // {
            //     $match: { _id: { $ne: 'EASY' } }
            // }
        ]);

        res.status(200).json({
            status: 'success',
            data: {
                stats
            }
        });

    } catch (err) {
        res.status(404).json({
            status: 'fail',
            message: err
        });
    }
}


exports.getMonthlyPlan = async (req, res) => {
    try {
        const year = req.params.year * 1;
        const plan = await Tour.aggregate([
            {
                // unwind is gonna basically deconstruct an array field from the 
                // input documents and then output one document for each element
                // of the array
                // so basically we want to have one tour for each of these dates
                // in the array.
                $unwind: '$startDates'
            },
            {
                // Now we go ahead and select the documents for the year that was
                // passed in
                $match: {
                    startDates: {
                        $gte: new Date(`${year}-01-01`),
                        $lte: new Date(`${year}-12-31`),
                    }
                }
            },
            {
                $group: {
                    _id: { $month: '$startDates' },
                    numTourStarts: { $sum: 1 },
                    tours: { $push: '$name' }
                }
            },
            {
                $addFields: { month: '$_id' }
            },
            {
                $project: {
                    _id: 0
                }
            },
            {
                $sort: { numTourStarts: -1 }
            },
            {
                $limit: 12
            }
        ]);

        res.status(200).json({
            status: 'success',
            data: {
                plan
            }
        });
    } catch (err) {
        res.status(404).json({
            status: 'fail',
            message: err
        });
    }
}