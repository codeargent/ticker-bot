# Ticker Bot

## Description
This bot uses the Uphold API to continuously retrieve the BTC-USD price at a certain interval (5 seconds). It warns the user when the price changes by 0.01% in either direction.

## Requirements
- Node.js v20+
- NPM

## Setup

1. Clone the repository
    ```bash
    git clone https://github.com/codeargent/ticker-bot
    ```
2. Install dependencies:
    ```bash
    npm install
    ```
3. Create `.env` file based on `.env.example`:
    ```bash
    cp .env.example .env
    ```
4. Modify the file `src/bot-config.ts` at your liking in order to enable the desired crons.
5. Build the program
    ```
    npm run build
    ```
6. Run the program
    ```
    npm run start
    ```

Feel free to terminate the program with `CTRL + C` command. The continuous execution with stop immediately.