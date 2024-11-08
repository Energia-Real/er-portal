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
				rate: data.rate,
				amount: data.amount,
				amountWithIva: data.amountWithIva,
				month: data.month,
				formattedMonth: formatsService.getMonthName(data.month),
				formattedRate: formatsService.moneyFormat(parseFloat(data.rate)),
				formattedAmount: formatsService.moneyFormat(parseFloat(data.amount)),
				formattedAmountWithIva: formatsService.moneyFormat(parseFloat(data.amountWithIva)),
				generatedEnergyKwh: data.generatedEnergyKwh,
				originalGeneratedEnergyKwh: data.generatedEnergyKwh,
				formattedGeneratedEnergyKwh: formatsService.energyFormat(data.generatedEnergyKwh)
			});
		});

		return {
			...response.response,
			data: dataList
		}
	}
}