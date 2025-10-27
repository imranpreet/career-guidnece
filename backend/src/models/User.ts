import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  email: string;
  password: string;
  name: string;
  profilePicture?: string;
  experience: string;
  skills: string[];
  primarySkill?: string; // Main skill for personalized content (quizzes, interviews, AI)
  education: string;
  professionalBio?: string;
  careerGoals?: string;
  currentRole?: string;
  targetRole?: string;
  completedQuizzes: number;
  resumesGenerated: number;
  interviewsCompleted: number;
  quizScores: {
    topic: string;
    score: number;
    totalQuestions?: number;
    correctAnswers?: number;
    date: Date;
  }[];
  interviewScores: {
    type: string;
    score: number;
    questionsAnswered?: number;
    date: Date;
  }[];
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema: Schema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  profilePicture: {
    type: String,
    default: ''
  },
  experience: {
    type: String,
    enum: ['entry', 'junior', 'mid', 'senior', 'lead', 'executive'],
    default: 'entry'
  },
  skills: [{
    type: String,
    trim: true
  }],
  primarySkill: {
    type: String,
    trim: true,
    default: ''
  },
  education: {
    type: String,
    default: ''
  },
  professionalBio: {
    type: String,
    default: ''
  },
  careerGoals: {
    type: String,
    default: ''
  },
  currentRole: {
    type: String,
    default: ''
  },
  targetRole: {
    type: String,
    default: ''
  },
  completedQuizzes: {
    type: Number,
    default: 0
  },
  resumesGenerated: {
    type: Number,
    default: 0
  },
  interviewsCompleted: {
    type: Number,
    default: 0
  },
  quizScores: [{
    topic: {
      type: String,
      required: true
    },
    score: {
      type: Number,
      required: true
    },
    totalQuestions: {
      type: Number,
      required: false
    },
    correctAnswers: {
      type: Number,
      required: false
    },
    date: {
      type: Date,
      required: true
    }
  }],
  interviewScores: [{
    type: {
      type: String,
      required: true
    },
    score: {
      type: Number,
      required: true
    },
    questionsAnswered: {
      type: Number,
      required: false
    },
    date: {
      type: Date,
      required: true
    }
  }]
}, {
  timestamps: true
});

export default mongoose.model<IUser>('User', UserSchema);