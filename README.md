# Personal Finance Tracker

A production-ready Personal Finance Tracker application built with Next.js, MongoDB, and modern tooling. Track your income and expenses with comprehensive analytics, filtering, and export capabilities.

## Features

- **Transaction Management**: Add, edit, and delete income and expense transactions
- **Category Management**: Create and manage custom income and expense categories
- **Advanced Filtering**: Filter transactions by date range, category, type, and amount
- **Sorting**: Sort transactions by date, amount, or category
- **Data Visualization**: Interactive charts showing monthly trends, expense breakdowns, and net trends
- **CSV Export**: Export transaction data as CSV files
- **Responsive Design**: Fully responsive UI that works on mobile, tablet, and desktop
- **Type Safety**: Full TypeScript support throughout the application

## Technology Stack

- **Frontend Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Database**: MongoDB with Mongoose
- **Charts**: Recharts
- **Testing**: React Testing Library + Jest
- **Git Hooks**: Lefthook
- **State Management**: React Context API
- **Form Validation**: React Hook Form + Zod

## Prerequisites

- Node.js 18+ and npm/yarn/pnpm
- MongoDB (local installation or MongoDB Atlas account)

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd personal-finance-tracker
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

Edit `.env.local` and add your MongoDB connection string:
```
MONGODB_URI=mongodb://localhost:27017/personal-finance-tracker
```

For MongoDB Atlas:
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/personal-finance-tracker?retryWrites=true&w=majority
```

4. Set up Lefthook (for git hooks):
```bash
npm install -g @lefthook/lefthook
lefthook install
```

## Database Setup

### Local MongoDB

1. Install MongoDB locally or use Docker:
```bash
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

2. The application will automatically create the database and collections on first use.

### MongoDB Atlas

1. Create a free account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new cluster
3. Create a database user
4. Whitelist your IP address (or use 0.0.0.0/0 for development)
5. Get your connection string and add it to `.env.local`

## Running the Application

### Development Mode

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build

```bash
npm run build
npm start
```

## Testing

Run tests:
```bash
npm test
```

Run tests in watch mode:
```bash
npm run test:watch
```

Generate coverage report:
```bash
npm run test:coverage
```

## Git Workflow with Lefthook

This project uses Lefthook for git hooks to ensure code quality:

- **pre-commit**: Runs ESLint, Prettier, and TypeScript type checking
- **commit-msg**: Enforces conventional commit message format
- **pre-push**: Runs tests before pushing

### Conventional Commits

Commit messages must follow this format:
```
<type>(<scope>): <subject>

[optional body]

[optional footer]
```

Types:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

Examples:
```
feat: add transaction filtering
fix: resolve date formatting issue
docs: update README with setup instructions
```

## Deployment

### Vercel Deployment

1. Push your code to GitHub/GitLab/Bitbucket
2. Import your repository in Vercel
3. Add environment variables in Vercel dashboard:
   - `MONGODB_URI`: Your MongoDB connection string
   - `NEXT_PUBLIC_APP_URL`: Your application URL
4. Deploy

### MongoDB Atlas Setup for Production

1. Create a production cluster in MongoDB Atlas
2. Create a database user with appropriate permissions
3. Configure IP whitelist (add Vercel IP ranges or 0.0.0.0/0)
4. Get connection string and add to Vercel environment variables

## Project Structure

```
/app
  /api              # API routes
    /transactions   # Transaction CRUD endpoints
    /categories     # Category CRUD endpoints
    /analytics      # Analytics data endpoint
    /export         # CSV export endpoint
  /dashboard        # Dashboard page
  /components       # React components
  /contexts         # React Context providers
/components         # shadcn/ui components
/lib
  /db              # MongoDB connection
  /models           # Mongoose schemas
  /utils            # Utility functions
/hooks              # Custom React hooks
/types              # TypeScript type definitions
/tests              # Test files
```

## API Documentation

### Transactions

- `GET /api/transactions` - Get all transactions (supports query params: startDate, endDate, category, type, minAmount, maxAmount)
- `POST /api/transactions` - Create a new transaction
- `GET /api/transactions/[id]` - Get a single transaction
- `PUT /api/transactions/[id]` - Update a transaction
- `DELETE /api/transactions/[id]` - Delete a transaction

### Categories

- `GET /api/categories` - Get all categories (supports query param: type)
- `POST /api/categories` - Create a new category
- `GET /api/categories/[id]` - Get a single category
- `PUT /api/categories/[id]` - Update a category
- `DELETE /api/categories/[id]` - Delete a category

### Analytics

- `GET /api/analytics?months=6` - Get analytics data (defaults to 6 months)

### Export

- `GET /api/export/csv?startDate=&endDate=` - Export transactions as CSV

## Usage Guide

1. **Create Categories**: Click "Manage Categories" to create income and expense categories
2. **Add Transactions**: Click "Add Transaction" to record income or expenses
3. **View Analytics**: Dashboard shows summary cards and charts
4. **Filter Transactions**: Use the filter controls in the transactions table
5. **Export Data**: Click "Export CSV" to download transaction data

## Known Limitations

- No user authentication (single-user application)
- No data backup/restore functionality
- Limited to 6 months of analytics data by default

## Future Improvements

- User authentication and multi-user support
- Recurring transactions
- Budget planning and tracking
- Email notifications
- Mobile app
- Advanced reporting and insights
- Data import functionality
- Dark mode toggle

## License

MIT License - see LICENSE file for details

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feat/amazing-feature`)
3. Commit your changes using conventional commits (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feat/amazing-feature`)
5. Open a Pull Request

