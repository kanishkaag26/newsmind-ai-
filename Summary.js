const mongoose = require('mongoose');

const summarySchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    default: 'guest'
  },
  source: {
    type: String,
    enum: ['text', 'url', 'file'],
    required: true
  },
  title: {
    type: String,
    required: true
  },
  originalContent: {
    type: String
  },
  sourceUrl: {
    type: String
  },
  fileName: {
    type: String
  },
  summary: {
    type: String,
    required: true
  },
  keyPoints: [{
    type: String
  }],
  depth: {
    type: String,
    enum: ['brief', 'medium', 'detailed'],
    default: 'medium'
  },
  wordCount: {
    type: Number,
    default: 0
  },
  readingTime: {
    type: Number,
    default: 0
  },
  model: {
    type: String,
    default: 'extractive-summarization-v1'
  },
  provider: {
    type: String,
    default: 'Built-in Algorithm'
  },
  audioUrl: {
    type: String
  },
  pageCount: {
    type: Number
  }
}, {
  timestamps: true
});

// Index for faster queries
summarySchema.index({ userId: 1, createdAt: -1 });

module.exports = mongoose.model('Summary', summarySchema);