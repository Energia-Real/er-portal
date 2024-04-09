import * as entity from './overview-model';

export class Mapper {
	static getDataExample(response: entity.Example[]) : entity.ExampleMapper[] {
		let dataList : entity.ExampleMapper[] = [];

		response.forEach((data: entity.Example): void => {
			dataList.push({
				name: data.name,
			});
		});

		return dataList
	}
}
