import { Injectable } from '@nestjs/common';
import { RedisModules, createClient } from 'redis';

@Injectable()
export class RedisService {
	private client: any;

	constructor() {
		this.initialClient();
	}
	async initialClient() {
		this.client = await createClient();
		this.client.on('error', function (error) {
			console.error(error);
		});

		this.client.on('connect', function () {
			console.log('Connected to redis successfully');
		});
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
			return await this.client.get(key);
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

