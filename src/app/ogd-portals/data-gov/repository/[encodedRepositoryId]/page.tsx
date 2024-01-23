import TopFormatsChart from "~/app/ogd-portals/data-gov/data-organization/[orgId]/TopFormatsChart";
import {
  getGraphDownloadPath,
  getRepoGraphPath,
  getUrlFromPath,
} from "~/lib/api/urls";
import { fetchData } from "~/lib/api/fetchData";
import EntityLayout, {
  SidePaneSection,
  SidePaneTopBox,
} from "~/components/EntityLayout";
import type { Metadata } from "next";

const RepositorySidePane = ({
  repositoryId,
  repository,
  datasetsCount,
  resourcesCount,
  topFormats,
  topOrganizations,
}) => {
  const [repositoryHost, repositoryOwner, repositoryName] =
    repositoryId.split("/");
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
          Repository
        </span>
        <h1 className="my-2 font-serif text-4xl">{repositoryName}</h1>
        <h1 className="my-2 font-serif text-lg">
          by {repositoryOwner} on {repositoryHost}
        </h1>

        <div className="flex items-center justify-between">
          <a
            className="mt-2 inline-block text-primary underline hover:text-primary/60"
            rel="noreferrer noopener"
            target="_blank"
            href={`http://${repositoryId}`}
          >
            View on {repositoryHost}
          </a>
        </div>
      </SidePaneTopBox>
      <SidePaneSection>
        <span className="mt-5 block font-serif text-xl text-gray-500">
          Repository
        </span>
        <ul className="mt-5 list-inside list-disc">
          <li className="">
            Repository stars: <strong>{repository.repoStars}</strong>
          </li>
          <li className="">
            Fetched:{" "}
            <strong>
              {new Date(repository.repoLastFetched).toLocaleString()}
            </strong>
          </li>
        </ul>
      </SidePaneSection>
      <SidePaneSection>
        <span className="mt-5 block font-serif text-xl text-gray-500">
          Used OGD
        </span>
        <ul className="mt-5 list-inside list-disc">
          <li className="">
            Number of datasets: <strong>{datasetsCount}</strong>
          </li>
          <li className="">
            Number of resources: <strong>{resourcesCount}</strong>
          </li>
        </ul>
      </SidePaneSection>
      <SidePaneSection>
        <span className="mb-3 mt-5 block font-serif text-xl text-gray-500">
          Graph
        </span>
        <a
          href={getUrlFromPath(
            getGraphDownloadPath(
              getRepoGraphPath(encodeURIComponent(repositoryId)),
            ),
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
          Top OGD formats
        </span>
        <div className="mt-5">
          <TopFormatsChart topFormatsData={topFormats} />
        </div>
      </SidePaneSection>
      <SidePaneSection>
        <span className="mt-5 block font-serif text-xl text-gray-500">
          Organizations with most datasets used
        </span>
        <ol className="list-inside list-decimal">
          {topOrganizations.map(
            ({ organization_title, organization_id, datasets_count }) => {
              return (
                <li key={organization_title} className="my-1">
                  <a
                    className="text-black underline hover:text-black/60"
                    href={`http://${organization_id}`}
                  >
                    {organization_title}
                  </a>
                  <span className="mx-0.5">({datasets_count})</span>
                </li>
              );
            },
          )}
        </ol>
      </SidePaneSection>
    </>
  );
};

export const generateMetadata = ({ params }): Metadata => {
  return {
    title: `${decodeURIComponent(params.encodedRepositoryId)} - data.gov | Common Data Usage`,
  };
};

const RepositoryPage = async ({ params: { encodedRepositoryId } }) => {
  const repositoryId = decodeURIComponent(encodedRepositoryId);
  const {
    repository,
    resources_count: resourcesCount,
    datasets_count: datasetsCount,
    top_formats: topFormats,
    top_organizations: topOrganizations,
  } = await fetchData(`/repository/${encodedRepositoryId}`);

  return (
    <EntityLayout
      renderSidePane={() => (
        <RepositorySidePane
          repositoryId={repositoryId}
          repository={repository}
          datasetsCount={datasetsCount}
          resourcesCount={resourcesCount}
          topFormats={topFormats}
          topOrganizations={topOrganizations}
        />
      )}
      graphPath={getRepoGraphPath(encodedRepositoryId)}
    />
  );
};

export default RepositoryPage;
