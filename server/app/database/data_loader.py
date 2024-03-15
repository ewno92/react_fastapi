import os
import json
from typing import List
from ..models.post import DB_Post


def load_data_from_json():
    current_dir = os.path.dirname(os.path.realpath(__file__))
    json_file_path = os.path.abspath(os.path.join(
        current_dir, "../../app/database/data.json"))

    if os.path.exists(json_file_path):
        with open(json_file_path, "r") as file:
            data = json.load(file)
    else:
        raise FileNotFoundError(f"File not found: {json_file_path}")

    return data
