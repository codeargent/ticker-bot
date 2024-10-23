# Ticker Bot

## Description
The **Ticker Bot** uses the Uphold API to continuously retrieve cryptocurrency price pairs, like BTC-USD, at a configurable interval and threshold, per pair. It alerts the user, and logs into the database, when the price changes by a certain percentage (threshold) in either direction.

The bot supports multiple currency pairs configuration with the addition of api error logs.

## Requirements

1. **Node.js** (v20+): [Download Node.js](https://nodejs.org/en/)
2. **npm** (comes with Node.js)
3. **PostgreSQL** (optional, needed for local setup): [Download PostgreSQL](https://www.postgresql.org/download/)
4. **Docker** and **Docker Compose** (optional, needed for Docker setup): 
[Download Docker](https://docs.docker.com/get-docker/) 
[Download Docker Compose](https://docs.docker.com/compose/install/)
---

## Common Setup

### 1. Clone the repository
   Clone the project repository to your local machine:
   ```bash
   git clone https://github.com/codeargent/ticker-bot
   cd ticker-bot
   ```

### 2. Create a `.env` file
   Copy the `.env.example` file to create your own `.env` configuration:
   ```bash
   cp .env.example .env
   ```

   **Note:** For Docker Setup, use default username (postgres) and a password of your liking that will be set while building the container.

### 3. Configure `bot-config.ts`
   Modify the `src/bot-config.ts` file to configure the currency pairs, intervals, and alert thresholds:

   ```ts
   export const botConfig: BotConfig[] = [
     {
       pair: 'BTC-USD',
       interval: 5000,  // price request interval in milliseconds
       threshold: 0.01, // percentage price change
     },
     ...
   ];
   ```

---

## Local Setup (With PostgreSQL Installed Locally)

This section is for users who prefer to run the bot **without Docker** and have PostgreSQL installed locally.

### 1. Install dependencies
   After going through all of the common setup steps, install the project dependencies.

   ```bash
   npm install
   ```

### 2. Set up PostgreSQL locally
   In the process of installing PostgreSQL locally [here](https://www.postgresql.org/download/), it is recommended to allow the instalation of pgadmin in order to visually manage your local server and databases.

   After installation, you need to create the user, the password, and the database manually:

   ```sql
   CREATE USER myuser WITH PASSWORD 'mypassword';
   CREATE DATABASE mydb;
   GRANT ALL PRIVILEGES ON DATABASE mydb TO myuser;
   ```

   After sucessfully execute the commands above, update the .env file with the used data in those commands.

### 3. Build the project
   Compile the TypeScript code into JavaScript:

   ```bash
   npm run build
   ```

### 4. Run the project
   Start the bot using the following command:

   ```bash
   npm run start
   ```

You can terminate the bot using `CTRL + C` when you're done.

---

## Docker Setup (Recommended)

This section is for users who prefer to run the bot and PostgreSQL inside **Docker containers**, making the setup and deployment easier and more consistent across environments.

### 1. Build Docker Images
   First, build the Docker image using Docker Compose:
   ```bash
   docker-compose build
   ```

   This will:
   - Install dependencies inside the container.
   - Compile the TypeScript project.
   - Set up everything needed for the application.

### 2. Start the Application and PostgreSQL
   Use Docker Compose to start the bot and the PostgreSQL service in containers:
   ```bash
   docker-compose up
   ```

   This will:
   - Start the **PostgreSQL database** container.
   - Start the **Node.js app** container.

### 3. Connecting to PostgreSQL (Optional)
If you want to connect to the PostgreSQL instance inside the Docker container, you can do so with pgadmin. The server credentials will look similar to ones below:

   - **Host**: `localhost`
   - **Port**: `5433` (configured in the `docker-compose.yml` file)
   - **Username**: `postgres`
   - **Password**: `superhardpassword` (configured in the enviroment variables)

---

## Logs and Database

The bot logs alerts to the PostgreSQL database, recording information about price changes, thresholds, and timestamps.

### Data Persistence with Docker
The PostgreSQL data will persist using Docker volumes defined in the `docker-compose.yml`:

```yaml
volumes:
  pgdata:  # PostgreSQL data will be stored here
```

This ensures that your data is safe and will not be lost if the container stops or restarts.