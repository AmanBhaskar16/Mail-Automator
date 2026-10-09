import { Router } from 'express';
import Template from '../models/Template.js';

const router = Router();

router.get('/', async (req, res) => {
  const templates = await Template.find().sort({ createdAt: 1 });
  res.json(templates);
});

router.post('/', async (req, res) => {
  const { name, subject, body } = req.body;
  if (!name || !subject || !body) {
    return res.status(400).json({ error: 'name, subject and body are required' });
  }
  try {
    const template = await Template.create({ name, subject, body });
    res.status(201).json(template);
  } catch (err) {
    const msg = err.code === 11000 ? 'A template with this name already exists' : err.message;
    res.status(400).json({ error: msg });
  }
});

router.put('/:id', async (req, res) => {
  const { name, subject, body } = req.body;
  try {
    const template = await Template.findByIdAndUpdate(
      req.params.id,
      { name, subject, body },
      { new: true, runValidators: true }
    );
    if (!template) return res.status(404).json({ error: 'Template not found' });
    res.json(template);
  } catch (err) {
    const msg = err.code === 11000 ? 'A template with this name already exists' : err.message;
    res.status(400).json({ error: msg });
  }
});

router.delete('/:id', async (req, res) => {
  await Template.findByIdAndDelete(req.params.id);
  res.json({ ok: true });
});

export default router;
