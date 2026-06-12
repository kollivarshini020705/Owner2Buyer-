import mongoose, { Schema, model, models } from 'mongoose';

const PropertySchema = new Schema({
  title: {
    type: String,
    required: [true, 'Please provide a title'],
    trim: true,
  },
  description: {
    type: String,
    required: [true, 'Please provide a description'],
  },
  price: {
    type: Number,
    required: [true, 'Please provide a price/rent amount'],
  },
  type: {
    type: String,
    enum: ['sale', 'rent'],
    required: true,
  },
  category: {
    type: String,
    enum: ['Apartment', 'Villa', 'Duplex', 'Land', 'Shop'],
    required: true,
  },
  beds: {
    type: Number,
    default: 0,
  },
  baths: {
    type: Number,
    default: 0,
  },
  area: {
    type: Number,
    required: [true, 'Please provide the area in sq.ft'],
  },
  location: {
    city: { type: String, required: true },
    address: { type: String, required: true }
  },
  images: [{
    type: String
  }],
  sellerId: {
    type: String,
    required: true,
  },
  sellerName: {
    type: String,
    required: true,
  },
  sellerRating: {
    type: Number,
    default: 4.8,
  },
  sellerPhone: {
    type: String,
    required: true,
  },
  amenities: [{
    type: String
  }],
  coords: {
    x: { type: Number, default: 100 },
    y: { type: Number, default: 100 }
  }
}, {
  timestamps: true,
  collection: 'o2b_properties'
});

export default models.o2b_Property || model('o2b_Property', PropertySchema);

