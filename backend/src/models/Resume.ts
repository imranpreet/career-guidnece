import mongoose, { Document, Schema } from 'mongoose';

export interface IResume extends Document {
  userId: mongoose.Types.ObjectId;
  personalInfo: {
    name: string;
    email: string;
    phone?: string;
    location?: string;
    linkedin?: string;
    website?: string;
  };
  professionalSummary: string;
  experience: Array<{
    company: string;
    position: string;
    startDate: Date;
    endDate?: Date;
    current: boolean;
    description: string;
    achievements: string[];
  }>;
  education: Array<{
    institution: string;
    degree: string;
    fieldOfStudy: string;
    startDate: Date;
    endDate?: Date;
    gpa?: string;
  }>;
  skills: {
    technical: string[];
    soft: string[];
  };
  projects: Array<{
    name: string;
    description: string;
    technologies: string[];
    url?: string;
    startDate: Date;
    endDate?: Date;
  }>;
  certifications: Array<{
    name: string;
    issuer: string;
    issueDate: Date;
    expiryDate?: Date;
    credentialId?: string;
  }>;
  template: string;
  createdAt: Date;
  updatedAt: Date;
}

const ResumeSchema: Schema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  personalInfo: {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: String,
    location: String,
    linkedin: String,
    website: String
  },
  professionalSummary: {
    type: String,
    required: true
  },
  experience: [{
    company: { type: String, required: true },
    position: { type: String, required: true },
    startDate: { type: Date, required: true },
    endDate: Date,
    current: { type: Boolean, default: false },
    description: { type: String, required: true },
    achievements: [String]
  }],
  education: [{
    institution: { type: String, required: true },
    degree: { type: String, required: true },
    fieldOfStudy: { type: String, required: true },
    startDate: { type: Date, required: true },
    endDate: Date,
    gpa: String
  }],
  skills: {
    technical: [String],
    soft: [String]
  },
  projects: [{
    name: { type: String, required: true },
    description: { type: String, required: true },
    technologies: [String],
    url: String,
    startDate: { type: Date, required: true },
    endDate: Date
  }],
  certifications: [{
    name: { type: String, required: true },
    issuer: { type: String, required: true },
    issueDate: { type: Date, required: true },
    expiryDate: Date,
    credentialId: String
  }],
  template: {
    type: String,
    enum: ['modern', 'classic', 'creative', 'minimal'],
    default: 'modern'
  }
}, {
  timestamps: true
});

export default mongoose.model<IResume>('Resume', ResumeSchema);