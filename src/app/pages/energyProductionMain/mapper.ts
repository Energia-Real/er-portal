import * as entity from './energy-production-model';

export class Mapper {
	static getEnergyProdDataDataMapper(response: entity.DataTableEnergyProdResponse) : entity.DataEnergyProdTablMapper {
		console.log(response);
		let dataList: entity.DataEnergyProdTable[] = [];

		response?.response?.data.forEach((data: entity.DataEnergyProdTable): void => {
			dataList.push({
				...data,
			});
		});
		
		return {
			...response.response,
			data: dataList
		}
	}
}
