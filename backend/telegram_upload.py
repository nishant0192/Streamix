import os
from telethon.sync import TelegramClient
import sys

api_id = '28916131'
api_hash = '9d63029534bfd4303d63656a54890440'


async def main(video_path):
    phone_number = '+919137173246'
    if not phone_number:
        print("Phone number not provided.")
        sys.exit(1)

    # Connect the client
    client = TelegramClient('session_name', api_id, api_hash)
    await client.start()

    try:
        # Example: Send the video to a chat
        await client.send_file('Nishant_016', video_path)
        print("Video uploaded successfully!")
    except Exception as e:
        print(f"Failed to upload video: {e}")
    finally:
        # Disconnect the client
        await client.disconnect()

# Run the main function
if __name__ == "__main__":
    if len(sys.argv) != 2:
        print("Usage: python telegram_upload.py <video_path>")
        sys.exit(1)
    video_path = sys.argv[1]
    with TelegramClient('session_name', api_id, api_hash) as client:
        client.loop.run_until_complete(main(video_path))
