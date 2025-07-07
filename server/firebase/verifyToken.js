const admin = require("./firebase-admin");

const verifyToken = async (req, res, next) => {
  try {
    // Get token from Authorization header
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ 
        message: "Unauthorized: No token provided. Please include Authorization header with Bearer token." 
      });
    }

    const token = authHeader.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ 
        message: "Unauthorized: Invalid token format. Expected: Bearer <token>" 
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
        message: "Token expired. Please log in again." 
      });
    }
    
    if (error.code === 'auth/invalid-id-token') {
      return res.status(401).json({ 
        message: "Invalid token. Please log in again." 
      });
    }
    
    return res.status(403).json({ 
      message: "Authentication failed. Please log in again.",
      error: error.message 
    });
  }
};

module.exports = verifyToken;
