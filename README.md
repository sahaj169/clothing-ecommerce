# StyleHub E-Commerce Website

StyleHub is a modern e-commerce platform built with Next.js, offering a seamless shopping experience for fashion products across men's, women's, and kids' categories.

## Features

- **Responsive Design**: Fully responsive UI that works on all devices
- **Product Categories**: Browse products by men's, women's, and kids' categories
- **Product Details**: View detailed product information, select sizes, and add to cart
- **Shopping Cart**: Add items to cart, update quantities, and remove items
- **User Authentication**: Register, login, and manage your account
- **Checkout Process**: Secure checkout flow with shipping information
- **Order Management**: View and track your orders
- **Admin Dashboard**: Manage products, orders, and users (admin only)

## Tech Stack

- **Frontend**: Next.js, React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: MongoDB with Prisma ORM
- **Authentication**: NextAuth.js
- **State Management**: Zustand
- **Styling**: Tailwind CSS with shadcn/ui components

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- MongoDB database

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/stylehub.git
   cd stylehub
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a `.env` file in the root directory with the following variables:
   ```
   DATABASE_URL="your-mongodb-connection-string"
   NEXTAUTH_SECRET="your-nextauth-secret"
   NEXTAUTH_URL="http://localhost:3000"
   JWT_SECRET="your-jwt-secret"
   ```

4. Set up the database:
   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. Seed the database with initial data:
   ```bash
   npm run seed
   ```

6. Start the development server:
   ```bash
   npm run dev
   ```

7. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Demo Accounts

- **Admin User**:
  - Email: admin@stylehub.com
  - Password: admin123

- **Regular User**:
  - Email: user@example.com
  - Password: user123

## Deployment

The application can be deployed to Vercel with minimal configuration:

```bash
npm run build
```

## License

This project is licensed under the MIT License - see the LICENSE file for details.
