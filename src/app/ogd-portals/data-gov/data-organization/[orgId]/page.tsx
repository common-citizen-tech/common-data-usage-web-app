import TopFormatsChart from "~/components/TopFormatsChart";
import {
  getDataOrganizationPath,
  getGraphDownloadPath,
  getOrganizationGraphPath,
  getUrlFromPath,
} from "~/lib/api/urls";
import EntityLayout, {
  SidePaneSection,
  SidePaneTopBox,
  SubEntitiesList,
} from "~/components/EntityLayout";
import { getDatasetRoute } from "~/lib/routes";
import { fetchData } from "~/lib/api/fetchData";
import { Metadata } from "next";

const DataOrganizationSidePane = ({
  org,
  datasetsCount,
  resourcesCount,
  resourcesWithDuplicatedUrlsCount,
  topFormats,
  resourcesUsedCount,
  connectedReposCount,
  topRepoOwners,
}) => {
  return (
    <>
      <SidePaneTopBox>
        <span>
          <a href="/ogd-portals/data-gov/data-organization">
            {" "}
            {"<"} Go to list of organizations
          </a>
        </span>
        <span className="mt-5 block font-serif text-lg text-gray-500">
          Organization
        </span>
        <h1 className="my-2 font-serif text-4xl">{org.title}</h1>

        <pre className="text-sm text-gray-500">CKAN ID: {org.id}</pre>
        <div className="flex items-center justify-between">
          <a
            className="mt-2 inline-block text-primary underline hover:text-primary/60"
            rel="noreferrer noopener"
            target="_blank"
            href={`https://catalog.data.gov/organization/${org.id}`}
          >
            View on data.gov
          </a>
          <a
            className="mt-2 inline-block text-right text-primary underline hover:text-primary/60"
            href={`#datasets`}
          >
            List datasets
          </a>
        </div>
      </SidePaneTopBox>
      <SidePaneSection>
        <span className="mb-3 mt-5 block font-serif text-xl text-gray-500">
          Organization characteristics
        </span>
        <ul className="list-inside list-disc">
          <li className="">
            Number of datasets: <strong>{datasetsCount}</strong>
          </li>
          <li className="">
            Number of resources:
            <ul className="list-inside list-disc ps-4">
              <li>
                total: <strong>{resourcesCount}</strong>
              </li>
              <li className="">
                with duplicated URLs:{" "}
                <strong>{resourcesWithDuplicatedUrlsCount}</strong>
              </li>
            </ul>
          </li>
        </ul>
      </SidePaneSection>
      <SidePaneSection>
        <span className="mb-3 mt-5 block font-serif text-xl text-gray-500">
          Graph
        </span>
        <a
          href={getUrlFromPath(
            getGraphDownloadPath(getOrganizationGraphPath(org.id)),
          )}
          target="_blank"
          download
          rel="noreferrer noopener"
          className="inline-block rounded border-2 border-primary/80 px-2 py-1"
        >
          Download graph as GEXF
        </a>
      </SidePaneSection>
      <SidePaneSection>
        <span className="mt-5 block font-serif text-xl text-gray-500">
          Top data formats
        </span>
        <div className="mt-3">
          <TopFormatsChart topFormatsData={topFormats} />
        </div>
      </SidePaneSection>
      <SidePaneSection>
        <span className="mt-5 block font-serif text-xl text-gray-500">
          Resource-repository connections
        </span>
        <ul className="mt-3 list-inside list-disc">
          <li className="">
            Number of resources used: <strong>{resourcesUsedCount}</strong>
          </li>
          <li className="">
            Number of code repositories: <strong>{connectedReposCount}</strong>
          </li>
        </ul>
      </SidePaneSection>
      <SidePaneSection>
        <span className="mt-5 block font-serif text-xl text-gray-500">
          Most popular code owners
        </span>
        <ol className="mt-2 list-inside list-decimal">
          {topRepoOwners.map(({ repository_owner, repo_count }) => {
            return (
              <li key={repository_owner} className="my-1">
                <a
                  className="text-black underline hover:text-black/60"
                  href={`http://${repository_owner}`}
                >
                  {repository_owner}
                </a>
                <span className="mx-0.5">({repo_count})</span>
              </li>
            );
          })}
        </ol>
      </SidePaneSection>
    </>
  );
};

export const generateMetadata = async ({ params }): Promise<Metadata> => {
  const { organization: org } = await fetchData(
    getDataOrganizationPath(params.orgId),
  );
  return {
    title: `${org.title} - data.gov | Common Data Usage`,
  };
};

const DataOrganizationPage = async ({ params: { orgId } }) => {
  const {
    organization: org,
    resources_count: resourcesCount,
    resources_with_duplicated_urls_count: resourcesWithDuplicatedUrlsCount,
    resources_used_count: resourcesUsedCount,
    datasets_count: datasetsCount,
    top_formats: topFormats,
    connected_repos_count: connectedReposCount,
    top_repo_owners: topRepoOwners,
  } = await fetchData(getDataOrganizationPath(orgId));
  const { datasets } = await fetchData(`/dataset?org_id=${orgId}`);

  return (
    <EntityLayout
      graphPath={getOrganizationGraphPath(orgId)}
      renderSidePane={() => (
        <DataOrganizationSidePane
          org={org}
          datasetsCount={datasetsCount}
          resourcesCount={resourcesCount}
          resourcesWithDuplicatedUrlsCount={resourcesWithDuplicatedUrlsCount}
          topFormats={topFormats}
          resourcesUsedCount={resourcesUsedCount}
          connectedReposCount={connectedReposCount}
          topRepoOwners={topRepoOwners}
        />
      )}
    >
      <SubEntitiesList
        subEntities={datasets}
        getSubEntityName={(s) => s.title}
        getSubEntityUrl={(s) => getDatasetRoute(s.id)}
        title="Datasets"
        elementId="datasets"
      />
    </EntityLayout>
  );
};

export default DataOrganizationPage;
