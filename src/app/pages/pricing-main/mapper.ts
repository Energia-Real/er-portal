	import * as entity from './pricing-model';
export class Mapper {
	static getPricingDataMapper(response: entity.DataTablePricingResponse): entity.DataPricingTableMapper {
		let dataList: entity.DataPricingTable[] = [];

		response?.response?.data.forEach((data: entity.DataPricingTable): void => {
			dataList.push({
				...data,
				clientId: data?.clientId || '',
				clientName: data?.clientName || '',
				plantId: data?.plantId || '',
				externalId: data?.externalId || '',
				plantName: data?.plantName || '',
				rpu: data?.rpu || '',
				kwh: data?.kwh || 0,
				month: data?.month || 0,
				year: data?.year || 0,
			});
		});

		return {
			...response.response,
			data: dataList
		}
	}
}