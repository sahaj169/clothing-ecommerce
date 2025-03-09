#!/bin/bash

# Generate Prisma client
npx prisma generate

# Push schema to database
npx prisma db push

# Seed the database
npm run seed

# Start the development server
npm run dev 