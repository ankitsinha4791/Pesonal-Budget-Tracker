# Personal Budget Tracker

A simple web application to track personal income and expenses, built with Node.js, Express, MongoDB, and React.

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Running the Application](#running-the-application)
- [Usage](#usage)
- [Contributing](#contributing)
- [License](#license)

## Features

- User authentication (registration and login)
- Add, edit, and delete transactions (income and expenses)
- Categorize transactions
- View financial summary and transaction history

## Tech Stack

- **Frontend**: React
- **Backend**: Node.js, Express
- **Database**: MongoDB

## Project Structure
personal-budget-tracker/
├── backend/
│ ├── controllers/
│ ├── models/
│ ├── routes/
│ ├── app.js
│ └── package.json
├── frontend/
│ ├── public/
│ ├── src/
│ │ ├── components/
│ │ ├── pages/
│ │ ├── App.js
│ │ ├── index.js
│ │ └── styles/
│ ├── .env
│ └── package.json
├── README.md
├── Dockerfile
└── docker-compose.yml

## Installation

### Prerequisites

- Node.js and npm
- MongoDB

### Steps

1. Clone the repository:
    ```bash
    git clone https://github.com/ankitsinha4791/personal-budget-tracker.git
    cd personal-budget-tracker
    ```

2. Install backend dependencies:
    ```bash
    cd backend
    npm install
    ```

3. Install frontend dependencies:
    ```bash
    cd ../frontend
    npm install
    ```

4. Ensure MongoDB is running on your local machine or update the MongoDB connection string in `backend/app.js`.

## Running the Application

### Using Docker

1. Ensure Docker is installed and running on your machine.
2. Run the following command from the root directory to build and start the containers:
    ```bash
    docker-compose up --build
    ```

### Without Docker

1. Start the backend server:
    ```bash
    cd backend
    node app.js
    ```

2. Start the frontend server:
    ```bash
    cd ../frontend
    npm start
    ```

3. Open your browser and navigate to `http://localhost:3000` to view the application.

## Usage

### Register a New User

1. Navigate to the Registration page.
2. Enter a username and password.
3. Click "Register".

### Login

1. Navigate to the Login page.
2. Enter your username and password.
3. Click "Login".

### Add a Transaction

1. Navigate to the Dashboard.
2. Click "Add Transaction".
3. Enter the transaction details (type, amount, category).
4. Click "Submit".

### View Transactions

1. Navigate to the Dashboard.
2. View your transaction history and summary.

## Contributing

Contributions are welcome! Please create a pull request or open an issue to discuss improvements or fixes.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
