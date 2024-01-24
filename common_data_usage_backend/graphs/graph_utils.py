import typing

import networkx as nx
from starlette.background import BackgroundTask
from starlette.responses import Response, JSONResponse


class GEXFResponse(Response):
    media_type = "application/xml"

    def __init__(
            self,
            content: nx.Graph,
            status_code: int = 200,
            headers: typing.Optional[typing.Mapping[str, str]] = None,
            media_type: typing.Optional[str] = None,
            background: typing.Optional[BackgroundTask] = None,
    ) -> None:
        super().__init__(content, status_code, headers, media_type, background)

    def render(self, content: nx.Graph) -> bytes:
        gexf = "".join(nx.generate_gexf(content))
        return gexf.encode("utf-8")


def serialize_to_graphology_json(graph: nx.Graph) -> dict:
    """
    Based on https://github.com/medialab/ipysigma/blob/master/ipysigma/sigma.py
    """
    nodes = []
    edges = []
    for node, attr in graph.nodes(data=True):
        nodes.append({
            "key": node,
            "attributes": attr
        })

    for source, target, attr in graph.edges(data=True):
        # NOTE: networkx multigraph can have keys on edges, but they
        # are not required to be unique across the graph, which makes
        # them pointless for graphology, gexf etc.
        serialized_edge = {
            "source": source,
            "target": target,
            "attributes": attr
        }

        edges.append(serialized_edge)

    return {
        "nodes": nodes,
        "edges": edges,
        "options": {
            "type": "directed" if graph.is_directed() else "undirected",
            "multi": graph.is_multigraph(),
        },
    }


class JSONGraphResponse(JSONResponse):
    def __init__(
            self,
            content: nx.Graph,
            status_code: int = 200,
            headers: typing.Optional[typing.Mapping[str, str]] = None,
            media_type: typing.Optional[str] = None,
            background: typing.Optional[BackgroundTask] = None,
    ) -> None:
        super().__init__(content, status_code, headers, media_type, background)

    def render(self, content: nx.Graph) -> bytes:
        graph_data = serialize_to_graphology_json(content)
        # characteristics = get_graph_characteristics(content)
        return super().render({
            'graph': graph_data,
            # 'characteristics': characteristics
        })


def is_graph_too_large_to_render(graph: nx.Graph) -> bool:
    return graph.number_of_nodes() > 1500 or graph.number_of_edges() > 3000
