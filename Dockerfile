FROM node:18

WORKDIR /app

# Copy backend and frontend
COPY backend ./backend
COPY frontend ./frontend

# Install dependencies for both
RUN cd backend && npm install
RUN cd frontend && npm install

# Expose backend port
EXPOSE 3000

# Build frontend at container startup so VITE_ env vars are used
CMD bash -c "cd frontend && npm run build && cd ../backend && node index.js"

