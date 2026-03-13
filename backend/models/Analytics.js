import mongoose from 'mongoose';

const analyticsSchema = new mongoose.Schema({
  urlId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Url',
    required: [true, 'URL ID is required'],
    index: true
  },
  clickTimestamp: {
    type: Date,
    default: Date.now,
    index: true
  },
  ipAddress: {
    type: String,
    default: 'unknown'
  },
  userAgent: {
    type: String,
    default: 'unknown'
  },
  referrer: {
    type: String,
    default: 'direct'
  },
  country: {
    type: String,
    default: 'unknown'
  }
});

// Compound index for efficient queries
analyticsSchema.index({ urlId: 1, clickTimestamp: -1 });

const Analytics = mongoose.model('Analytics', analyticsSchema);

export default Analytics;
