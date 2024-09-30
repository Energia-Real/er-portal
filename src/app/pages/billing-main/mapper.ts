import * as entity from './billing-model';
export class Mapper {
	static getBillingDataMapper(response: entity.DataTableBillingResponse): entity.DataBillingTableMapper {
		let dataList: entity.DataBillingTable[] = [];

		response?.response?.data?.forEach((data: entity.DataBillingTable): void => {
			dataList.push({
				...data,
				externalId: data?.externalId || '',
				clientName: data?.clientName || '',
				plantName: data?.plantName || '',
				rpu: data?.rpu || '',
				generatedEnergyKwh: data?.generatedEnergyKwh || 0,
				amount: data?.amount || 0,
				amountWithIva: data?.amountWithIva || 0,
			});
		});

		return {
			...response.response,
			data: dataList
		}
	}
}