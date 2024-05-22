import * as moment from 'moment-timezone';
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

	static getDataRespOverviewMapper(response: entity.DataResponseDetailsClient): entity.DataResponseDetailsMapper[] {
		let dataList: entity.DataResponseDetailsMapper[] = [];

		/* response.forEach((data: any): void => {
			let formattedValue: string = data.value;
		
			if (data.value.includes('.') || data.value === '0') formattedValue = parseFloat(data.value).toFixed(2);
		
			dataList.push({
				title: data.title,
				description: formattedValue
			  });
		}); */

		
		  dataList.push({
			title: 'Age of the site',
			description: 'N/A'
		  });
		  dataList.push({
			title: 'Mounting Technology',
			description: 'NA'
		  });
		  dataList.push({
			title: 'Install Date',
			description: response.endInstallationDate
		  });
		  dataList.push({
			title: 'Modules',
			description: 'N/A'
		  });
		  dataList.push({
			title: 'COD',
			description:response.contractSignatureDate
		  });
		  dataList.push({
			title: 'Roof Type',
			description: 'N/A'
		  });
		  dataList.push({
			title: 'Commission Date',
			description: response.commissionDate
		  });
		  dataList.push({
			title: 'Payment Due Date',
			description: 'NA'
		  });
		  dataList.push({
			title: 'Estimated Payment Amount',
			description: 'NA'
		  });
		return dataList
	}


	static getLocalTimeOfPlaceMapper(response: entity.DataLocalTime): string {
		const utcTime = moment.utc();
		const localTime = utcTime.tz(response.timeZoneId); 
		return localTime.format('hh:mm A'); 
	  }
}
