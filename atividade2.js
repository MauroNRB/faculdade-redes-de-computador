const heap = require('heap');

function dijkstra(graph, start) {
    const nodes = Object.keys(graph);
    const distances = {};
    const visited = new Set();
    const priorityQueue = new heap.Heap((a, b) => a.distance - b.distance);

    // Inicialização
    nodes.forEach(node => {
        distances[node] = node === start ? 0 : Infinity;
        priorityQueue.push({ node, distance: distances[node] });
    });

    while (!priorityQueue.empty()) {
        const { node: currentNode } = priorityQueue.pop();
        
        if (visited.has(currentNode)) continue;
        visited.add(currentNode);

        // Atualiza as distâncias para todos os vizinhos de currentNode
        for (const [neighbor, weight] of Object.entries(graph[currentNode])) {
            if (!visited.has(neighbor)) {
                const newDistance = distances[currentNode] + weight;
                if (newDistance < distances[neighbor]) {
                    distances[neighbor] = newDistance;
                    priorityQueue.push({ node: neighbor, distance: newDistance });
                }
            }
        }
    }

    return distances;
}

// Exemplo de uso:
const graph = {
    A: { B: 1, C: 4 },
    B: { A: 1, C: 2, D: 5 },
    C: { A: 4, B: 2, D: 1 },
    D: { B: 5, C: 1 }
};

const startNode = 'A';
const shortestPaths = dijkstra(graph, startNode);
console.log(`Menores distâncias a partir do nó ${startNode}:`);
for (const [node, distance] of Object.entries(shortestPaths)) {
    console.log(`Distância para ${node}: ${distance}`);
}
