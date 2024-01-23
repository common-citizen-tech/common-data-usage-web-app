import { FC } from "react";
import {
  getGraphDownloadPath,
  getIsGraphSafeToRenderPath,
  getUrlFromPath,
} from "~/lib/api/urls";
import { fetchData } from "~/lib/api/fetchData";
import GraphRenderer from "~/components/GraphRenderer";

export interface GraphData {
  graph: Record<string, unknown>;
}

const UnsafeGraphInfo: FC = ({ downloadUrl }) => (
  <div className="flex h-full w-full items-center justify-center bg-gray-100 p-20">
    <div className="">
      <div className="">
        <span className="block text-center text-2xl">
          We can&apos;t render this graph
        </span>
        <span className="mt-2 block text-center text-lg">
          it has too many nodes or edges
        </span>
      </div>
      <div className="mt-10">
        <span className="text block text-center">
          Consider downloading the graph in GEXF format and opening it with
          specialized software like{" "}
          <a href="https://gephi.org" className="underline">
            Gephi
          </a>
        </span>
        <div className="mt-5 flex justify-center">
          <a
            href={downloadUrl}
            download
            target="_blank"
            rel="noreferrer noopener"
            className="mt-2 rounded border-2 border-primary px-4 py-2 text-center"
          >
            Download GEXF
          </a>
        </div>
      </div>
    </div>
  </div>
);

interface GraphEmbedProps {
  graphPath: string;
}

const GraphEmbed = async ({ graphPath }: GraphEmbedProps) => {
  const { is_graph_safe_to_render: isSafeToRender } = await fetchData(
    getIsGraphSafeToRenderPath(graphPath),
  );

  if (!isSafeToRender)
    return (
      <UnsafeGraphInfo
        downloadUrl={getUrlFromPath(getGraphDownloadPath(graphPath))}
      />
    );

  const graphData = await fetchData(graphPath);
  return <GraphRenderer graphData={graphData.graph} />;
};

export default GraphEmbed;
