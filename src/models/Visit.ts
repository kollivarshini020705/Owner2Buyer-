import mongoose, { Schema, model, models } from 'mongoose';

const VisitSchema = new Schema({
  propertyId: {
    type: String,
    required: true,
  },
  buyerId: {
    type: String,
    required: true,
  },
  buyerName: {
    type: String,
    required: true,
  },
  date: {
    type: String,
    default: 'June 15, 2026 at 11:00 AM'
  },
  status: {
    type: String,
    enum: ['Pending Approval', 'Approved', 'Declined'],
    default: 'Pending Approval',
  }
}, {
  timestamps: true,
  collection: 'o2b_visits'
});

export default models.o2b_Visit || model('o2b_Visit', VisitSchema);

