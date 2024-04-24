import * as entity from './assets-model';

export class Mapper {
		static getLocalTimeOfPlaceMapper(response: entity.DataLocalTime) : string {
		const timeZoneOffset = response.rawOffset + response.dstOffset;
		const localTime = new Date(Date.now() + timeZoneOffset * 1000);
		return localTime.toLocaleTimeString('en-US', { hour12: true });
	}
}
