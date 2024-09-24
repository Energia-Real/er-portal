	import * as entity from './pricing-model';
export class Mapper {
	static getPricingDataMapper(response: entity.DataTablePricingResponse): entity.DataPricingTableMapper {
		let dataList: entity.DataPricingTable[] = [];

		response?.response.pricingPagedResponse.data.forEach((data: entity.DataPricingTable): void => {
			dataList.push({
				...data,
				siteName: data?.siteName || '-',
				clientName: data?.clientName || '-',
				pricing: data?.pricing || 0,
			});
		});

		return {
			...response.response.pricingPagedResponse,
			data: dataList
		}
	}
}