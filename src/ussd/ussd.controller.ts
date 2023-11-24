import { Controller, Post, Req } from '@nestjs/common';
import { UssdService } from './ussd.service';

@Controller('ussd')
export class UssdController {
	constructor(
		private readonly ussdService: UssdService,
	) {}

	@Post("/requests")
	async request(@Req() request) {
		return this.ussdService.getResponse(request);
	}
}
