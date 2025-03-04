/ASEPQUIZZ
 ├── src/
 │   ├── components/
 │   │   ├── layout/           # Layout components
 │   │   │   └── Layout.tsx
 │   │   ├── navigation/       # Navigation components
 │   │   │   └── Navigation.tsx
 │   │   ├── questions/        # Question-related components
 │   │   │   ├── MultipleChoiceQuestion.tsx
 │   │   │   ├── QuestionLayout.tsx
 │   │   │   ├── QuizQuestion.tsx
 │   │   │   └── SimpleChoiceQuestion.tsx
 │   │   ├── quiz/             # Quiz logic and presentation
 │   │   │   ├── QuickQuiz.tsx
 │   │   │   └── Quiz.tsx      # (This one seems less used, might be merged or removed later)
 │   │   ├── results/          # Result display components
 │   │   │   ├── Results.tsx
 │   │   │   └── Results.test.tsx
 │   │   ├── score/            # Score tracking components
 │   │   │   └── ScoreTracker.tsx
 │   ├── pages/           # Page-level components (Quiz, Results, etc.)
 │   ├── hooks/           # Custom React hooks
 │   ├── utils/           # Helper functions and utilities
 │   ├── styles/          # Global styles and theme configurations
 │   ├── types/           # TypeScript type definitions
 │   │   └── index.ts
 │   ├── App.tsx          # Main app entry point
 │   ├── main.tsx         # React DOM entry point
 ├── public/              # Static assets
 ├── backend/             # Express.js API (planned)
 ├── package.json         # Project dependencies
 ├── tsconfig.json        # TypeScript configuration
 ├── vite.config.ts       # Vite configuration
 ├── tailwind.config.js   # TailwindCSS config
 ├── .eslintrc.json       # Linter configuration
 ├── docker/              # Docker configuration files
 │   ├── frontend/        # Frontend Docker configuration
 │   ├── backend/         # Backend Docker configuration (for future)
 │   ├── database/        # Database Docker configuration (for future)
 │   └── nginx/           # Nginx configuration for production
 ├── docker-compose.yml   # Docker Compose configuration
 ├── docker-compose.prod.yml # Production Docker Compose configuration
 ├── .env.example         # Example environment variables
 ├── scripts/             # Deployment and maintenance scripts
 │   ├── deploy.sh        # Deployment script
 │   ├── update.sh        # Update script
 │   └── backup.sh        # Backup script
 └── docs/                # Deployment and maintenance documentation
     ├── deployment.md    # Deployment instructions
     ├── updates.md       # Update instructions
     └── database.md      # Future database integration guide
