const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const urlCheckSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['up', 'down'],
    default: 'up',
  },
  url: {
    type: String,
    required: true,
  },
  protocol: {
    type: String,
    enum: ['HTTP', 'HTTPS', 'TCP'],
    required: true,
  },
  path: String,
  port: Number,
  webhook: String,
  timeout: {
    type: Number,
    default: 5,
  },
  interval: {
    type: Number,
    default: 10,
  },
  threshold: {
    type: Number,
    default: 1,
  },
  authentication: {
    username: String,
    password: String,
  },
  httpHeaders: [{ key: String, value: String }],
  assert: {
    statusCode: Number,
  },
  tags: [String],
  ignoreSSL: {
    type: Boolean,
    default: false,
  },
}, {
  timestamps: true,
});

const UrlCheck = model('UrlCheck', urlCheckSchema);

module.exports = UrlCheck;
