# Database Seeding Instructions

This document provides instructions on how to seed your database with sample data for your e-commerce application.

## Available Seed Scripts

There are two seed scripts available:

1. **Main Seed Script**: Creates basic data including users, products, careers, reviews, orders, etc.
2. **Additional Seed Script**: Adds more sample data for products, careers, reviews, and categories.

## Prerequisites

Before running the seed scripts, make sure you have:

1. Set up your database connection in the `.env` file
2. Installed all dependencies with `npm install` or `yarn install`

## Running the Seed Scripts

### Step 1: Run the Main Seed Script

This script will create the basic data needed for your application:

```bash
npm run seed
# or
yarn seed
```

### Step 2: Run the Additional Seed Script

After running the main seed script, you can add more sample data with:

```bash
npm run seed:additional
# or
yarn seed:additional
```

## What Data is Added?

### Main Seed Script (`prisma/seed.ts`)

- Users with different roles (admin, manager, regular user)
- Basic products across different categories
- Sample blog posts
- Career opportunities
- Reviews, orders, and cart items

### Additional Seed Script (`prisma/additional-seed.ts`)

- 10 additional products with diverse categories
- 10 additional product reviews
- 5 additional career opportunities
- Updates product review counts and ratings

## Notes

- The additional seed script depends on the main seed script, as it references users created by the main script.
- If you encounter any errors, make sure your database is properly set up and the main seed script has been run first.
- The seed scripts will clear existing data before adding new data to avoid duplicates.

## Customizing the Seed Data

If you want to customize the seed data:

1. Edit `prisma/seed.ts` for the main data
2. Edit `prisma/additional-seed.ts` for the additional data
3. Run the appropriate seed script after making changes 