import mongoose from 'mongoose';

export interface IRestaurant extends mongoose.Document {
  placeId: string;
  name: string;
  address: string;
  location: {
    type: string;
    coordinates: number[];
  };
  cuisineType: string[];
  googleRating: number;
  authenticityRating: number;
  authenticityVotes: number;
  photos: string[];
  priceLevel: number;
  website: string;
  phoneNumber: string;
  createdAt: Date;
  updatedAt: Date;
}

const RestaurantSchema = new mongoose.Schema(
  {
    placeId: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    location: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point',
      },
      coordinates: {
        type: [Number],
        required: true,
      },
    },
    cuisineType: {
      type: [String],
      required: true,
    },
    googleRating: {
      type: Number,
    },
    authenticityRating: {
      type: Number,
      default: 0,
    },
    authenticityVotes: {
      type: Number,
      default: 0,
    },
    photos: {
      type: [String],
    },
    priceLevel: {
      type: Number,
    },
    website: {
      type: String,
    },
    phoneNumber: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

// Create an index for geospatial queries
RestaurantSchema.index({ location: '2dsphere' });

export default mongoose.models.Restaurant || mongoose.model<IRestaurant>('Restaurant', RestaurantSchema);