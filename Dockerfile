FROM node:18

WORKDIR /app

COPY backend ./backend
COPY frontend ./frontend

RUN cd backend && npm install
RUN cd frontend && npm install && npm run build

EXPOSE 3000

CMD ["node", "backend/index.js"]
