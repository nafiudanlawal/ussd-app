import { Injectable } from '@nestjs/common';
import { RedisModules, createClient } from 'redis';

@Injectable()
export class RedisService {
	private client: any;

	constructor() {
		this.initialClient();
	}
	async initialClient() {
		this.client = await createClient()
			.on('error', err => console.log('Redis Client Error', err))
			.connect();
	}

	async set(key: string, value: string): Promise<string> {
		try {
			return await this.client.set(key, value);
		} catch (error) {
			console.error("Failed to set value in Redis:", error);
			throw error;
		}
	}

	async get(key: string): Promise<string | null> {
		try {
			const result = await this.client.get(key);
			console.log({result});
			return result;
		} catch (error) {
			console.error("Failed to get value from Redis:", error);
			throw error;
		}
	}

	async del(key: string): Promise<number> {
		try {
			return await this.client.del(key);
		} catch (error) {
			console.error("Failed to delete value from Redis:", error);
			throw error;
		}
	}
}

