const express = require('express');
const bodyParser = require('body-parser');
const connectDB = require('./database');
const User = require('./modles/user');
const path = require('path'); // For serving static files

const app = express();
const PORT = 3000;

// Connect to MongoDB
connectDB();

// Middleware to parse request bodies
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Serve static files (for our HTML)
app.use(express.static(path.join(__dirname, 'public')));

// Route to serve the HTML form
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// API endpoint for real-time email validation
app.post('/api/validate-email', async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (user) {
      return res.json({ exists: true, message: 'This email is already registered.' });
    } else {
      return res.json({ exists: false, message: 'This email is available.' });
    }
  } catch (error) {
    console.error('Error during email validation:', error);
    return res.status(500).json({ error: 'Internal server error.' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});


