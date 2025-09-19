# Setup Redis Locally

## Enable WSL

Open **PowerShell** as an administrator and run:

```powershell
wsl --install
```

Restart your computer to complete the WSL installation.

## Install Redis Server

```
sudo apt-get update
sudo apt-get install redis-server
```

## Start the Redis Service

```
sudo service redis-server start
```

## Verify Installation

```
redis-cli
```
