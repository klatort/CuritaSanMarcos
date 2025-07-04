# GitHub Actions Deployment Workflow

This repository includes a GitHub Actions workflow that automates deployment to a private server.

## Workflow Features

- **Triggers**: Automatically deploys on pushes to the `main` branch or can be triggered manually
- **SSH Deployment**: Uses SSH to securely connect to your private server
- **File Synchronization**: Copies project files while excluding sensitive/unnecessary files
- **Docker Deployment**: Uses docker-compose to deploy the application
- **Deployment Verification**: Checks if containers are running and services are accessible
- **Environment Preservation**: Keeps the `.env` file on the server intact

## Required GitHub Secrets

To use this workflow, you need to configure the following secrets in your GitHub repository:

### SSH Configuration
- `SSH_PRIVATE_KEY`: Your SSH private key for server access
- `SERVER_HOST`: The hostname or IP address of your server
- `SERVER_USER`: Username for SSH connection
- `SERVER_PATH`: Absolute path on the server where the project should be deployed

### How to Set Up Secrets

1. Go to your repository on GitHub
2. Click on "Settings" → "Secrets and variables" → "Actions"
3. Click "New repository secret" and add each secret:

#### SSH_PRIVATE_KEY
```bash
# Generate SSH key pair (if you don't have one)
ssh-keygen -t rsa -b 4096 -C "your_email@example.com"

# Copy the private key content
cat ~/.ssh/id_rsa
```

#### SERVER_HOST
```
# Example: your-server.com or 192.168.1.100
your-server.com
```

#### SERVER_USER
```
# Example: ubuntu, root, or your username
ubuntu
```

#### SERVER_PATH
```
# Example: /home/ubuntu/curitasanmarcos
/home/ubuntu/curitasanmarcos
```

## Server Requirements

Your server must have:
- Docker and Docker Compose installed
- SSH access configured
- The SSH public key added to `~/.ssh/authorized_keys`
- A `.env` file in the deployment directory with your configuration

## Files Excluded from Deployment

The workflow automatically excludes these files/directories:
- `node_modules/`
- `bot_sessions/`
- `.env`
- `.git/`
- `.github/`
- `*.log`
- `*.qr.png`
- `coverage/`
- `dist/`
- `build/`
- `*.tmp`
- `*.temp`

## Manual Deployment

You can trigger the deployment manually:
1. Go to the "Actions" tab in your repository
2. Select "Deploy to Server" workflow
3. Click "Run workflow"
4. Select the branch and click "Run workflow"

## Troubleshooting

### Common Issues

1. **SSH Connection Failed**: Verify your SSH key and server configuration
2. **Permission Denied**: Check file permissions on the server
3. **Docker Compose Fails**: Ensure Docker is running and accessible
4. **Missing .env**: Make sure the `.env` file exists on the server

### Viewing Logs

You can view deployment logs in the GitHub Actions tab of your repository. For server logs, SSH into your server and run:

```bash
cd /path/to/your/project
docker-compose logs -f
```