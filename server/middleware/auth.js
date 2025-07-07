const admin = require('../firebase/firebase-admin');

/**
 * Middleware to verify Firebase ID tokens
 * Expects token in Authorization header as "Bearer <token>"
 */
const verifyFirebaseToken = async (req, res, next) => {
  try {
    // Get token from Authorization header
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ 
        error: 'No token provided. Please include Authorization header with Bearer token.' 
      });
    }

    const token = authHeader.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ 
        error: 'Invalid token format. Expected: Bearer <token>' 
      });
    }

    // Verify the token with Firebase Admin
    const decodedToken = await admin.auth().verifyIdToken(token);
    
    // Add user info to request object for use in routes
    req.user = {
      uid: decodedToken.uid,
      email: decodedToken.email,
      name: decodedToken.name,
      picture: decodedToken.picture,
      emailVerified: decodedToken.email_verified
    };

    next();
  } catch (error) {
    console.error('Error verifying Firebase token:', error);
    
    if (error.code === 'auth/id-token-expired') {
      return res.status(401).json({ 
        error: 'Token expired. Please log in again.' 
      });
    }
    
    if (error.code === 'auth/invalid-id-token') {
      return res.status(401).json({ 
        error: 'Invalid token. Please log in again.' 
      });
    }
    
    return res.status(401).json({ 
      error: 'Authentication failed. Please log in again.' 
    });
  }
};

/**
 * Optional middleware - only verify token if present
 * Useful for routes that work for both authenticated and unauthenticated users
 */
const optionalFirebaseAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      
      if (token) {
        const decodedToken = await admin.auth().verifyIdToken(token);
        req.user = {
          uid: decodedToken.uid,
          email: decodedToken.email,
          name: decodedToken.name,
          picture: decodedToken.picture,
          emailVerified: decodedToken.email_verified
        };
      }
    }
    
    next();
  } catch (error) {
    // For optional auth, continue even if token verification fails
    console.warn('Optional auth failed:', error.message);
    next();
  }
};

module.exports = {
  verifyFirebaseToken,
  optionalFirebaseAuth
}; 