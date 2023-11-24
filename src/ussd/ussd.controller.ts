import { Body, Controller, Post, Req } from '@nestjs/common';
import { UssdService } from './ussd.service';
import { UssdRequestDto } from 'src/dtos/UssdRequest.dto';

@Controller('ussd')
export class UssdController {
	constructor(
		private readonly ussdService: UssdService,
	) {}

	@Post("/requests")
	async request(@Body() requestBody: UssdRequestDto) {
		console.log(requestBody)
		return this.ussdService.getResponse(requestBody);
	}
}
