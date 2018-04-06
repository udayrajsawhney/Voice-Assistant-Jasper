'use strict';

var _mongoose = require('mongoose');

var mongoose = require('mongoose');

var timeStampSchema = new _mongoose.Schema({
    timeSt: String,
    type: String
});

var applianceSchema = new _mongoose.Schema({
    energyConsumed: String,
    duration: String
});

var rPiSchema = new _mongoose.Schema({
    host: String,
    code: String,
    appliances: [{
        type: _mongoose.Schema.Types.ObjectId,
        ref: 'appliance'
    }]
});
var Stamp = mongoose.model('timeStamp', timeStampSchema);
var Appliance = mongoose.model('appliance', applianceSchema);
var rPi = mongoose.model('rPi', rPiSchema);
// Stamp({timeSt:'2018-04-05T20:36:06+05:30', type:'Start' }).save().then(
//     (res) => console.log(res),
//     (err) => console.log(err)
// );
module.exports = { Stamp: Stamp, Appliance: Appliance, rPi: rPi };
//# sourceMappingURL=models.js.map