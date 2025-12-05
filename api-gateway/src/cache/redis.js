import { createClient } from 'redis';
import dotenv from 'dotenv';

dotenv.config();

let redisClient = null;
let pubClient = null;
let subClient = null;

export async function initRedis() {
  const redisUrl = process.env.REDIS_URL || 'redis://redis:6379';
  
  redisClient = createClient({ url: redisUrl });
  pubClient = createClient({ url: redisUrl });
  subClient = createClient({ url: redisUrl });

  redisClient.on('error', (err) => console.error('Redis Client Error', err));
  pubClient.on('error', (err) => console.error('Redis Pub Error', err));
  subClient.on('error', (err) => console.error('Redis Sub Error', err));

  await redisClient.connect();
  await pubClient.connect();
  await subClient.connect();

  return { redisClient, pubClient, subClient };
}

export function getRedis() {
  return redisClient;
}

export function getPubClient() {
  return pubClient;
}

export function getSubClient() {
  return subClient;
}

export async function cacheGet(key) {
  if (!redisClient) return null;
  try {
    const value = await redisClient.get(key);
    return value ? JSON.parse(value) : null;
  } catch (error) {
    console.error('Cache get error:', error);
    return null;
  }
}

export async function cacheSet(key, value, ttl = 300) {
  if (!redisClient) return false;
  try {
    await redisClient.setEx(key, ttl, JSON.stringify(value));
    return true;
  } catch (error) {
    console.error('Cache set error:', error);
    return false;
  }
}

export async function cacheDel(key) {
  if (!redisClient) return false;
  try {
    await redisClient.del(key);
    return true;
  } catch (error) {
    console.error('Cache del error:', error);
    return false;
  }
}

