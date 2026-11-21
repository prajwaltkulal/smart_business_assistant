/**
 * Service: auth
 * Purpose: Business logic for user registration, login verification, and token issuance
 * Owner: Member 2
 */

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const repository = require('./auth.repository');
const env = require('../../config/env');

function generateToken(user) {
  return jwt.sign(
    { id: user.id, email: user.email, name: user.name },
    env.JWT_SECRET,
    { expiresIn: '7d' }
  );
}

module.exports = {
  register: async ({ name, email, password, phone }) => {
    if (!name || !email || !password) {
      throw new Error('Name, email, and password are required.');
    }

    if (password.length < 6) {
      throw new Error('Password must be at least 6 characters long.');
    }

    const existingUser = await repository.findByEmail(email);
    if (existingUser) {
      throw new Error('A user with this email already exists.');
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const user = await repository.createUser({
      name,
      email,
      passwordHash,
      phone
    });

    const token = generateToken(user);

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone
      },
      token,
      businesses: []
    };
  },

  login: async ({ email, password }) => {
    if (!email || !password) {
      throw new Error('Email and password are required.');
    }

    const user = await repository.findByEmail(email);
    if (!user || !user.is_active) {
      throw new Error('Invalid email or password.');
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      throw new Error('Invalid email or password.');
    }

    const token = generateToken(user);
    const businesses = await repository.getUserBusinesses(user.id);

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone
      },
      token,
      businesses
    };
  },

  getCurrentUser: async (userId) => {
    const user = await repository.findById(userId);
    if (!user) {
      throw new Error('User not found.');
    }
    const businesses = await repository.getUserBusinesses(userId);
    return { user, businesses };
  }
};
