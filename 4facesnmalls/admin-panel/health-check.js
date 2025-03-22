const http = require('http');

// Função para verificar o servidor
const checkServer = () => {
  console.log('Verificando se o servidor Next.js está rodando...');
  
  // Fazer uma requisição para o servidor local
  const req = http.request(
    {
      host: 'localhost',
      port: 3001,
      path: '/',
      method: 'GET',
      timeout: 2000
    },
    (res) => {
      console.log(`Status do servidor: ${res.statusCode}`);
      if (res.statusCode >= 200 && res.statusCode < 400) {
        console.log('Servidor Next.js está respondendo corretamente!');
      } else {
        console.log('Servidor Next.js retornou código de erro!');
      }
      
      // Coletar e imprimir cabeçalhos da resposta
      console.log('\nCabeçalhos da resposta:');
      console.log(JSON.stringify(res.headers, null, 2));
      
      // Imprimir dados da resposta
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        console.log('\nPrimeiros 200 caracteres do corpo da resposta:');
        console.log(data.substring(0, 200));
      });
    }
  );
  
  req.on('error', (e) => {
    console.error(`Erro na verificação: ${e.message}`);
    if (e.code === 'ECONNREFUSED') {
      console.error('Não foi possível conectar ao servidor. Verifique se o Next.js está rodando na porta 3001.');
    }
  });
  
  req.on('timeout', () => {
    console.error('Timeout na requisição.');
    req.destroy();
  });
  
  req.end();
};

// Executa o teste
checkServer();

// Também tenta na interface 0.0.0.0
setTimeout(() => {
  console.log('\n\nVerificando na interface 0.0.0.0...');
  const req2 = http.request(
    {
      host: '0.0.0.0',
      port: 3001,
      path: '/',
      method: 'GET',
      timeout: 2000
    },
    (res) => {
      console.log(`Status do servidor (0.0.0.0): ${res.statusCode}`);
    }
  );
  
  req2.on('error', (e) => {
    console.error(`Erro na verificação (0.0.0.0): ${e.message}`);
  });
  
  req2.end();
}, 3000); 