const jwt = require('jsonwebtoken');
const db = require("../Models");
const User = db.users;

const authenticateToken = (requiredPermissions) => async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: 'Access denied. No token provided.' });
    }



    jwt.verify(token, process.env.secretKey, async (error, data) => {
      if (error) {
        return res.status(401).json({ message: 'Invalid token.' });
      }
 

      console.log('User ID from token:', data.user.id);
      
      // Attempting to find the user
      try {
        const fetchedUser = await User.findByPk(data.user.id);
        
        if (!fetchedUser) {
          return res.status(404).json({ message: 'User not found.' });
        }

        console.log(fetchedUser.dataValues.role);
     
        const hasRequiredPermissions = requiredPermissions.some(permission => fetchedUser.dataValues.role == permission);
        if (!hasRequiredPermissions) {
          return res.status(403).json({ message: 'Insufficient permissions.' });
        }

        req.user = fetchedUser;

        return next();

      } catch (error) {

        console.error('Error fetching user:', error);
        return res.status(500).json({ message: 'Internal server error.', error: error.message });
      }
    });
  } catch (error) {
    
    console.error('Error in authentication middleware:', error);
    return res.status(500).json({ message: 'Internal server error.', error: error.message });
  }
};

module.exports = authenticateToken;
