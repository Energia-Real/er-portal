import * as moment from 'moment-timezone';
import * as entity from './assets-model';
import { FormatsService } from '@app/shared/services/formats.service';

export class Mapper {
	static getDataRespSiteMapper(response: entity.DataDetails[], formatsService: FormatsService): entity.DataResponseDetailsMapper[] {
		let dataList: entity.DataResponseDetailsMapper[] = [];

		response.forEach((data: any): void => {
			let formattedValue: string = data.value;
		
			if (data.value.includes('.') || data.value === '0') formattedValue = formatsService.energyFormat(parseFloat(data.value));
		
			dataList.push({
				title: data.title,
				description: formattedValue
			  });
		});

		return dataList
	}

	static getDataRespOverviewMapper(response: any): entity.DataResponseDetailsMapper[] {
	// static getDataRespOverviewMapper(response: entity.DataResponseDetailsClient): entity.DataResponseDetailsMapper[] {

		console.log(response);
		
		let dataList: entity.DataResponseDetailsMapper[] = [];
		  dataList.push({
			title: 'RPU',
			description: response.rpu ?? "N/A"
		  });
		  dataList.push({
			title: 'Age of the site',
			description: 'N/A'
		  });
		  dataList.push({
			title: 'Mounting Technology',
			description: response.mountingTechnology ?? "N/A"
		  });
		  dataList.push({
			title: 'Install Date',
			description: response.endInstallationDate?? "N/A"
		  });
		  dataList.push({
			title: 'COD',
			description:response.contractSignatureDate?? 'N/A'
		  });
		  dataList.push({
			title: 'Roof Type',
			description: response.roofType ?? "N/A"
		  });
		  dataList.push({
			title: 'Commission Date',
			description: response.commissionDate?? 'N/A'
		  });
		  dataList.push({
			title: 'Payment Due Date',
			description: 'N/A'
		  });
		  dataList.push({
			title: 'Plant Code',
			description: response.plantCode??'N/A'
		  });
		return dataList
	}

	static mapToClientData(mapperData: entity.DataResponseDetailsMapper): Partial<entity.DataResponseDetailsClient> {
		const clientData: Partial<entity.
		DataResponseDetailsClient> = {};
	
		switch (mapperData.title) {
		  case 'Install Date':
			clientData.endInstallationDate = mapperData.description;
			break;
		  case 'COD':
			clientData.contractSignatureDate = mapperData.description;
			break;
		  case 'Commission Date':
			clientData.commissionDate = mapperData.description;
			break;
		  default:
			break;
		}
		return clientData;
	}


	static getLocalTimeOfPlaceMapper(response: entity.DataLocalTime): string {
		const utcTime = moment.utc();
		const localTime = utcTime.tz(response.timeZoneId); 
		return localTime.format('hh:mm A'); 
	  }
}
