import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import templateRoutes from './routes/templates.js';
import emailRoutes from './routes/email.js';
import { seedTemplates } from './seed.js';

const app = express();
app.use(cors());
app.use(express.json());

app.get('/api/config', (req, res) => {
  res.json({
    senderEmail: process.env.GMAIL_USER || '',
    senderName: process.env.SENDER_NAME || '',
    resumeAttached: Boolean(process.env.RESUME_PATH),
  });
});
app.use('/api/templates', templateRoutes);
app.use('/api', emailRoutes);

// Express 5 forwards async errors here
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: err.message || 'Server error' });
});

const PORT = process.env.PORT || 5001;

mongoose
  .connect(process.env.MONGO_URI)
  .then(async () => {
    console.log('MongoDB connected');
    await seedTemplates();
    app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
  })
  .catch((err) => {
    console.error('MongoDB connection failed:', err.message);
    process.exit(1);
  });
