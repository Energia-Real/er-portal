import { FormatsService } from '@app/shared/services/formats.service';
import * as entity from './billing-model';
import { ChartConfiguration } from 'chart.js';
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
				generatedEnergyKwh: formatsService.energyWithDecimals(data.generatedEnergyKwh, true),
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
				productionKwh: formatsService.energyWithDecimals(data.productionKwh),
				previousPayment: formatsService.moneyFormat(data.previousPayment),
				rate: formatsService.moneyFormat(data.rate),
				totalAmount: formatsService.moneyFormat(data.totalAmount),
			});
		});

		return {
			...response,
			dataPlants : dataList
		}
	}

	static getEnergysummaryMapper(response: entity.EnergyBillingSummary, formatsService: FormatsService): ChartConfiguration<'bar' | 'line'>['data'] | any {

		console.log(response);
		
		const monthsMap = [
		  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
		  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
		];
	  
		const fullMonths = Array.from({ length: 12 }, (_, i) => {
		  const found = response.response.energySummaryResponse.months.find(m => m.month === i + 1);
		  return {
			label: `${monthsMap[i]} 25`,
			billedEnergyProduced: found ? found.billedEnergyProduced : 0,
			billedEnergy: found ? found.billedEnergy : 0,
		  };
		});
	  
		return {
		  labels: fullMonths.map(m => m.label),
		  datasets: [
			{
			  type: 'bar',
			  label: 'Energy Produced (kWh)',
			  data: fullMonths.map(m => +m.billedEnergyProduced.toFixed(2)),
			  backgroundColor: '#F97316',
			  barPercentage: 0.8,
			  categoryPercentage: 0.9,
			  order: 1,
			},
			{
			  type: 'bar',
			  label: 'Energy Billed (kWh)',
			  data: fullMonths.map(m => +m.billedEnergy.toFixed(2)),
			  backgroundColor: '#57B1B1',
			  barPercentage: 0.8,
			  categoryPercentage: 0.9,
			  order: 1,
			},
			{
			  type: 'line',
			  label: 'Trend',
			  data: fullMonths.map(m => +((m.billedEnergyProduced + m.billedEnergy) / 2).toFixed(2)),
			  borderColor: '#6B021A',
			  backgroundColor: '#6B021A',
			  tension: 0.4,
			  pointRadius: 4,
			  pointBackgroundColor: '#6B021A',
			  borderWidth: 2,
			  order: 3,
			}
		  ],
		  balance: formatsService.moneyFormat(response.response.energySummaryResponse.balance),
		};
	  }
	  
}