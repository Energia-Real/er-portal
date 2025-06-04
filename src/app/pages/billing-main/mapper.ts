import { FormatsService } from '@app/shared/services/formats.service';
import * as entity from './billing-model';
import { ChartConfiguration } from 'chart.js';
import { GeneralResponse } from '@app/shared/models/general-models';
export class Mapper {
	static getBillingDataMapper(response: entity.DataBillingTableMapper, formatsService: FormatsService): entity.DataBillingTableMapper {
		let dataList: entity.DataBillingTable[] = [];
		console.log(response.data);


		response?.data?.forEach((data: entity.DataBillingTable): void => {
			dataList.push({
				...data,
				endDate: formatsService.dateFormat(data.endDate),
				startDate: formatsService.dateFormat(data.startDate),
				createdInvoiceDocDate: formatsService.dateFormat(data.createdInvoiceDocDate),
				generatedEnergyKwh: formatsService.energyWithDecimalsOrKWH(data.generatedEnergyKwh, true),
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
				monthFormatter: formatsService.getMonthName(parseFloat(data.month)),
			});
		});

		return {
			...response,
			data: dataList
		}
	}

	static InvoiceDetailsMapper(response: entity.DataInvoiceDetailsTableMapper, formatsService: FormatsService): entity.DataInvoiceDetailsTableMapper {
		let dataList: entity.InvoiceDetailsTableRow[] = [];

		response?.data?.forEach((data: entity.InvoiceDetailsTableRow): void => {

			dataList.push({
				...data,
				unitValue: formatsService.moneyFormat(parseInt(data.unitValue)),
				totalAmount: formatsService.moneyFormat(parseFloat(data.totalAmount)),
				taxes: formatsService.moneyFormat(parseFloat(data.taxes)),
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
				monthFormatter: formatsService.getMonthName(parseFloat(data.month)),
			});
		});

		return {
			...response,
			data: dataList
		}
	}

	static getBillingDetailsMapper(response: entity.DataDetailsOverviewTableMapper, formatsService: FormatsService): entity.DataDetailsOverviewTableMapper {
		let dataList: entity.DataDetailsOverviewTable[] = [];

		response.data[0].plants.forEach((data: any): void => {
			dataList.push({
				...data,
				productionKwh: formatsService.energyWithDecimalsOrKWH(data.productionKwh),
				previousPayment: formatsService.moneyFormat(data.previousPayment),
				rate: formatsService.moneyFormat(data.rate),
				totalAmount: formatsService.moneyFormat(data.totalAmount),
			});
		});

		return {
			...response,
			dataPlants: dataList
		}
	}

	static getEnergysummaryMapper(response: GeneralResponse<entity.EnergySummaryResponse>, formatsService: FormatsService): ChartConfiguration<'bar' | 'line'>['data'] | any {
		const monthsMap = [
			'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
			'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
		];

		const months = response.response.months;

		const ordered = [...months].sort((a: any, b: any) =>
			a.year !== b.year ? a.year - b.year : a.month - b.month
		);

		const chartData = ordered.map((m: any) => {
			const label = `${monthsMap[m.month - 1]} ${String(m.year).slice(-2)}`;
			return {
				label,
				billedEnergyProduced: m.billedEnergyProduced || 0,
				billedEnergy: m.billedEnergy || 0,
				billedEnergyAmouth: m.billedEnergyAmouth || 0,
			};
		});

		return {
			labels: chartData.map(m => m.label),
			datasets: [
				{
					type: 'bar',
					label: 'Energy Produced (kWh)',
					data: chartData.map(m => +m.billedEnergyProduced.toFixed(2)),
					backgroundColor: '#F97316',
					barPercentage: 0.8,
					categoryPercentage: 0.9,
					order: 1,
				},
				{
					type: 'bar',
					label: 'Energy Billed (kWh)',
					data: chartData.map(m => +m.billedEnergy.toFixed(2)),
					backgroundColor: '#57B1B1',
					barPercentage: 0.8,
					categoryPercentage: 0.9,
					order: 1,
				},
				{
					type: 'line',
					label: 'Total Amount',
					data: chartData.map(m => +m.billedEnergyAmouth.toFixed(2)),
					borderColor: '#6B021A',
					backgroundColor: '#6B021A',
					pointBackgroundColor: '#6B021A',
					pointBorderColor: '#6B021A',
					order: 0,
					yield: true,
				}
			],
			balance: formatsService.moneyFormat(response.response.balance)
		};
	}
}