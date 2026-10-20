"""Network graph analysis API routes."""

from fastapi import APIRouter, Query
from pydantic import BaseModel
from typing import Optional, List
from backend.graph import (
    get_graph_data, analyze_centrality, detect_communities,
    find_shortest_path, expand_neighborhood, suggest_links, get_graph
)

router = APIRouter(prefix="/api/network", tags=["network"])


class CentralityRequest(BaseModel):
    case_id: Optional[str] = None
    algorithm: str = "betweenness"


class CommunityRequest(BaseModel):
    case_id: Optional[str] = None


@router.get("/graph")
def get_network_graph(
    case_id: Optional[str] = None,
    entity_types: Optional[str] = None,
):
    """Get full graph data for Cytoscape.js rendering."""
    types_list = entity_types.split(",") if entity_types else None
    data = get_graph_data(case_id=case_id, entity_types=types_list)
    return data


@router.post("/analyze/centrality")
def run_centrality_analysis(data: CentralityRequest):
    """Run centrality analysis."""
    results = analyze_centrality(case_id=data.case_id, algorithm=data.algorithm)
    return {
        "algorithm": data.algorithm,
        "results": results,
        "total": len(results),
    }


@router.post("/analyze/communities")
def run_community_detection(data: CommunityRequest):
    """Run community detection."""
    results = detect_communities(case_id=data.case_id)
    return results


@router.get("/shortest-path")
def get_shortest_path(
    source: str = Query(..., alias="from"),
    target: str = Query(..., alias="to"),
):
    """Find shortest path between two entities."""
    return find_shortest_path(source, target)


@router.get("/expand/{entity_id}")
def expand_entity_neighborhood(
    entity_id: str,
    hops: int = Query(default=1, le=5),
):
    """Get neighborhood expansion around an entity."""
    return expand_neighborhood(entity_id, hops)


@router.get("/link-predictions")
def get_link_predictions(
    case_id: Optional[str] = None,
    top_n: int = Query(default=5, le=20),
):
    """Get AI-suggested link predictions."""
    results = suggest_links(case_id=case_id, top_n=top_n)
    return {"predictions": results}


@router.get("/stats")
def get_network_stats(case_id: Optional[str] = None):
    """Get network statistics."""
    data = get_graph_data(case_id=case_id)
    G = get_graph()

    node_types = {}
    for n in data['nodes']:
        t = n['entity_type']
        node_types[t] = node_types.get(t, 0) + 1

    edge_types = {}
    for e in data['edges']:
        t = e['relationship_type']
        edge_types[t] = edge_types.get(t, 0) + 1

    return {
        "node_count": len(data['nodes']),
        "edge_count": len(data['edges']),
        "node_types": node_types,
        "edge_types": edge_types,
        "density": round(nx_density(G, case_id), 4),
    }


def nx_density(G, case_id=None):
    import networkx as nx
    if case_id:
        nodes = [n for n, d in G.nodes(data=True) if d.get('case_id') == case_id]
        sub = G.subgraph(nodes)
        return nx.density(sub) if len(sub) > 0 else 0
    return nx.density(G) if len(G) > 0 else 0
