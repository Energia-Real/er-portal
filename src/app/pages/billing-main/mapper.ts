import { FormatsService } from '@app/shared/services/formats.service';
import * as entity from './billing-model';
export class Mapper {
	static getBillingDataMapper(response: entity.DataBillingTableMapper, formatsService: FormatsService): entity.DataBillingTableMapper {
		let dataList: entity.DataBillingTable[] = [];

		response?.data?.forEach((data: entity.DataBillingTable): void => {
			dataList.push({
				...data,
				endDate: formatsService.dateFormat(data.endDate),
				startDate: formatsService.dateFormat(data.startDate),
				generatedEnergyKwh: formatsService.energyWithDecimals(data.generatedEnergyKwh),
				montoPagoAnterior: formatsService.moneyFormat(data.montoPagoAnterior),
				montoTotal: formatsService.moneyFormat(parseFloat(data.montoTotal)),
				tarifa: formatsService.moneyFormat(parseFloat(data.tarifa)),
			});
		});

		return {
			...response,
			data: dataList
		}
	}
	
	static getBillingOverviewMapper(response: entity.DataBillingOverviewTableMapper, formatsService: FormatsService): entity.DataBillingOverviewTableMapper {
		let dataList: entity.DataBillingOverviewTable[] = [];

		response?.data?.forEach((data: entity.DataBillingOverviewTable): void => {
			dataList.push({
				...data,
				date: formatsService.dateFormat(data.date),
				amount: formatsService.moneyFormat(parseFloat(data.amount)),
			});
		});

		return {
			...response,
			data: dataList
		}
	}
}