const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../database');
const authenticateToken = require('../middleware/auth');
const dotenv = require('dotenv');

dotenv.config();

const router = express.Router();

// Register
router.post('/register', async (req, res) => {
    const { fullname, email, password } = req.body;

    if (!fullname || !email || !password) {
        return res.status(400).json({ message: 'Please provide all fields' });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        db.run(
            'INSERT INTO users (fullname, email, password) VALUES (?, ?, ?)',
            [fullname, email, hashedPassword],
            (err) => {
                if (err) {
                    if (err.message.includes('UNIQUE constraint failed')) {
                        return res.status(400).json({ message: 'Email already exists' });
                    }
                    return res.status(500).json({ message: 'Database error' });
                }
                res.status(201).json({ message: 'User registered successfully' });
            }
        );
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Login
router.post('/login', (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Please provide email and password' });
    }

    db.get('SELECT * FROM users WHERE email = ?', [email], async (err, user) => {
        if (err) {
            return res.status(500).json({ message: 'Database error' });
        }

        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        try {
            const passwordMatch = await bcrypt.compare(password, user.password);

            if (!passwordMatch) {
                return res.status(401).json({ message: 'Invalid email or password' });
            }

            const token = jwt.sign(
                { userId: user.id, email: user.email },
                process.env.JWT_SECRET,
                { expiresIn: '24h' }
            );

            res.json({
                message: 'Login successful',
                token,
                userId: user.id,
                fullname: user.fullname
            });
        } catch (error) {
            res.status(500).json({ message: 'Server error' });
        }
    });
});

// Get all users
router.get('/users', authenticateToken, (req, res) => {
    db.all('SELECT id, fullname, email, created_at FROM users', (err, rows) => {
        if (err) {
            return res.status(500).json({ message: 'Database error' });
        }
        res.json(rows);
    });
});

// Get single user
router.get('/users/:id', authenticateToken, (req, res) => {
    const { id } = req.params;

    db.get('SELECT id, fullname, email, created_at FROM users WHERE id = ?', [id], (err, row) => {
        if (err) {
            return res.status(500).json({ message: 'Database error' });
        }

        if (!row) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json(row);
    });
});

// Create user
router.post('/users', authenticateToken, async (req, res) => {
    const { fullname, email, password } = req.body;

    if (!fullname || !email || !password) {
        return res.status(400).json({ message: 'Please provide all fields' });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        db.run(
            'INSERT INTO users (fullname, email, password) VALUES (?, ?, ?)',
            [fullname, email, hashedPassword],
            function(err) {
                if (err) {
                    if (err.message.includes('UNIQUE constraint failed')) {
                        return res.status(400).json({ message: 'Email already exists' });
                    }
                    return res.status(500).json({ message: 'Database error' });
                }
                res.status(201).json({
                    id: this.lastID,
                    fullname,
                    email,
                    message: 'User created successfully'
                });
            }
        );
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Update user
router.put('/users/:id', authenticateToken, (req, res) => {
    const { id } = req.params;
    const { fullname, email } = req.body;

    if (!fullname && !email) {
        return res.status(400).json({ message: 'Please provide fields to update' });
    }

    if (fullname && email) {
        db.run(
            'UPDATE users SET fullname = ?, email = ? WHERE id = ?',
            [fullname, email, id],
            (err) => {
                if (err) {
                    if (err.message.includes('UNIQUE constraint failed')) {
                        return res.status(400).json({ message: 'Email already exists' });
                    }
                    return res.status(500).json({ message: 'Database error' });
                }
                res.json({ success: true, message: 'User updated successfully' });
            }
        );
    } else if (fullname) {
        db.run(
            'UPDATE users SET fullname = ? WHERE id = ?',
            [fullname, id],
            (err) => {
                if (err) {
                    return res.status(500).json({ message: 'Database error' });
                }
                res.json({ success: true, message: 'User updated successfully' });
            }
        );
    } else if (email) {
        db.run(
            'UPDATE users SET email = ? WHERE id = ?',
            [email, id],
            (err) => {
                if (err) {
                    if (err.message.includes('UNIQUE constraint failed')) {
                        return res.status(400).json({ message: 'Email already exists' });
                    }
                    return res.status(500).json({ message: 'Database error' });
                }
                res.json({ success: true, message: 'User updated successfully' });
            }
        );
    }
});

// Delete user
router.delete('/users/:id', authenticateToken, (req, res) => {
    const { id } = req.params;

    db.run('DELETE FROM users WHERE id = ?', [id], (err) => {
        if (err) {
            return res.status(500).json({ message: 'Database error' });
        }
        res.json({ success: true, message: 'User deleted successfully' });
    });
});

module.exports = router;
