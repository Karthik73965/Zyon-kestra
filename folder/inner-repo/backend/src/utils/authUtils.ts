import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// Function to hash a password
export const hashPassword = async (password: string): Promise<string> => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
};

// Function to verify a password
export const verifyPassword = async (
  password: string,
  hashedPassword: string
): Promise<boolean> => {
  return bcrypt.compare(password, hashedPassword);
};

// Function to generate a JWT token
export const generateToken = (user: { id: string; email: string }): string => {
  const secretKey = process.env.JWT_SECRET_KEY || "your-secret-key";
  return jwt.sign(user, secretKey, { expiresIn: "12h" });
};

// Function to verify a JWT token
export const verifyToken = (token: string): Promise<any> => {
  const secretKey = process.env.JWT_SECRET_KEY || "your-secret-key";
  return new Promise((resolve, reject) => {
    jwt.verify(token, secretKey, (err, decoded) => {
      if (err) {
        reject("Invalid or expired token");
      } else {
        resolve(decoded);
      }
    });
  });
};
