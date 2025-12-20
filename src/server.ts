import express from 'express';
import cors from 'cors'; 
import helmet from 'helmet'; 
import authRoutes from './routes/authRoutes'; 
import walletRoutes from './routes/walletRoutes';
import loanRoutes from './routes/loanRoutes';
import adminRoutes from './routes/adminRoutes';
import savingsRoutes from './routes/savingsRoutes';
import investmentRoutes from './routes/investmentRoutes';
import { query } from './config/database';

const app = express();
const PORT = process.env.PORT || 3000;

// Routes
app.use(express.json());

// Middleware
app.use(helmet()); // Security headers
app.use(cors()); // Allow frontend to connect
app.use(express.json()); // Parse JSON bodies

app.use('/api/auth', authRoutes); 
app.use('/api/wallet', walletRoutes);
app.use('/api/loans', loanRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/savings', savingsRoutes);
app.use('/api/investments', investmentRoutes);

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