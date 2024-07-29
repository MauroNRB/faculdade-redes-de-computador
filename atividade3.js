const EventEmitter = require('events');

class Router extends EventEmitter {
    constructor(id, neighbors) {
        super();
        this.id = id;
        this.neighbors = neighbors;
        this.routingTable = {};
        this.initializeRoutingTable();
    }

    initializeRoutingTable() {
        Object.keys(this.neighbors).forEach(node => {
            if (node === this.id) {
                this.routingTable[node] = this.id; // Meu próprio caminho
            } else if (this.neighbors[node]) {
                this.routingTable[node] = this.id + node; // Caminho direto para o vizinho
            } else {
                this.routingTable[node] = ''; // Caminho vazio
            }
        });
        this.broadcastRoutingTable();
    }

    broadcastRoutingTable() {
        // Envia a tabela de roteamento para todos os vizinhos
        this.neighbors.forEach(neighbor => {
            neighbor.receiveRoutingTable(this.id, this.routingTable);
        });
    }

    receiveRoutingTable(from, receivedTable) {
        let updated = false;

        Object.keys(receivedTable).forEach(node => {
            if (receivedTable[node] !== this.id && receivedTable[node] !== '') {
                const newPath = this.id + receivedTable[node].substring(this.id.length);
                if (this.routingTable[node] === '' || newPath.length < this.routingTable[node].length) {
                    this.routingTable[node] = newPath;
                    updated = true;
                }
            }
        });

        if (updated) {
            this.broadcastRoutingTable();
        }
    }
}

// Exemplo de uso:
const routerA = new Router('A', []);
const routerB = new Router('B', [routerA]);
const routerC = new Router('C', [routerA, routerB]);
const routerD = new Router('D', [routerB, routerC]);

// Conecta vizinhos
routerA.neighbors = [routerB, routerC];
routerB.neighbors = [routerA, routerC, routerD];
routerC.neighbors = [routerA, routerB, routerD];
routerD.neighbors = [routerB, routerC];

// Inicializa a tabela de roteamento
routerA.initializeRoutingTable();
routerB.initializeRoutingTable();
routerC.initializeRoutingTable();
routerD.initializeRoutingTable();
