import { FormatsService } from '@app/shared/services/formats.service';
import * as entity from './billing-model';
export class Mapper {
	static getBillingDataMapper(response: entity.DataTableBillingResponse, formatsService: FormatsService): entity.DataBillingTableMapper {
		let dataList: entity.DataBillingTable[] = [];
		response?.response?.data?.forEach((data: entity.DataBillingTable): void => {
			dataList.push({
				...data,
				externalId: data?.externalId || '',
				clientName: data?.clientName || '',
				plantName: data?.plantName || '',
				rpu: data?.rpu || '',
				rate: formatsService.moneyFormat(parseFloat(data.rate)),
				amount: formatsService.moneyFormat(parseFloat(data.amount)),
				amountWithIva: formatsService.moneyFormat(parseFloat(data.amountWithIva)),
				generatedEnergyKwh: formatsService.energyFormat(data.generatedEnergyKwh)
			});
		});

		return {
			...response.response,
			data: dataList
		}
	}
}