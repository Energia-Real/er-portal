import * as moment from 'moment-timezone';
import * as entity from './plants-model';
import { FormatsService } from '@app/shared/services/formats.service';
import { DataResponseArraysMapper, GeneralResponse } from '@app/shared/models/general-models';
import { TranslationService } from '@app/shared/services/i18n/translation.service';

export class Mapper {
	static getSiteDetailsMapper(response: entity.DataSiteDetails, formatsService: FormatsService, translationService?: TranslationService): DataResponseArraysMapper {
		const primaryElements: entity.DataResponseDetailsCard[] = []
		const additionalItems: entity.DataResponseDetailsCard[] = []

		primaryElements.push({
			title: translationService ? translationService.instant('PLANTAS.RPU') : 'RPU',
			description: response.rpu
		});

		primaryElements.push({
			title: translationService ? translationService.instant('PLANTAS.MAPPER.ULTIMA_CONEXION') : 'Last connection timestamp',
			description: formatsService.dateFormat(response.lastConnectionTimestamp)
		});

		primaryElements.push({
			title: translationService ? translationService.instant('PLANTAS.MAPPER.DURACION_PPA') : 'PPA Duration',
			description: formatsService.formatContractDuration(response.contractDuration)
		});

		primaryElements.push({
			title: translationService ? translationService.instant('PLANTAS.MAPPER.FECHA_OPERACION_COMERCIAL') : 'Commercial Operation Date (COD)',
			description: formatsService.dateFormat(response.cod)
		});


		additionalItems.push({
			title: translationService ? translationService.instant('PLANTAS.MAPPER.EDAD_ACTIVO') : 'Asset age',
			description: `${response.ageOfTheSite} ${response.ageOfTheSite > 1 ? 
				(translationService ? translationService.instant('PLANTAS.MAPPER.AÑOS') : 'Years') : 
				(translationService ? translationService.instant('PLANTAS.MAPPER.AÑO') : 'Year')}`
		});

		additionalItems.push({
			title: translationService ? translationService.instant('PLANTAS.MAPPER.FECHA_INSTALACION') : 'Instalation date',
			description: formatsService.dateFormat(response.installDate)
		});

		
		return {
			primaryElements,
			additionalItems
		}
	}

	static getPlantsMapper(response: entity.DataManagementTableResponse, formatsService: FormatsService): entity.DataManagementTableResponse {
		let dataList: entity.DataManagementTable[] = [];

		response?.data.forEach((data: entity.DataManagementTable): void => {

			dataList.push({
				...data,
				systemSize: formatsService.energyFormat(data.systemSize),
				numberOfInvestors: formatsService.energyFormat(data.numberOfInvestors),
				commissionDate: formatsService.dateFormat(data.commissionDate),
				contractSignatureDate: formatsService.dateFormat(data.contractSignatureDate),
				endInstallationDate: formatsService.dateFormat(data.endInstallationDate)
			});
		});

		return {
			...response,
			data: dataList
		}
	}

	static getDataRespStatusMapper(response: entity.ProjectStatus[], formatsService: FormatsService): entity.ProjectStatus[] {
		let dataList: entity.ProjectStatus[] = [];

		response.forEach((data: entity.ProjectStatus): void => {
			dataList.push({
				...data,
				endInstallationDate: formatsService.dateFormat(data.endInstallationDate),
			});
		});

		return dataList
	}

	static getSummaryProjects(response: entity.DataSummaryProjectsMapper, formatsService: FormatsService): entity.DataSummaryProjectsMapper {
		return {
			noOfSites: formatsService.energyFormat(parseFloat(response.noOfSites)),
			noOfModules: formatsService.energyFormat(parseFloat(response.noOfModules)),
			noOfInverters: formatsService.energyFormat(parseFloat(response.noOfInverters)),
			mWpInstalled: formatsService.energyFormat(parseFloat(response.mWpInstalled))
		}
	}

