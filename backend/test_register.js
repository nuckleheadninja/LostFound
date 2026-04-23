require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const jwt = require('jsonwebtoken');

async function test() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('DB connected');

    const user = await User.create({
      name: 'Test User',
      email: 'debugtest999@test.com',
      password: 'test1234'
    });
    console.log('User created:', user._id);

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    console.log('Token generated OK');

    // cleanup
    await User.deleteOne({ email: 'debugtest999@test.com' });
    console.log('Cleaned up. ALL OK!');
    process.exit(0);
  } catch (e) {
    console.error('ERROR:', e.message);
    console.error(e);
    process.exit(1);
  }
}

test();
