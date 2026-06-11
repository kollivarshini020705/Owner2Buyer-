import mongoose, { Schema, model, models } from 'mongoose';

const MessageSchema = new Schema({
  senderId: {
    type: String,
    required: true,
  },
  receiverId: {
    type: String,
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  }
}, {
  timestamps: true
});

export default models.Message || model('Message', MessageSchema);
