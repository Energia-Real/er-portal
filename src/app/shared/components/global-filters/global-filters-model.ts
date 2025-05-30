

export interface ConfigGlobalFilters {
  isLocal?: boolean;
  showDatepicker?: boolean;
  showYears?: boolean;
  showClientsFilter?: boolean;
  showLegalNamesFilter?: boolean;
  showProductFilter?: boolean;
  clientsIndividual ?: boolean;
}

export interface CatalogSection<T> {
  data: T[];
  loading: boolean;
  loaded: boolean;
  error: string | null;
}

export interface CatalogState {
  clients: CatalogSection<any>;
  legalNames: CatalogSection<any>;
  products: CatalogSection<any>;
}

export const initialCatalogState: CatalogState = {
  clients: {
    data: [],
    loading: false,
    loaded: false,
    error: null,
  },
  legalNames: {
    data: [],
    loading: false,
    loaded: false,
    error: null,
  },
  products: {
    data: [],
    loading: false,
    loaded: false,
    error: null,
  },
};
