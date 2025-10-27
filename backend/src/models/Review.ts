import mongoose, { Document, Schema } from 'mongoose';

export interface IReview extends Document {
  name: string;
  role: string;
  company?: string;
  rating: number;
  review: string;
  isApproved: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const reviewSchema = new Schema<IReview>({
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  role: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  company: {
    type: String,
    trim: true,
    maxlength: 100
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  review: {
    type: String,
    required: true,
    trim: true,
    maxlength: 1000
  },
  isApproved: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Index for approved reviews
reviewSchema.index({ isApproved: 1, createdAt: -1 });

const Review = mongoose.model<IReview>('Review', reviewSchema);

export default Review;