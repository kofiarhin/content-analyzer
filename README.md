# Full Stack Starter

A full-stack boilerplate project with Node.js/Express backend and React frontend.

## Tech Stack

### Backend

- Node.js
- Express.js
- MongoDB (Mongoose)
- JWT Authentication
- bcrypt for password hashing
- CORS

### Frontend

- React 19
- Vite
- React Router DOM
- SCSS
- ESLint

## Installation

1. Clone the repository:

```bash
git clone git@github.com:kofiarhin/full-stack-starter.git
cd full-stack-starter
```

2. Install dependencies:

```bash
npm install
cd client && npm install && cd ..
```

3. Set up environment variables:
   Create a `.env` file in the server directory with your MongoDB connection string and JWT secret.

## Usage

### Development

Run both server and client concurrently:

```bash
npm run dev
```

### Run server only

```bash
npm run server
```

### Run client only

```bash
npm run client
```

### Testing

```bash
npm test
```

## Project Structure

```
full-stack-starter/
├── client/              # React frontend
│   ├── src/
│   ├── public/
│   └── package.json
├── server/              # Express backend
│   ├── app.js
│   ├── server.js
│   └── __test__/
├── package.json
└── README.md
```

## API Endpoints

- `GET /` - Welcome message
- `POST /api/health` - Health check

## License

ISC
