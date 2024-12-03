import { FormatsService } from '@app/shared/services/formats.service';
import * as entity from './billing-model';
export class Mapper {
	static getBillingDataMapper(response: entity.DataBillingTableMapper, formatsService: FormatsService): entity.DataBillingTableMapper {
		console.log(response.data[0]);
		
		let dataList: entity.DataBillingTable[] = [];

		response?.data?.forEach((data: entity.DataBillingTable): void => {
			dataList.push({
				...data,
				invoiceId: data?.invoiceId || '',
				clientName: data?.clientName || '',
				plantName: data?.plantId || '',
				rpu: data?.rpu || '',
				status: data.status,
				rate: data.rate,
				amounth: data.amounth,
				amountWithIva: data.iva,
				month: data.billingMonth,
				formattedRate: formatsService.moneyFormat(data.rate),
				formattedAmount: formatsService.moneyFormat(data.amounth),
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