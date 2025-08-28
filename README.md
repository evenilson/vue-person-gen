# Vue Person Generator

A Vue 3 application for generating realistic person profiles for testing and prototyping purposes.

## Features

- Generate random person profiles with realistic data
- Google authentication via Supabase
- Save generated persons to database
- Copy person data to clipboard
- Download person data as JSON
- Responsive design with dark/light mode support
- Accessibility features

## Development

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Build for production
pnpm build

# Preview production build
pnpm preview
```

## Environment Setup

Create a `.env` file with your Supabase credentials:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Tech Stack

- **Frontend**: Vue 3 + TypeScript + Vite
- **Styling**: CSS with OKLCH color space
- **State Management**: Pinia
- **Authentication**: Supabase Auth
- **Database**: Supabase PostgreSQL
- **Testing**: Vitest (unit) + Cypress (e2e)
- **API**: RandomUser.me for person data

## Project Structure

```
src/
├── components/          # Vue components
│   ├── authBar.vue     # Authentication UI
│   └── personWorkbench.vue # Main app interface
├── services/           # API and data services
│   ├── person-api.ts   # Person generation API
│   └── person-repo.ts  # Database operations
├── stores/             # Pinia stores
│   └── auth.ts         # Authentication state
├── lib/                # External library configs
│   └── supabase-client.ts
└── utils/              # Utility functions
    └── general.ts

cypress/
├── e2e/                # E2E test files
│   ├── app.cy.ts       # Core app tests
│   ├── auth.cy.ts      # Authentication tests
│   ├── database.cy.ts  # Database tests
│   ├── accessibility.cy.ts # A11y tests
│   └── responsive.cy.ts # Responsive tests
└── support/
    └── commands.ts     # Custom Cypress commands
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Run the test suite
6. Submit a pull request

## License

MIT
