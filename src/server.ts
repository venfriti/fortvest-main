import express from 'express';
import cors from 'cors'; 
import helmet from 'helmet'; 
import authRoutes from './routes/authRoutes'; 
import walletRoutes from './routes/walletRoutes';
import loanRoutes from './routes/loanRoutes';
import adminRoutes from './routes/adminRoutes';
import savingsRoutes from './routes/savingsRoutes';
import investmentRoutes from './routes/investmentRoutes';

import { ENV } from "./config/env";
import { verifyDatabaseConnection, query } from './config/database';

const app = express();

// Middleware
app.use(helmet()); // Security headers
app.use(cors()); // Allow frontend to connect
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes); 
app.use('/api/wallet', walletRoutes);
app.use('/api/loans', loanRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/savings', savingsRoutes);
app.use('/api/investments', investmentRoutes);

// Temporary DB test route (optional, remove for prod)
app.get('/test-db', async (req, res) => {
  try {
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

// Start server only after DB is verified
(async () => {
  await verifyDatabaseConnection();
  app.listen(ENV.PORT, () => {
    console.log(`🚀 Server running on http://localhost:${ENV.PORT}`);
  });
})();