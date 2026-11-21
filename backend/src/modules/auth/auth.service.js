/**
 * Service: auth
 * Purpose: Business logic for user registration, login verification, password hashing, and token issuance
 * Owner: Member 2
 */

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const repository = require('./auth.repository');
const db = require('../../config/db');
const env = require('../../config/env');

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function generateToken(user) {
  return jwt.sign(
    { id: user.id, email: user.email, name: user.name },
    env.JWT_SECRET || 'secret-jwt-key',
    { expiresIn: '7d' }
  );
}

module.exports = {
  register: async ({ name, email, password, phone, businessName }) => {
    if (!name || name.trim() === '') {
      throw new Error('Full name is required.');
    }

    if (!email || !EMAIL_REGEX.test(email.trim())) {
      throw new Error('Please enter a valid email address.');
    }

    if (!password || password.length < 6) {
      throw new Error('Password must be at least 6 characters long.');
    }

    const cleanEmail = email.toLowerCase().trim();
    const cleanName = name.trim();

    const existingUser = await repository.findByEmail(cleanEmail);
    if (existingUser) {
      throw new Error('An account with this email address already exists. Please log in.');
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // 1. Create User
    const user = await repository.createUser({
      name: cleanName,
      email: cleanEmail,
      passwordHash,
      phone: phone ? phone.trim() : null
    });

    // 2. Automatically create primary business & ownership membership for the newly registered user
    const storeName = (businessName && businessName.trim() !== '') 
      ? businessName.trim() 
      : `${cleanName}'s Retail Store`;

    const bizQuery = `
      INSERT INTO businesses (name, operating_mode, currency, is_active)
      VALUES ($1, 'owner_supervised', 'INR', TRUE)
      RETURNING *;
    `;
    const bizRes = await db.query(bizQuery, [storeName]);
    const business = bizRes.rows[0];

    const memberQuery = `
      INSERT INTO business_members (business_id, user_id, role, permissions, is_active)
      VALUES ($1, $2, 'owner', '{"all": true}', TRUE);
    `;
    await db.query(memberQuery, [business.id, user.id]);

    const token = generateToken(user);
    const businesses = await repository.getUserBusinesses(user.id);

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: 'owner'
      },
      token,
      businesses
    };
  },

  login: async ({ email, password }) => {
    if (!email || !EMAIL_REGEX.test(email.trim())) {
      throw new Error('Please provide a valid email address.');
    }
    if (!password) {
      throw new Error('Password is required.');
    }

    const cleanEmail = email.toLowerCase().trim();
    const user = await repository.findByEmail(cleanEmail);
    if (!user || !user.is_active) {
      throw new Error('Invalid email or password.');
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      throw new Error('Invalid email or password.');
    }

    const token = generateToken(user);
    const businesses = await repository.getUserBusinesses(user.id);
    const primaryRole = businesses[0]?.role || 'owner';

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: primaryRole
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