	static getDataRespOverviewMapper(response: entity.DataResponseDetailsClient, formatsService: FormatsService, translationService?: TranslationService): entity.DataResponseDetailsCard[] {
		let dataList: entity.DataResponseDetailsCard[] = [];

		dataList.push({
			title: translationService ? translationService.instant('PLANTAS.RPU') : 'RPU',
			description: response.rpu ?? null
		});
		dataList.push({
			title: translationService ? translationService.instant('PLANTAS.MAPPER.EDAD_SITIO') : 'Age of the site',
			description: `${response.ageOfTheSite} ${response.ageOfTheSite > 1 ? 
				(translationService ? translationService.instant('PLANTAS.MAPPER.AÑOS') : 'Years') : 
				(translationService ? translationService.instant('PLANTAS.MAPPER.AÑO') : 'Year')}`
		});

		dataList.push({
			title: translationService ? translationService.instant('PLANTAS.MAPPER.FECHA_INSTALACION') : 'Install Date',
			description: formatsService.dateFormat(response.endInstallationDate) ?? null
		});
		dataList.push({
			title: translationService ? translationService.instant('PLANTAS.MAPPER.FECHA_OPERACION_COMERCIAL') : 'COD',
			description: formatsService.dateFormat(response.contractSignatureDate) ?? null
		});

		dataList.push({
			title: translationService ? translationService.instant('PLANTAS.FECHA_COMISION') : 'Commission Date',
			description: formatsService.dateFormat(response.commissionDate) ?? null
		});

		return dataList
	}

	static mapToClientData(mapperData: entity.DataResponseDetailsCard, translationService?: TranslationService): Partial<entity.DataResponseDetailsClient> {
		const clientData: Partial<entity.DataResponseDetailsClient> = {};
		const installDateTitle = translationService ? translationService.instant('PLANTAS.MAPPER.FECHA_INSTALACION') : 'Install Date';
		const codTitle = translationService ? translationService.instant('PLANTAS.MAPPER.FECHA_OPERACION_COMERCIAL') : 'COD';
		const commissionDateTitle = translationService ? translationService.instant('PLANTAS.FECHA_COMISION') : 'Commission Date';

		switch (mapperData.title) {
			case installDateTitle:
				clientData.endInstallationDate = mapperData.description;
				break;
			case codTitle:
				clientData.contractSignatureDate = mapperData.description;
				break;
			case commissionDateTitle:
				clientData.commissionDate = mapperData.description;
				break;
			default:
				break;
		}
		return clientData;
	}

	static getDataIdMapper(response: entity.DataPlant): entity.DataPlant {
		return {
			...response,
			assetStatusIcon: response?.descriptionStatus?.toLowerCase()?.includes('active') ? 'radio_button_checked'
				: response?.descriptionStatus?.toLowerCase()?.includes('defaulter') ? 'warning'
					: response?.descriptionStatus?.toLowerCase()?.includes('under construction') ? 'engineering'
						: response?.descriptionStatus?.toLowerCase()?.includes('under permitting process') ? 'assignment'
							: response?.descriptionStatus?.toLowerCase()?.includes('without Off-taker') ? 'person_off'
								: 'help_outline'
		}

	}

	static getLocalTimeOfPlaceMapper(response: entity.DataLocalTime): string {
		const utcTime = moment.utc();
		const localTime = utcTime.tz(response.timeZoneId);
		return localTime?.format('hh:mm A');
	}

	static getInstalacionesMapper(response: any, translationService?: TranslationService): entity.Instalations {
		let instalaciones: entity.Equipment[] = [];
		instalaciones.push({
			equipmentId: "0",
			moduloQty: 0,
			moduloBrand: "",
			moduloModel: "",
			title: translationService ? translationService.instant('PLANTAS.MAPPER.TECNOLOGIA_MONTAJE') : "Mounting Technology",
			description: response.mountingTechnology,

		});
		instalaciones.push({
			equipmentId: "0",
			moduloQty: 0,
			moduloBrand: "",
			moduloModel: "",
			title: translationService ? translationService.instant('PLANTAS.MAPPER.TIPO_TECHO') : "Roof Type",
			description: response.roofType,
		})

		response.equipment.map((data: entity.Equipment, i: number) => {
			const inverterText = translationService ? translationService.instant('PLANTAS.INVERSOR') : "Inverter";
			instalaciones.push(
				{
					equipmentId: data.equipmentId,
					moduloQty: data.moduloQty,
					moduloBrand: data.moduloBrand,
					moduloModel: data.moduloModel,
					inverterBrandId: data.inverterBrandId,
					inverterModelId: data.inverterModelId,
					moduloModelId: data.moduloModelId,
					moduloBrandId: data.moduloBrandId,
					orientation: data.orientation,
					tilt: data.tilt,
					serialNumber: data?.serialNumber,
					title: `${inverterText} ${i + 1} - ${data.moduloBrand}`,
					description: `${data.moduloQty}  ${data.moduloModel}`,
				}
			)
		})


		return {
			...response,
			equipment: instalaciones
		}
	}

