/**
 * GET /activitiesSchema
 * List all activities.
 */
const Activity = require('../models/Activity.js');

exports.getActivities = (req, res) => {
  Activity.find({}, function(err, activity) {
    var activityMap = [];
    var index = 0;

    activity.forEach(function (activity) {
      activityMap[index] = activity;
      index++;
    });
    // console.log('getting activities');
    // console.log(activityMap);
    res.send(activityMap);
  });
};

exports.createActivity = (req, res) => {
  const activity = new Activity({
    id: req.body.id,
    name: req.body.name,
    address: req.body.address,
    lat: req.body.lat,
    lng: req.body.lng,
    category: req.body.category
  });
  activity.save((err) => {
    if (err) {
      return next(err);
    }
    res.redirect('/');
  });
}

exports.editActivity = (req, res) => {
  console.log('edit backend');
  Activity.findById({_id: req.body.id}, function (err, activity) {
    if (err) {
      console.log(err);
    } else {
      activity.name = req.body.name;
      activity.address = req.body.address;
      activity.lat = req.body.lat;
      activity.lng = req.body.lng;
      activity.category = req.body.category;
      activity.save((err) => {
        if (err) {
          return next(err);
        }
        console.log('before redirect');
        // res.redirect('/');
        res.send('updated');
      });
    }
  });
};

exports.deleteActivity = (req, res) => {
  console.log('delete backend');
  Activity.findByIdAndRemove({ _id: req.body.id }, function(err) {
    if (err) {
            console.log(err);
    }
    res.send('deleted');
  });
}
