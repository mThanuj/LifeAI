import os
from tempfile import NamedTemporaryFile
from b2sdk.v2 import InMemoryAccountInfo, B2Api, DoNothingProgressListener
from dotenv import load_dotenv

# Load environment variables from .env
load_dotenv()

def get_b2_api() -> B2Api:
    """
    Authorize and return a B2Api client using credentials from environment variables.
    """
    key_id = os.getenv("B2_KEY_ID")
    app_key = os.getenv("B2_APP_KEY")

    if not key_id or not app_key:
        raise RuntimeError("Missing B2 credentials in environment variables.")

    info = InMemoryAccountInfo()
    b2_api = B2Api(info)
    b2_api.authorize_account("production", key_id, app_key)
    return b2_api

def download_file_from_b2(bucket_id: str, file_id: str) -> str:
    """
    Download a file from B2 using its file ID and return the local file path.

    Args:
        bucket_id (str): ID of the B2 bucket.
        file_id (str): ID of the file to download.

    Returns:
        str: Local temporary file path.
    """
    try:
        b2_api = get_b2_api()
        bucket = b2_api.get_bucket_by_id(bucket_id)

        with NamedTemporaryFile(delete=False) as tmp_file:
            b2_api.download_file_by_id(file_id, DoNothingProgressListener()).save_to(tmp_file)
            return tmp_file.name

    except Exception as e:
        raise RuntimeError(f"[B2 Download Error] {e}")
