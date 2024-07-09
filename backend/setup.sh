udo apt-get update
sudo apt-get install -y git cmake build-essential

# Clone the whisper.cpp repository
git clone https://github.com/ggerganov/whisper.cpp.git

# Build the project
cd whisper.cpp
mkdir build
cd build
cmake ..
make

# Optionally, download the Whisper model
cd ..
mkdir models
wget https://huggingface.co/ggerganov/whisper.cpp/resolve/main/whisper-tiny.bin -P models/

# Return to the original directory
cd ../..