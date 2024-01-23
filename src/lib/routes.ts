export const getDataOrganizationRoute = (organizationId) => {
  return `/ogd-portals/data-gov/data-organization/${organizationId}`;
};

export const getDatasetRoute = (datasetId) => {
  return `/ogd-portals/data-gov/dataset/${datasetId}`;
};

export const getRepositoryRoute = (repositoryId) => {
  return `/ogd-portals/data-gov/repository/${encodeURIComponent(repositoryId)}`;
};
