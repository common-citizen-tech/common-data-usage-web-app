export const API_BASE_URL = process.env.API_BASE_URL;

export const getRepoGraphPath = (encodedRepositoryId: string) => {
  return `/repository/${encodedRepositoryId}/graphs/repository-datasets-organizations`;
};

export const getIsGraphSafeToRenderPath = (graphBaseUrl: string) => {
  return `${graphBaseUrl}/is-safe`;
};

export const getGraphDownloadPath = (graphBaseUrl: string) => {
  return `${graphBaseUrl}/gexf`;
};

export const getUrlFromPath = (path: string) => {
  return `${API_BASE_URL}${path}`;
};

export const getDataOrganizationPath = (organizationId: string) => {
  return `/data-organization/${organizationId}`;
};

export const getDatasetPath = (datasetId: string) => {
  return `/dataset/${datasetId}`;
};

export const getOrganizationGraphPath = (organizationId: string) => {
  return `/data-organization/${organizationId}/graphs/data-organization-datasets`;
};

export const getDatasetGraphPath = (datasetId: string) => {
  return `/dataset/${datasetId}/graphs/dataset-resources-repos`;
};
