# MONOREPO_STRUCTURE

This document outlines the directory layout of the `recipe-generator` monorepo and provides guidance on how to work with both the frontend and backend components.

## Directory Layout

```
recipe-generator/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   └── styles/
│   ├── public/
│   └── package.json
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── models/
│   │   └── routes/
│   ├── config/
│   └── package.json
├── README.md
└── MONOREPO_STRUCTURE.md
```

## Working with Frontend

1. Navigate to the `frontend` directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm start
   ```

## Working with Backend

1. Navigate to the `backend` directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the backend server:
   ```bash
   node index.js
   ```

## Conclusion

This structure allows for clear separation between the frontend and backend, making it easier to manage and develop the two components independently.