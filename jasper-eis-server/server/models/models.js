import { Schema } from 'mongoose';
const mongoose = require('mongoose');

const timeStampSchema = new Schema({
    timeSt: String,
    type: String
})

const applianceSchema = new Schema({
    energyConsumed: String,
    duration: String
})

const rPiSchema = new Schema({
    host: String,
    code: String,
    appliances: [{
        type: Schema.Types.ObjectId,
        ref: 'appliance'
    }]
})
var Stamp = mongoose.model('timeStamp', timeStampSchema);
var Appliance = mongoose.model('appliance', applianceSchema);
var rPi = mongoose.model('rPi', rPiSchema);
// Stamp({timeSt:'2018-04-05T20:36:06+05:30', type:'Start' }).save().then(
//     (res) => console.log(res),
//     (err) => console.log(err)
// );
module.exports = {Stamp, Appliance, rPi};