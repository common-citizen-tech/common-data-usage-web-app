"use client";
import { FC, useEffect, useState } from "react";
import Graph from "graphology";
import {
  SigmaContainer,
  useLoadGraph,
  useRegisterEvents,
  useSigma,
} from "@react-sigma/core";
import "@react-sigma/core/lib/react-sigma.min.css";
import { random as randomGraphLayout } from "graphology-layout";
import forceAtlas2 from "graphology-layout-forceatlas2";
import { useRouter } from "next/navigation";
import { PiGraphDuotone } from "react-icons/pi";

export const GRAPH_NODE_ATTRIBUTES = {
  dataOrganization: {
    color: "#6B0F1A",
    size: 20,
  },
  dataset: {
    color: "#0A014F",
    size: 10,
  },
  RELATED_DATASET: {
    color: "#6B0F1A",
    size: 10,
  },
  resource: {
    color: "#FFBA08",
    size: 5,
  },
  repository: {
    color: "#449DD1",
    size: 5,
  },
  URL: {
    color: "#ffffff",
    size: 5,
  },
};

const ENTITY_TYPE_TO_PATH_PREFIX = {
  "data-organization": "/ogd-portals/data-gov/data-organization/",
  dataset: "/ogd-portals/data-gov/dataset/",
  resource: "/ogd-portals/data-gov/resource/",
  repo: "/ogd-portals/data-gov/repo/",
  url: "/ogd-portals/data-gov/url/",
};

export const GraphRendererData = ({ graphData, onGraphLoad }) => {
  const loadGraph = useLoadGraph();

  useEffect(() => {
    const graph = new Graph();
    graph.import(graphData);
    randomGraphLayout.assign(graph);
    forceAtlas2.assign(graph, { iterations: 100, settings: { slowDown: 100 } });
    graph.forEachNode((node, attributes) => {
      graph.mergeNodeAttributes(
        node,
        GRAPH_NODE_ATTRIBUTES[attributes.entityType],
      );
    });
    loadGraph(graph);
    onGraphLoad();
  }, [loadGraph, onGraphLoad, graphData]);

  return null;
};

const GraphRendererEvents: React.FC = () => {
  const registerEvents = useRegisterEvents();
  const sigma = useSigma();
  const router = useRouter();

  useEffect(() => {
    // Register the events
    registerEvents({
      // node events
      clickNode: (event) => {
        const nodeId = event.node;
        const node = sigma.getGraph().getNodeAttributes(nodeId);
        if (node.entityType === "repository") {
          router.push(
            `/ogd-portals/data-gov/repository/${encodeURIComponent(nodeId)}`,
          );
        } else {
          router.push(
            `${ENTITY_TYPE_TO_PATH_PREFIX[node.entityType]}${nodeId}`,
          );
        }
      },
    });
  }, [registerEvents, sigma, router]);

  return null;
};

const DisplayGraphInfo: FC = ({ onEnableGraphRender }) => (
  <div className="flex h-full w-full items-center justify-center bg-gray-100 p-20">
    <div className="">
      <div className="">
        <div className="mb-5 flex justify-center">
          <PiGraphDuotone className="h-20 w-20 text-primary" />
        </div>
        <span className="block text-center text-2xl">
          Do you want to render the graph?
        </span>
        <span className="mt-2 block text-center text-lg">
          Rendering a graph in a browser can be resource-intensive.
        </span>
      </div>
      <div className="mt-10">
        <span className="text block text-center">
          Alternatively you can download the graph (see left pane) in GEXF
          format and open it with specialized software like{" "}
          <a href="https://gephi.org" className="underline">
            Gephi
          </a>
        </span>
      </div>
      <div className="mt-5 flex justify-center">
        <button
          onClick={onEnableGraphRender}
          className="mt-2 rounded border-2 border-primary px-4 py-2 text-center"
        >
          Render this graph
        </button>
      </div>
    </div>
  </div>
);

const LoadingGraphOverlay: FC = () => (
  <div className="absolute left-0 top-0 z-10 flex h-full w-full items-center justify-center bg-gray-100 p-20">
    <div className="">
      <div className="">
        <span className="block block text-center text-2xl">
          Trying to render this graph...
        </span>
        <div className="mt-10">
          <span className="text block text-center">
            If this page doesn&apos;t load in a few seconds, consider
            downloading the graph (see left pane) in GEXF format. (Page may
            froze if the graph is too big)
          </span>
        </div>
      </div>
    </div>
  </div>
);

const GraphRenderer = ({ graphData }) => {
  const [isGraphLoaded, setIsGraphLoaded] = useState(false);
  const [isGraphLoadingEnabled, setIsGraphLoadingEnabled] = useState(false);
  return (
    <div className="relative h-full w-full">
      {isGraphLoadingEnabled && (
        <SigmaContainer style={{ height: "100%" }}>
          <GraphRendererData
            graphData={graphData}
            onGraphLoad={() => setIsGraphLoaded(true)}
          />
          <GraphRendererEvents />
        </SigmaContainer>
      )}
      {!isGraphLoadingEnabled && (
        <DisplayGraphInfo
          onEnableGraphRender={() => setIsGraphLoadingEnabled(true)}
        />
      )}
      {isGraphLoadingEnabled && !isGraphLoaded && <LoadingGraphOverlay />}
    </div>
  );
};

export default GraphRenderer;
