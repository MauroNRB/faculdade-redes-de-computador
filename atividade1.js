const dgram = require('dgram');
const { parse } = require('querystring');

// Parâmetros do nó
const nodeId = parseInt(process.argv[2], 10); // Identificador do nó passado como argumento
const neighbors = JSON.parse(process.argv[3]); // Lista de vizinhos passada como argumento

const N = 5; // Número total de nós (deve ser ajustado conforme o cenário)
const INF = Infinity;
const c = [
  [0, 2, 5, INF, 1],
  [2, 0, 3, 2, INF],
  [5, 3, 0, 3, 1],
  [INF, 2, 3, 0, 2],
  [1, INF, 1, 2, 0]
];

// Inicialização do vetor de distâncias
let D = new Array(N).fill(INF);
D[nodeId] = 0;

// Função para enviar o vetor de distâncias para todos os vizinhos
function sendVector() {
  const message = Buffer.from(JSON.stringify({ nodeId, D }));
  neighbors.forEach(neighbor => {
    const client = dgram.createSocket('udp4');
    client.send(message, 41234, neighbor, (err) => {
      if (err) console.error(`Erro ao enviar para ${neighbor}:`, err);
      client.close();
    });
  });
}

// Função para processar as mensagens recebidas
function processMessage(msg) {
  const { nodeId: senderId, D: receivedD } = JSON.parse(msg.toString());

  let changed = false;
  for (let i = 0; i < N; i++) {
    if (D[i] > c[nodeId][senderId] + receivedD[i]) {
      D[i] = c[nodeId][senderId] + receivedD[i];
      changed = true;
    }
  }

  if (changed) {
    sendVector();
  }
}

// Configuração do servidor UDP
const server = dgram.createSocket('udp4');
server.on('message', processMessage);
server.bind(41234, () => {
  console.log(`Nó ${nodeId} escutando na porta 41234`);
  sendVector();
});