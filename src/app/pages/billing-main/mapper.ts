import { FormatsService } from '@app/shared/services/formats.service';
import * as entity from './billing-model';
export class Mapper {
	static getBillingDataMapper(response: entity.DataBillingTableMapper, formatsService: FormatsService): entity.DataBillingTableMapper {
		let dataList: entity.DataBillingTable[] = [];

		response?.data?.forEach((data: entity.DataBillingTable): void => {
			dataList.push({
				...data,
				invoiceId: data?.invoiceId || '',
				rate : data?.rate || 0,
				clientName: data?.clientName || '',
				plantName: data?.plantName || '',
				formatterStatus: data.status == 0 ? 'Created' : data.status == 1 ? 'Edited' : data.status == 2 ? 'Confirmed' : 'Pending',
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