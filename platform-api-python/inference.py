from LifeAgent import launch_chatbot
import dotenv
import os

dotenv.load_dotenv()

# Get the API key from environment
google_api_key = os.getenv("GOOGLE_API_KEY")

# Call the chatbot
launch_chatbot(
    google_api_key=google_api_key,
    document_folder="data\\resume.pdf",
    persist_dir="db"
)
