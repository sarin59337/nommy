# Nommy

A simple fetch wrapper that "eats" APIs.

## Installation

```bash
npm install nommy
# or
yarn add nommy
# or
pnpm add nommy
```

## Usage

```typescript
import Nommy from 'nommy';

const api = new Nommy({
  baseURL: 'https://api.example.com',
  timeout: 5000,
});

// GET request
const response = await api.get('/users');
console.log(response.data);

// POST request
const newUser = await api.post('/users', {
  name: 'John Doe',
  email: 'john@example.com',
});
console.log(newUser.data);
```

## Features

- Simple and lightweight
- TypeScript support
- Timeout handling
- Base URL configuration
- Automatic JSON parsing
- Error handling

## License

MIT
