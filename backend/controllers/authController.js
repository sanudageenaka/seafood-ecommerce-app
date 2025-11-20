import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { db } from '../db.js'   // fixed path

const JWT_SECRET = 'yoursecretkey' // change this to something secure

// Login user
export const login = async (req, res) => {
  const { email, password } = req.body

  try {
    const [rows] = await db.query(
      'SELECT * FROM users WHERE email = ?',
      [email]
    )

    if (rows.length === 0) {
      return res.status(400).json({ error: 'User not found' })
    }

    const user = rows[0]

    const valid = await bcrypt.compare(password, user.password_hash)
    if (!valid) {
      return res.status(400).json({ error: 'Invalid password' })
    }

    const token = jwt.sign(
      { id: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: '1d' }
    )

    return res.json({ message: 'Login successful', token })

  } catch (err) {
    console.error(err)
    return res.status(500).json({ error: 'Server error' })
  }
}

export const register = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // Check if user exists
    const [existing] = await db.query(
      'SELECT id FROM users WHERE email = ?',
      [email]
    );

    if (existing.length > 0) {
      return res.status(400).json({ error: 'Email already exists' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);

    // Insert user
    await db.query(
      'INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)',
      [name, email, password_hash]
    );

    return res.status(201).json({ message: 'Registration successful' });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error' });
  }
};
