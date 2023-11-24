import { Injectable } from '@nestjs/common';
import { SessionDto } from 'src/dtos/Session.dto';
import { UssdRequestDto } from 'src/dtos/UssdRequest.dto';
import { UssdResponseDto } from 'src/dtos/ussdResponse.dto';
import { UssdStep } from 'src/enums/ussdSteps.enum';
import { RedisService } from 'src/redis/redis.service';

@Injectable()
export class UssdService {
	constructor(
		private readonly redisService: RedisService,
	) { }

	public async getResponse(request: UssdRequestDto) {

		const result = await this.redisService.get(request.sessionId);
		const response: UssdResponseDto = {
			sessionId: request.sessionId,
			serviceCode: request.serviceCode,
			phoneNumber: request.phoneNumber,
			text: ``,
			response: "Welcome to my app.\nSelect:\n1. Enter your name\n2. Enter your age",
			action: "CON",
			tag: "USSD test",
		};
		if (!result) {
			const new_session: SessionDto = {
				sessionId: request.sessionId,
				text: "",
				step: UssdStep.WELCOME_PAGE,
			};
			this.redisService.set(request.sessionId, JSON.stringify({ ...new_session, step: UssdStep.WELCOME_PAGE }));
			console.log(response)
			return response;
		}
		const session: SessionDto = JSON.parse(result);
		session.text = response.text = `${session.text}*${request.text}`;

		switch (session.step) {
			case UssdStep.WELCOME_PAGE:
				if (request.text === "1") {
					this.redisService.set(request.sessionId, JSON.stringify({ ...session, step: UssdStep.ENTER_NAME_VALUE_STEP }));
					response.response = "Enter your name";
					break;
				}
				if (request.text === "2") {
					this.redisService.set(request.sessionId, JSON.stringify({ ...session, step: UssdStep.ENTER_AGE_VALUE_STEP }));
					response.response = "Enter your age";
					break;
				}

			case UssdStep.ENTER_NAME_VALUE_STEP:
				response.action = "END";
				response.response = `Hello ${request.text}. Thanks for using my app.`;
				this.redisService.del(request.sessionId);
				break;

			case UssdStep.ENTER_AGE_VALUE_STEP:
				const age = +request.text;
				if (typeof age !== "number") {
					response.response = "Please enter a valid age.\nIt should be a positive integer.";
				}
				else if (age < 18) {
					response.response = "You are not allowed to use this service.";
				}
				else if (age > 60) {
					response.response = "You are too old to use this service.";
				}
				else {
					response.response = `You are ${request.text}. Those are the best years of your life. Enjoy them.`;
				}
				response.action = "END";
				this.redisService.del(request.sessionId);

				break;
			default:
				response.response = "Select:\n1. Enter your name\n2. Enter your age";
				break;
		}
		console.log(response)
		return response;
	}
}
