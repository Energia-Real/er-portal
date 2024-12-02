import { FormatsService } from '@app/shared/services/formats.service';
import * as entity from './billing-model';
export class Mapper {
	static getBillingDataMapper(response: entity.DataBillingTableMapper, formatsService: FormatsService): entity.DataBillingTableMapper {
		console.log(response.data);
		
		let dataList: entity.DataBillingTable[] = [];

		response?.data?.forEach((data: entity.DataBillingTable): void => {
			dataList.push({
				...data,
				externalId: data?.externalId || '',
				clientName: data?.clientName || '',
				plantName: data?.plantId || '',
				rpu: data?.rpu || '',
				status: data.status,
				rate: data.rate,
				amount: data.amount,
				amountWithIva: data.iva,
				month: data.billingMonth,
				formattedRate: formatsService.moneyFormat(data.rate),
				formattedAmount: formatsService.moneyFormat(data.amount),
				formattedAmountWithIva: formatsService.moneyFormat(data.iva),
				generatedEnergyKwh: data.generatedEnergyKwh,
				originalGeneratedEnergyKwh: data.generatedEnergyKwh,
				formattedGeneratedEnergyKwh: formatsService.energyWithDecimals(data.generatedEnergyKwh)
			});
		});

		return {
			...response,
			data: dataList
		}
	}
}