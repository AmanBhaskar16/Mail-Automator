import mongoose from 'mongoose';

const emailLogSchema = new mongoose.Schema(
  {
    hrName: String,
    companyName: String,
    email: String,
    templateName: String,
    subject: String,
    status: { type: String, enum: ['sent', 'failed'], required: true },
    error: String,
  },
  { timestamps: true }
);

export default mongoose.model('EmailLog', emailLogSchema);
