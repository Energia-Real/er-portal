	import * as entity from './billing-model';
export class Mapper {
	static getBillingDataMapper(response: entity.DataTableBillingResponse): entity.DataBillingTableMapper {
		let dataList: entity.DataBillingTable[] = [];

		response?.response?.billingPagedResponse?.data.forEach((data: entity.DataBillingTable): void => {
			dataList.push({
				...data,
				siteName: data?.siteName || '-',
				clientName: data?.clientName || '-',
				billing: data?.billing || 0,
			});
		});

		return {
			...response.response.billingPagedResponse,
			data: dataList
		}
	}
}