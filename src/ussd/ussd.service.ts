import { Injectable } from '@nestjs/common';
import { SessionDto } from 'src/dtos/Session.dto';
import { UssdRequestDto } from 'src/dtos/UssdRequest.dto';
import { UssdResponseDto } from 'src/dtos/ussdResponse.dto';
import { RedisService } from 'src/redis/redis.service';

@Injectable()
export class UssdService {
	constructor(
		private readonly redisService: RedisService,
	) { }

	public async getResponse(request: UssdRequestDto) {
		const result = await this.redisService.get(request.sessionId);
		if (!result) {
			return "Welcome to my app.\nSelect:\n1. Enter your name\n2. Enter your age";
		}

		const session: SessionDto = JSON.parse(result);
		const response: UssdResponseDto = {
			sessionId: request.sessionId,
			serviceCode: request.serviceCode,
			phoneNumber: request.phoneNumber,
			text: `${session.text}*${request.text}`,
			response: "",
			action: "CON",
			tag: "USSD test",
		};
		switch (session.step) {
			case UssdStep.ENTER_NAME_STEP:
				this.redisService.set(request.sessionId, JSON.stringify({ ...session, step: UssdStep.ENTER_AGE_VALUE_STEP }));
				response.response = "Enter your name";
				break;
			case UssdStep.ENTER_NAME_VALUE_STEP:
				response.action = "END";
				response.response = `Hello ${session.text}. Thanks for using my app.`;
				break;
			case UssdStep.ENTER_AGE_STEP:
				this.redisService.set(request.sessionId, JSON.stringify({ ...session, step: UssdStep.ENTER_AGE_VALUE_STEP }));
				response.response = "Enter your age";
				break;
			case UssdStep.ENTER_AGE_VALUE_STEP:
				try {
					const age = Number.parseInt(session.text);
					if (age < 18) {
						response.response = "You are not allowed to use this service.";
					}
					else if (age > 60) {
						response.response = "You are too old to use this service.";
					}
					else {
						response.response = `You are ${session.text}. Those are the best years of your life. Enjoy them`;
					}
					response.action = "END";
				} catch (error) {
					response.response = "Please enter a valid age.\nIt should be a number";
				}
				break;
			default:
				response.response = "Select:\n1. Enter your name\n2. Enter your age";
				break;
		}
		return response;
	}
}
