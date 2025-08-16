# 🎵 SoundCraft
**SoundCraft** is a full-stack audio frequency adjustment platform. It combines an intuitive React-based interface with powerful cloud-backed services, enabling fast EQ adjustments, waveform visualization, and secure storage of large music libraries.

## Features
- Audio Editing Interface: Real-time EQ adjustments, waveform visualization, and playback controls using Wavesurfer.js.
- Cloud Storage: Over 30,000 Jamendo music tracks stored on AWS S3, accessible via metadata stored on MongoDB.
- Secure Access: User authentication and session management using Firebase.
- Scalable Cloud Infrastructure: Used Docker to containerize Node.js services to deploy using AWS ECS with request routing between clients and MongoDB/S3.
- Automated CI/CD Pipeline: GitHub Actions pipeline for building Docker image and deploying on AWS.

Tech Stack
- **Frontend:** React, JavaScript, HTML, CSS
- **Backend:** Node.js, Express.js
- **Database:** MongoDB
- **Cloud Services:** AWS S3, ECS, Firebase
- **DevOps:** Docker, GitHub Actions
- **Data Collection:** Python

## Setup & Installation

### 1. Clone the Repository
git clone https://github.com/Saul-Codeman/SoundCraft.git
cd SoundCraft

### 2. Create .env in Backend directory (may use local music files without .env)
# MongoDB
MONGODB_URI=
MONGODB_MUSIC_URI=
DB_NAME=
COLLECTION_NAME=
# Python music downloading script
JAMENDO_CLIENT_ID=
# AWS S3
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_BUCKET_NAME=
AWS_REGION=

### 3. Install Node Modules
cd backend && npm install
cd frontend && npm install

### 4. Run Locally
cd backend && node index.js
Go to localhost:3000
Note: Search will retrieve song metadata, but you cannot download them because I didn't pay my AWS bill.