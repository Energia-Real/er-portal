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
				amount: formatsService.moneyFormat(parseFloat(data.amount)),
				month: formatsService.getMonthName(parseFloat(data.month)),
			});
		});

		return {
			...response,
			data: dataList
		}
	}

	static getBillingHistoryMapper(response: entity.DataHistoryOverviewTableMapper, formatsService: FormatsService): entity.DataHistoryOverviewTableMapper {
		let dataList: entity.DataHistoryOverviewTable[] = [];

		response?.data?.forEach((data: entity.DataHistoryOverviewTable): void => {
			dataList.push({
				...data,
				amount: formatsService.moneyFormat(parseFloat(data.amount)),
				month: formatsService.getMonthName(parseFloat(data.month)),
			});
		});

		return {
			...response,
			data: dataList
		}
	}

	static getBillingDetailsMapper(response: entity.DataDetailsOverviewTableMapper, formatsService: FormatsService): any {
		let dataList: entity.DataDetailsOverviewTable[] = [];

		console.log(response.data);
		

		response?.data?.forEach((data: entity.DataDetailsOverviewTable): void => {
			dataList.push({
				...data,
			});
		});

		return {
			...response,
			data: dataList
		}
	}
}