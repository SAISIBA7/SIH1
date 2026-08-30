#!/bin/bash
set -e

echo "========================================================"
echo "  Deploying Next.js (SIH) on AWS EC2 Ubuntu with Docker "
echo "========================================================"

echo "=== 1. Checking / Creating Swap Memory (Prevents OOM during build) ==="
SWAP_EXISTS=$(swapon --show | wc -l)
if [ "$SWAP_EXISTS" -le 1 ]; then
    echo "Creating 2GB swap space..."
    sudo fallocate -l 2G /swapfile || sudo dd if=/dev/zero of=/swapfile bs=1M count=2048
    sudo chmod 600 /swapfile
    sudo mkswap /swapfile
    sudo swapon /swapfile
    echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
    echo "Swap space successfully configured."
else
    echo "Swap space already active."
fi

echo "=== 2. Updating packages & Installing Docker ==="
sudo apt-get update -y
sudo apt-get install -y ca-certificates curl gnupg lsb-release

# Add Docker's official GPG key and repository
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

# Add current user to docker group
sudo usermod -aG docker $USER

echo "=== 3. Building and Starting Application Container ==="
if [ -f "docker-compose.yml" ]; then
    touch .env.local
    sudo docker compose down || true
    sudo docker compose build --no-cache
    sudo docker compose up -d
    echo "========================================================"
    echo "  Deployment Complete! Container running on Port 80    "
    echo "========================================================"
    sudo docker ps
else
    echo "ERROR: docker-compose.yml not found. Please run this script from the project root directory."
    exit 1
fi
