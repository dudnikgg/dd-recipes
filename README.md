# DD Recipes

> A modern recipe management application built with Vue.js/Nuxt.js

## Live Demo

Check out the current version: [https://recipes.dudnikgg.space](https://recipes.dudnikgg.space)

⚠️ **Note**: This project is currently in active development and not yet ready for production use. It serves as my learning journey into Vue.js/Nuxt.js while aiming to become a fully functional recipe management solution.

## Project Overview

DD Recipes is being developed as a platform for managing recipes, planning meals, and organizing ingredients. While it originated as my personal project to learn the Vue.js/Nuxt.js stack, it's gradually evolving into what will eventually be a full-featured recipe management application.

The project is actively maintained as I continue learning and implementing new features. Feel free to try out the demo, but please note that features might be incomplete or subject to significant changes.

## Tech Stack

- **Frontend:** Vue 3, Nuxt 3
- **Styling:** Tailwind CSS
- **Authentication:** Better Auth
- **Database:** Turso (SQLite)
- **ORM:** Drizzle
- **Type Safety:** TypeScript

## Development Setup

### Prerequisites

- Node.js (v18 or later)
- pnpm
- Docker (for local development)

### Getting Started

1. Clone the repository

```bash
git clone https://github.com/your-username/dd-recipes.git
cd dd-recipes
```

2. Install dependencies

```bash
pnpm install
```

3. Set up environment variables

```bash
# Create a .env file with the following variables
TURSO_DATABASE_URL=
TURSO_AUTH_TOKEN=
BETTER_AUTH_SECRET=
BETTER_AUTH_URL=
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
```

4. Run development server

```bash
pnpm dev
```

### Available Commands

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm lint` - Run linting
- `pnpm lint:fix` - Fix linting issues
- `pnpm typecheck` - Run type checking
- `pnpm db:generate` - Generate database types
- `pnpm db:migrate` - Run database migrations
- `pnpm db:studio` - Open database UI
- `pnpm db:seed` - Seed database with sample data

## Current Features

- User authentication (Email + Google)
- Recipe management
- Ingredient tracking
- Meal planning (in development)
- Dark/Light theme support

## Development Status

This project is in active development as part of my learning journey with Vue.js/Nuxt.js. While the demo is available for testing, please be aware that:

- Features may be incomplete or change significantly
- Data persistence is not guaranteed
- Regular updates may introduce breaking changes
- Not all error cases are handled yet

## Contributing

While this project serves as my learning platform, I welcome feedback and suggestions. Feel free to open issues for bugs or feature requests.

## License

This project is private and not licensed for distribution.
