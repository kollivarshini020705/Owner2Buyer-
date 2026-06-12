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
  timestamps: true,
  collection: 'o2b_messages'
});

export default models.o2b_Message || model('o2b_Message', MessageSchema);

