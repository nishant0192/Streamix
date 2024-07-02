-- Create extension if not exists
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE IF NOT EXISTS "users" (
    "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "username" VARCHAR(255) UNIQUE NOT NULL,
    "email" VARCHAR(255) UNIQUE NOT NULL,
    "passwordHash" VARCHAR(255) NOT NULL,
    "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Channels table
CREATE TABLE IF NOT EXISTS "channels" (
    "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "name" VARCHAR(255) NOT NULL,
    "channelId" VARCHAR(6) UNIQUE NOT NULL,
    "userId" UUID REFERENCES "users"("id") ON DELETE CASCADE,
    "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Videos table
CREATE TABLE IF NOT EXISTS "videos" (
    "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "title" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "telegramFileId" VARCHAR(255) UNIQUE NOT NULL,
    "extension" VARCHAR(10) NOT NULL,
    "channelId" UUID REFERENCES "channels"("id") ON DELETE CASCADE,
    "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Comments table
CREATE TABLE IF NOT EXISTS "comments" (
    "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "videoId" UUID REFERENCES "videos"("id") ON DELETE CASCADE,
    "userId" UUID REFERENCES "users"("id") ON DELETE CASCADE,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Likes table
CREATE TABLE IF NOT EXISTS "likes" (
    "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "videoId" UUID REFERENCES "videos"("id") ON DELETE CASCADE,
    "userId" UUID REFERENCES "users"("id") ON DELETE CASCADE,
    "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Dislikes table
CREATE TABLE IF NOT EXISTS "dislikes" (
    "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "videoId" UUID REFERENCES "videos"("id") ON DELETE CASCADE,
    "userId" UUID REFERENCES "users"("id") ON DELETE CASCADE,
    "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- VideoMetadata table
CREATE TABLE IF NOT EXISTS "videoMetadata" (
    "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "videoId" UUID REFERENCES "videos"("id") ON DELETE CASCADE,
    "views" INTEGER DEFAULT 0,
    "likes" INTEGER DEFAULT 0,
    "dislikes" INTEGER DEFAULT 0,
    "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
