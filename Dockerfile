# Use Node.js base image
FROM node:18

# Set the working directory
WORKDIR /app

# Copy the full backend and frontend source code
COPY backend ./backend
COPY frontend ./frontend

RUN cd backend && npm install

RUN ls -alh /app/frontend
RUN cd frontend && npm install && npm run build

# Expose backend port
EXPOSE 3000

# Start backend using nodemon for auto-reloading
CMD ["node", "backend/index.js"]
