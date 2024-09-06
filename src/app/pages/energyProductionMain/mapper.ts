import * as moment from 'moment-timezone';
import * as entity from './energy-production-model';
import { FormatsService } from '@app/shared/services/formats.service';

export class Mapper {
	static getClientsDataMapper(response: entity.DataTableResponse): entity.DataTableResponse {
		
		console.log('MAPPER', response.data);
		
		let dataList: entity.DataClientsTable[] = [];

		response?.data.forEach((data: entity.DataClientsTable): void => {

			dataList.push({
				...data,
				nombre : data?.nombre || '-'
			});
		});

		return {
			...response,
			data: dataList
		}
	}
}
