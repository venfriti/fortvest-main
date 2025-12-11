// src/server.ts
import express from 'express';
import cors from 'cors'; 
import helmet from 'helmet'; 
import authRoutes from './routes/authRoutes'; 
import { query } from './config/database';

const app = express();
const PORT = process.env.PORT || 3000;

// Routes
app.use(express.json());

app.use('/api/auth', authRoutes); 

// Middleware
app.use(helmet()); // Security headers
app.use(cors()); // Allow frontend to connect
app.use(express.json()); // Parse JSON bodies

// Simple route to test DB connection
app.get('/test-db', async (req, res) => {
  try {
    // Run a simple SQL query to check time
    const result = await query('SELECT NOW()');
    res.json({ 
      message: 'Database connection successful!', 
      time: result.rows[0].now 
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Database connection failed' });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});