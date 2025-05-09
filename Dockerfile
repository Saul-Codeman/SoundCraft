# Use Node.js base image
FROM node:18

# Set working directory inside container
WORKDIR /app

# Copy backend package files and install dependencies
COPY backend/package*.json ./backend/
RUN cd backend && npm install

# Copy frontend package files and install + build frontend
COPY frontend/package*.json ./frontend/
RUN cd frontend && npm install && npm run build

# Copy full backend and frontend source code
COPY backend ./backend
COPY frontend ./frontend

# Move built frontend files into backend's public directory (optional but common)
RUN mkdir -p backend/public && cp -r frontend/dist/* backend/public/

# Expose the backend port
EXPOSE 3000

# Start backend (assumes index.js runs Express or similar)
CMD ["node", "backend/index.js"]
