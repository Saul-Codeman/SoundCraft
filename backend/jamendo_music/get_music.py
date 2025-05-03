import requests
import boto3
import os
from pymongo import MongoClient
from tqdm import tqdm
from urllib.parse import urlparse
from time import sleep
from dotenv import load_dotenv
from pathlib import Path
from concurrent.futures import ThreadPoolExecutor, as_completed

env_path = Path('..') / '.env'
load_dotenv(dotenv_path=env_path)

JAMENDO_CLIENT_ID = os.getenv('JAMENDO_CLIENT_ID')
MONGODB_URI = os.getenv('MONGODB_URI')
DB_NAME = os.getenv('DB_NAME')
COLLECTION_NAME = os.getenv('COLLECTION_NAME')
AWS_BUCKET_NAME = os.getenv('AWS_BUCKET_NAME')
AWS_REGION = os.getenv('AWS_REGION')

# AWS S3 session
s3 = boto3.client('s3')

# MongoDB connection
client = MongoClient(MONGODB_URI)
db = client[DB_NAME]
collection = db[COLLECTION_NAME]

MAX_WORKERS = 40
downloads_failed = 0

def process_track(track):
    track_id = track['id']
    name = track['name']
    audio_url = track.get('audiodownload')

    s3_url = download_and_upload_to_s3(audio_url, track_id, name) if audio_url else None
    if not s3_url:
        return
    condensed_track = {
        "id": track_id,
        "name": name,
        "duration": track.get('duration'),
        "artist_id": track.get('artist_id'),
        "artist_idstr": track.get('artist_idstr'),
        "artist_name": track.get('artist_name'),
        "album_name": track.get('album_name'),
        "album_id": track.get('album_id'),
        "license_ccurl": track.get('license_ccurl'),
        "releasedate": track.get('releasedate'),
        "album_image": track.get('album_image'),
        "image": track.get('image'),
        "musicinfo": track.get('musicinfo'),
        "jamendo_audio_url": track.get('audiodownload'),
        "s3_audio_url": s3_url
    }

    collection.update_one({'id': track_id}, {'$set': condensed_track}, upsert=True)

def download_and_upload_to_s3(url, track_id, name):
    response = requests.get(url, stream=True)
    if response.status_code == 200:
        track_id = track_id.strip().replace('.', '')
        filename = f"tracks/{track_id}/{name}.mp3"
        s3.upload_fileobj(response.raw, AWS_BUCKET_NAME, filename)
        return f"https://{AWS_BUCKET_NAME}.s3.{AWS_REGION}.amazonaws.com/{filename}"
    else:
        global downloads_failed
        print(f"Failed to download track {track_id}")
        downloads_failed += 1
        return None

def fetch_and_store_tracks(offset, limit):
    url = (
        f"https://api.jamendo.com/v3.0/tracks/"
        f"?client_id={JAMENDO_CLIENT_ID}&format=json&limit={limit}&offset={offset}"
        f"&order=popularity_total&include=musicinfo&audiodownload_allowed=true&audiodlformat=mp32"
    )
    response = requests.get(url)
    if response.status_code != 200:
        print(f"Error fetching data at offset {offset}")
        return

    data = response.json()
    tracks = data.get('results', [])

    with ThreadPoolExecutor(max_workers=MAX_WORKERS) as executor:
        futures = [executor.submit(process_track, track) for track in tracks]
        for f in as_completed(futures):
            f.result()  # to raise exceptions if any

def main():
    total = 33000
    batch_size = 200
    for offset in tqdm(range(30000, total, batch_size)):
        fetch_and_store_tracks(offset, batch_size)
        print(f"Offset: {offset}")
        sleep(1) 
    print(f"Downloads failed: {downloads_failed}")

if __name__ == '__main__':
    main()
