# on Ubuntu or Debian
sudo apt update && sudo apt install ffmpeg

# on Arch Linux
sudo pacman -S ffmpeg

# on MacOS using Homebrew (https://brew.sh/)
brew install ffmpeg

# Navigate to the backend directory.
Create a virtual environment: python -m venv venv

# Activate the virtual environment:
On Windows: venv\Scripts\activate
On Mac/Linux: source venv/bin/activate

# Install the requirements:
pip install -r requirements.txt

# Run the Flask app:
python app.py

