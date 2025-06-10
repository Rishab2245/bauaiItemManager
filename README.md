# BauAI Assignment - Item Management Application

A Next.js application for managing items with user authentication and role-based access control.

## Features

- **Public Item Viewing**: Anyone can view all items
- **User Authentication**: Credentials-based login system
- **Item Management**: Logged-in users can create items
- **Access Control**: Users can only delete their own items
- **Admin Console**: Register new users with specified passwords

## Technology Stack

- **Frontend**: Next.js 15 with App Router
- **Styling**: Tailwind CSS + Radix UI components
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js with credentials provider
- **Password Hashing**: bcryptjs

## Database Schema

```sql
-- Database: bauai
-- Schema: website

CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(128),
  email VARCHAR(128) UNIQUE,
  password VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE items (
  id SERIAL PRIMARY KEY,
  title VARCHAR(128),
  description TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  created_by INTEGER REFERENCES users(id) ON DELETE CASCADE
);
```

## Setup Instructions

### Prerequisites

- Node.js 18+ and npm
- PostgreSQL database

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd bauai-assignment
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env` file with:
```env
DATABASE_URL="postgresql://developer:password01_@localhost:5432/bauai?schema=website"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here"
```

4. Set up the database:
```bash
# Generate Prisma client
npx prisma generate

# Run database migrations (if you have migration files)
npx prisma db push
```

5. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:3000`.

## Usage

### Admin Console
Visit `/admin` to register new users. Provide:
- Full name
- Email address
- Password

### User Login
Visit `/login` or click "Sign In" to authenticate with registered credentials.

### Item Management
- **View Items**: All items are visible on the homepage
- **Create Items**: Logged-in users can create new items with title and description
- **Delete Items**: Users can only delete items they created

## API Endpoints

- `GET /api/items` - Retrieve all items (public)
- `POST /api/items` - Create new item (authenticated)
- `DELETE /api/items/[id]` - Delete item (owner only)
- `POST /api/admin/register` - Register new user (admin)
- `POST /api/auth/[...nextauth]` - Authentication endpoints

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── auth/[...nextauth]/route.ts
│   │   ├── items/
│   │   │   ├── route.ts
│   │   │   └── [id]/route.ts
│   │   └── admin/register/route.ts
│   ├── components/
│   │   ├── SessionProvider.tsx
│   │   ├── ItemForm.tsx
│   │   └── ItemList.tsx
│   ├── admin/page.tsx
│   ├── login/page.tsx
│   ├── layout.tsx
│   └── page.tsx
├── types/next-auth.d.ts
└── prisma/schema.prisma
```

## Development Notes

- The application uses Next.js App Router for routing
- Authentication is handled by NextAuth.js with credentials provider
- Database interactions use Prisma ORM
- Styling is implemented with Tailwind CSS
- Form validation and error handling are included
- Responsive design for mobile and desktop

## Security Features

- Password hashing with bcryptjs
- Session-based authentication
- Authorization checks for item operations
- Input validation and sanitization
- CSRF protection via NextAuth.js

