const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const responseSchema = new Schema({
  urlCheckId: {
    type: Schema.Types.ObjectId,
    ref: "UrlCheck",
    required: true,
  },
  status: {
    type: String,
    enum: ['up', 'down'],
  },
  responseTime: Number,
},
{
  timestamps: true,
});

const Response = model('Response', responseSchema);

module.exports = Response;