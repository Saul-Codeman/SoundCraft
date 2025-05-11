# Use Node.js base image
FROM node:18

# Set the working directory
WORKDIR /app

# Copy backend package files and install dependencies
COPY backend/package*.json ./backend/
RUN cd backend && npm install

# Copy frontend package files and install dependencies, then build frontend
COPY frontend/package*.json ./frontend/
RUN cd frontend && npm install && npm run build

# Copy the full backend and frontend source code
COPY backend ./backend
COPY frontend ./frontend

# Expose backend port
EXPOSE 3000

# Start backend using nodemon for auto-reloading
CMD ["npx", "nodemon", "backend/index.js"]
