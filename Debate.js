const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
  sender: {
    type: String,
    enum: ['user', 'ai', 'system'],
    required: true
  },
  senderName: {
    type: String,
    default: 'Anonymous'
  },
  senderId: String,
  content: {
    type: String,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

const DebateSchema = new mongoose.Schema({
  summaryId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Summary',
    required: true
  },
  roomId: { 
    type: String, 
    unique: true,
    required: true,
    index: true
  },
  topic: {
    type: String,
    required: true
  },
  description: String,
  participants: [{
    userId: String,
    userName: String,
    joinedAt: {
      type: Date,
      default: Date.now
    }
  }],
  messages: [MessageSchema],
  isActive: { 
    type: Boolean, 
    default: true 
  },
  maxParticipants: {
    type: Number,
    default: 10
  },
  createdBy: {
    type: String,
    default: 'guest'
  },
  createdAt: { 
    type: Date, 
    default: Date.now,
    index: true
  },
  lastActivity: {
    type: Date,
    default: Date.now
  }
});

// Update last activity on message add
DebateSchema.pre('save', function(next) {
  if (this.messages && this.messages.length > 0) {
    this.lastActivity = Date.now();
  }
  next();
});

module.exports = mongoose.model('Debate', DebateSchema);