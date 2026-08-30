#!/bin/bash
set -e

echo "========================================================="
echo "   SIH Next.js App - Ubuntu EC2 Deployment with Docker   "
echo "========================================================="

# 1. Setup Swap Space (Prevents OOM Crashes during Next.js Build on t2/t3 micro/small)
SWAP_EXISTS=$(swapon --show | wc -l)
if [ "$SWAP_EXISTS" -le 1 ]; then
    echo "⚙️ Creating 2GB swap space for smooth build on EC2..."
    sudo fallocate -l 2G /swapfile || sudo dd if=/dev/zero of=/swapfile bs=1M count=2048
    sudo chmod 600 /swapfile
    sudo mkswap /swapfile
    sudo swapon /swapfile
    echo "/swapfile swap swap defaults 0 0" | sudo tee -a /etc/fstab
    echo "✅ Swap memory configured."
else
    echo "✅ Swap memory already configured."
fi

# 2. Update packages & Install Docker and Docker Compose Plugin
echo "📦 Updating apt packages..."
sudo apt-get update -y
sudo apt-get install -y ca-certificates curl gnupg lsb-release

# Add Docker's official GPG key and repo if missing
if [ ! -f /etc/apt/keyrings/docker.gpg ]; then
    echo "🔑 Adding Docker GPG key and repository..."
    sudo mkdir -p /etc/apt/keyrings
    curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
    echo \
      "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
      $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
    sudo apt-get update -y
fi

echo "🐳 Installing Docker Engine and Docker Compose..."
sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

# Enable and start Docker service
sudo systemctl enable docker
sudo systemctl start docker

# Add current user to docker group
sudo usermod -aG docker "$USER" || true

# 3. Handle environment file
if [ ! -f ".env.local" ]; then
    if [ -f ".env" ]; then
        echo "📄 Copying .env to .env.local..."
        cp .env .env.local
    else
        echo "⚠️  Creating empty .env.local. Please make sure your required environment variables are set!"
        touch .env.local
    fi
fi

# 4. Build and Run Container
echo "🚀 Building and starting Docker container with Docker Compose..."
if [ -f "docker-compose.yml" ]; then
    sudo docker compose down || true
    sudo docker compose build
    sudo docker compose up -d
    echo "========================================================="
    echo "🎉 Deployment Successful!"
    echo "App is running on Port 80."
    echo "Check logs anytime with: sudo docker compose logs -f"
    echo "========================================================="
    sudo docker ps
else
    echo "❌ Error: docker-compose.yml not found. Run this script in the project root."
    exit 1
fi
