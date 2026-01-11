const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  userId: {
    type: String,
    unique: true,
    required: true,
    index: true
  },
  name: {
    type: String,
    default: 'Anonymous User'
  },
  email: String,
  preferences: {
    defaultDepth: {
      type: String,
      enum: ['quick', 'medium', 'detailed'],
      default: 'medium'
    },
    autoGenerateAudio: {
      type: Boolean,
      default: false
    },
    voiceLanguage: {
      type: String,
      default: 'en-US'
    }
  },
  stats: {
    totalSummaries: {
      type: Number,
      default: 0
    },
    totalDebates: {
      type: Number,
      default: 0
    },
    totalMessages: {
      type: Number,
      default: 0
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  lastActive: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('User', UserSchema);