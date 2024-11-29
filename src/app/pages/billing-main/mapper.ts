import { FormatsService } from '@app/shared/services/formats.service';
import * as entity from './billing-model';
export class Mapper {
	static getBillingDataMapper(response: entity.DataTableBillingResponse, formatsService: FormatsService): entity.DataBillingTableMapper {
		console.log('MAPPER', response.response.data);
		
		let dataList: entity.DataBillingTable[] = [];

		response?.response?.data?.forEach((data: entity.BillingData): void => {
			dataList.push({
				...data,
				externalId: data?.externalId || '',
				clientName: data?.client.clientName || '',
				plantName: data?.plant.plantName || '',
				rpu: data?.plant.rpu || '',
				status: data.status,
				rate: data.rate,
				amount: data.amount.total,
				amountWithIva: data.amount.iva.value,
				month: data.billingMonth,
				formattedRate: formatsService.moneyFormat(data.rate),
				formattedAmount: formatsService.moneyFormat(data.amount.total),
				formattedAmountWithIva: formatsService.moneyFormat(data.amount.iva.value),
				generatedEnergyKwh: data.generatedEnergyKwh,
				originalGeneratedEnergyKwh: data.generatedEnergyKwh,
				formattedGeneratedEnergyKwh: formatsService.energyWithDecimals(data.generatedEnergyKwh)
			});
		});

		return {
			...response.response,
			data: dataList
		}
	}
}