	static getSavingsDetailsMapper(response: entity.getSavingsDetails, translationService?: TranslationService): entity.DataResponseArraysMapper {
		const primaryElements: entity.DataResponseDetailsCard[] = []
		const additionalItems: entity.DataResponseDetailsCard[] = []

		primaryElements.push({
			title: translationService ? translationService.instant('PLANTAS.MAPPER.SUBTOTAL_CFE') : 'CFE Subtotal',
			description: `$${response.cfeSubtotal}`,
			icon: '../../../../../assets/icons/cfe-subtotal.png'
		});

		primaryElements.push({
			title: translationService ? translationService.instant('PLANTAS.MAPPER.SUBTOTAL_ER') : 'Real energy Subtotal',
			description: `$${response.erSubtotal}`,
			icon: '../../../../../assets/icons/er-subtotal.png'
		});

		primaryElements.push({
			title: translationService ? translationService.instant('PLANTAS.MAPPER.SUBTOTAL_ER_CFE') : 'Real energy + CFE Subtotal',
			description: `$${response.erCfeSubtotal}`,
			icon: '../../../../../assets/icons/ercfe-subtotal.png'
		});

		primaryElements.push({
			title: translationService ? translationService.instant('PLANTAS.MAPPER.GASTO_SIN_ER') : 'Expenditure without Real energy',
			description: `$${response.expenditureWithoutER}`,
			icon: '../../../../../assets/icons/expenditure.png'
		});

		additionalItems.push({
			title: translationService ? translationService.instant('PLANTAS.MAPPER.AHORROS') : 'Savings',
			description: `$${response.savings}`,
			icon: '../../../../../assets/icons/saving.png'
		});
	
		additionalItems.push({
			title: translationService ? translationService.instant('PLANTAS.MAPPER.PORCENTAJE_AHORRO') : 'Savings percentage',
			description: `${response.savingsPercentage}%`,
			icon: '../../../../../assets/icons/saving.png'
		});

		return {
			primaryElements,
			additionalItems
		}
	}

	static getSitePerformanceMapper(response: GeneralResponse<entity.SitePerformanceResponse>, formatsService: FormatsService, translationService?: TranslationService): entity.DataResponseArraysMapper | null {
		if (!response.success) return null

		const primaryElements: entity.DataResponseDetailsCard[] = []
		const additionalItems: entity.DataResponseDetailsCard[] = []
		const monthlyData: entity.MonthlyDataPerformance[] = response.response.monthlyDataResponse;
		const comparedText = translationService ? translationService.instant('PLANTAS.MAPPER.COMPARADO_MES_ANTERIOR') : 'compared to the previous month';

		primaryElements.push({
			title: translationService ? translationService.instant('PLANTAS.MAPPER.GENERACION_SISTEMA') : 'System generation',
			description : `${response.response.systemGeneration ?? "0.00"} ${response.response?.systemGenerationMeasure}`,
		});

		primaryElements.push({
			title: translationService ? translationService.instant('PLANTAS.MAPPER.CONSUMO_TOTAL') : 'Total consumption',
			description : `${response.response.totalConsumption ?? "0.00"} ${response.response?.totalConsumptionMeasure}`,
		});

		primaryElements.push({
			title: translationService ? translationService.instant('PLANTAS.MAPPER.GENERACION_EXPORTADA') : 'Exported generation',
			description: `${response.response.exportedGeneration?? "0.00"} kWh`,
			extra: `+2% ${comparedText}`
		});

		primaryElements.push({
			title: translationService ? translationService.instant('PLANTAS.MAPPER.CONSUMO_RED_CFE') : 'CFE network consumption',
			description : `${response.response.cfeNetworkConsumption ?? "0.00"} ${response.response?.cfeNetworkConsumptionMeasure}`,
			extra: `-4% ${comparedText}`
		});

		additionalItems.push({
			title: translationService ? translationService.instant('PLANTAS.MAPPER.COBERTURA_SOLAR') : 'Solar coverage',
			description: `${response.response.solarCoverage}%`,
		});

		additionalItems.push({
			title: translationService ? translationService.instant('PLANTAS.MAPPER.RENDIMIENTO') : 'Performance',
			description: `${response.response.performance}%`,
			extra:'% performance - calculated as (Generated / Esstimated)'
		});

		return {
			primaryElements,
			additionalItems,
			monthlyData
		}
	}

	static getSitePerformanceSummaryMapper(response: entity.BatuSummary, translationService?: TranslationService): entity.DataResponseArraysMapper  {
		const primaryElements: entity.DataResponseDetailsCard[] = []
		const additionalItems: entity.DataResponseDetailsCard[] = []

		additionalItems.push({
			title: translationService ? translationService.instant('PLANTAS.MAPPER.CONSUMO_RED_CFE') : 'CFE network consumption',
			description: `${response.summary} kWh`,
		});

		return {
			primaryElements,
			additionalItems
		}
	}
}
