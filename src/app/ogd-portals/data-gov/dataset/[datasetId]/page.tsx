import EntityLayout, {
  SidePaneSection,
  SidePaneTopBox,
  SubEntitiesList,
} from "~/components/EntityLayout";
import { getDatasetGraphPath, getDatasetPath } from "~/lib/api/urls";
import { Metadata } from "next";
import { fetchData } from "~/lib/api/fetchData";

const DatasetSidePane = ({ dataset, resourcesCount, connectedReposCount }) => {
  return (
    <>
      <SidePaneTopBox>
        <span>
          <a href={`/ogd-portals/data-gov/data-organization/${dataset.orgId}`}>
            {" "}
            {"<"} Go to org
          </a>
        </span>
        <span className="mt-5 block font-serif text-lg text-gray-500">
          Dataset
        </span>
        <h1 className="my-2 font-serif text-4xl">{dataset.title}</h1>
        <h1 className="my-2 font-serif text-lg">by {dataset.orgName}</h1>

        <pre className="break-all text-sm text-gray-500">
          CKAN ID: {dataset.id}
        </pre>
        <div className="flex items-center justify-between">
          <a
            className="mt-2 inline-block text-primary underline hover:text-primary/60"
            rel="noreferrer noopener"
            target="_blank"
            href={`https://catalog.data.gov/dataset/${dataset.id}`}
          >
            View on data.gov
          </a>
          <a
            className="mt-2 inline-block text-right text-primary underline hover:text-primary/60"
            href={`#resources`}
          >
            List resources
          </a>
        </div>
      </SidePaneTopBox>
      <SidePaneSection>
        <span className="mt-5 block font-serif text-xl text-gray-500">
          Organization characteristics
        </span>
        <ul className="mt-5 list-inside list-disc">
          <li className="">
            Number of resources: <strong>{resourcesCount}</strong>
          </li>
          <li className="">
            Number of connected unique code repositories:{" "}
            <strong>{connectedReposCount}</strong>
          </li>
        </ul>
      </SidePaneSection>
      <SidePaneSection>
        <span className="mt-5 block font-serif text-xl text-gray-500">
          Graph characteristics
        </span>
      </SidePaneSection>

      <SidePaneSection>
        <span className="mt-5 block font-serif text-xl text-gray-500">
          Most popular code owners
        </span>
      </SidePaneSection>
    </>
  );
};

export const generateMetadata = async ({ params }): Promise<Metadata> => {
  const { dataset } = await fetchData(getDatasetPath(params.datasetId));
  return {
    title: `${dataset.title} by ${dataset.orgName} - data.gov | Common Data Usage`,
  };
};

const DatasetPage = async ({ params: { datasetId } }) => {
  const {
    dataset,
    resources_count: resourcesCount,
    resources,
    connected_repos_count: connectedReposCount,
  } = await fetchData(getDatasetPath(datasetId));

  return (
    <EntityLayout
      graphPath={getDatasetGraphPath(datasetId)}
      renderSidePane={() => (
        <DatasetSidePane
          dataset={dataset}
          connectedReposCount={connectedReposCount}
          resourcesCount={resourcesCount}
        />
      )}
    >
      <SubEntitiesList
        title="Resources"
        subEntities={resources}
        getSubEntityName={(s) => s.name}
        getSubEntityUrl={(s) => s.url}
        elementId="resources"
      />
    </EntityLayout>
  );
};

export default DatasetPage;
