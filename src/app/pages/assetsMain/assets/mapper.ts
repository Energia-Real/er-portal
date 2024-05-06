import * as entity from './assets-model';

export class Mapper {
	static getDataRespSiteMapper(response: entity.DataDetails[]): entity.DataResponseDetailsMapper[] {
		let dataList: entity.DataResponseDetailsMapper[] = [];

		response.forEach((data: any): void => {
			let formattedValue: string = data.value;
		
			if (data.value.includes('.') || data.value === '0') formattedValue = parseFloat(data.value).toFixed(2);
		
			dataList.push({
				title: data.title,
				description: formattedValue
			  });
		});

		return dataList
	}


	static getLocalTimeOfPlaceMapper(response: entity.DataLocalTime): string {
		const timeZoneOffset = response.rawOffset + response.dstOffset;
		const localTime = new Date(Date.now() + timeZoneOffset * 1000);
		return localTime.toLocaleTimeString('en-US', { hour12: true });
	}
}
