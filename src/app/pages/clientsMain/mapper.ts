import * as entity from './clients-model';
export class Mapper {
	static getClientsDataMapper(response: entity.DataTableResponse): entity.DataTableResponse {
		let dataList: entity.DataClientsTable[] = [];
		console.log('response', response);


		response?.data.forEach((data: entity.DataClientsTable): void => {
			dataList.push({
				...data,
				nombre: data?.nombre || '-',
				imageBase64: data?.imageBase64 ? `data:image/jpeg;base64,${data.imageBase64}` : ''
			});
		});

		console.log('getClientsDataMapper', dataList);

		return {
			...response,
			data: dataList
		}
	}
}