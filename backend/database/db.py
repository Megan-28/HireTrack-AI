
import sqlite3
from pathlib import Path

# Find the root project directory
BASE_DIR = Path(__file__).resolve().parent.parent.parent

# Define where the database file will be stored
DATABASE_PATH = BASE_DIR / "hiretrack.db"


def get_connection():
    connection = sqlite3.connect(DATABASE_PATH)
    connection.row_factory = sqlite3.Row
    return connection
