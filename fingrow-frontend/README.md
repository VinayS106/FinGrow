# FinGrow

FinGrow is a personal finance management application designed to help users improve their financial well-being. It allows users to manage various income sources, track regular expenses, and save for specific goals—such as building an emergency fund or planning a vacation—through efficient tracking and budgeting features.

This project follows Test-Driven Development (TDD) principles to ensure reliable, high-quality code.

## Features

- **Login and Registration:**  
  Users can register and log in with a username and password.

- **Home Page:**  
  - **Forms:**
    - Add a transaction.
    - Set a budget.
    - Define a savings goal.
  - **Recent Transactions:**  
    Display the five most recent transactions.
  - **Generate Reports:**  
    - Choose the report type (e.g., monthly, yearly).
    - Enter a date range (From and To).
    - View the report for the selected period.
  - **Alerts:**  
    - Notify users when spending exceeds the budget.
    - Alert when savings goals reach 90%.

## Tech Stack

- **TypeScript:** For type-safe development.
- **Jest:** For unit testing.
- **React:** To build a dynamic and interactive user interface.
- **CSS:** For styling and layout.

## Project Setup

### Clone the Repositories

Clone both the frontend and backend repositories:

1. **Frontend Repository:**
    ```bash
    git clone https://github.com/ushasri2645/fingrow-frontend/tree/fingrow-frontend-1
    ```

2. **Backend Repository:**
    ```bash
    git clone https://github.com/ushasri2645/finGrow/tree/fingrow-3
    ```

### Backend Setup

1. Navigate to the backend directory:
    ```bash
    cd fingrow-3
    ```

2. Install the dependencies:
    ```bash
    npm install
    ```

3. Start the backend server:
    ```bash
    npm run dev
    ```

### Frontend Setup

1. Navigate to the frontend directory:
    ```bash
    cd fingrow-frontend-1
    ```

2. Install the dependencies:
    ```bash
    npm install
    ```

3. Start the frontend application:
    ```bash
    npm start
    ```

4. Open your browser and navigate to:
    ```
    http://localhost:3000/
    ```

## Running Tests

To run the tests using Jest, execute the following command:
```bash
npm test
