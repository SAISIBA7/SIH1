#!/bin/bash
set -e

echo "=== 1. Updating packages & Installing Docker ==="
sudo apt-get update -y
sudo apt-get install -y ca-certificates curl gnupg lsb-release

# Add Docker's official GPG key and repo
if [ ! -f /etc/apt/keyrings/docker.gpg ]; then
    sudo mkdir -p /etc/apt/keyrings
    curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
    echo \
      "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
      $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
    sudo apt-get update -y
fi

sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

# Enable and start Docker service
sudo systemctl enable docker
sudo systemctl start docker

# Add current user to docker group so sudo is not needed
sudo usermod -aG docker $USER

echo "=== 2. Building and Starting Application Container ==="
if [ -f "docker-compose.yml" ]; then
    # If .env.local doesn't exist, create an empty one to avoid compose error
    touch .env.local
    sudo docker compose down || true
    sudo docker compose build --no-cache
    sudo docker compose up -d
    echo "=== 3. Deployment Complete! Container running on Port 80 ==="
    sudo docker ps
else
    echo "docker-compose.yml not found. Please run this script in the project root directory."
fi
