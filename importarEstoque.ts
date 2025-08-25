import * as fs from "fs";
import * as readline from "readline";
import mysql from "mysql2/promise";

// Configuração do MySQL
const connectionConfig = {
  host: "localhost",
  user: "root",
  password: "sua_senha",
  database: "sua_base",
};

async function importarArquivo(caminho: string) {
  const conn = await mysql.createConnection(connectionConfig);

  // Cria a tabela (se não existir)
  await conn.execute(`
    CREATE TABLE IF NOT EXISTS estoque (
      codigo       CHAR(8),
      descricao    VARCHAR(35),
      marca        VARCHAR(10),
      valor        DECIMAL(9,2),
      valor2       DECIMAL(9,2),
      quantidade   INT,
      pto          INT,
      preco_ant    DECIMAL(9,2),
      dia_alt      INT,
      mes_alt      INT,
      ano_alt      INT,
      fornecedor   VARCHAR(10),
      data_e       CHAR(6),
      perc_lucro   INT
    )
  `);

  // Lê linha por linha
  const fileStream = fs.createReadStream(caminho, { encoding: "latin1" });
  const rl = readline.createInterface({ input: fileStream, crlfDelay: Infinity });

  let count = 0;

  for await (const linha of rl) {
    if (linha.trim().length === 0) continue; // ignora linhas vazias

    const codigo     = linha.substring(0, 8).trim();
    const descricao  = linha.substring(8, 43).trim();
    const marca      = linha.substring(43, 53).trim();
    const valor      = parseInt(linha.substring(53, 62)) / 100;
    const valor2     = parseInt(linha.substring(62, 71)) / 100;
    const quantidade = parseInt(linha.substring(71, 74));
    const pto        = parseInt(linha.substring(74, 76));
    const precoAnt   = parseInt(linha.substring(76, 85)) / 100;
    const diaAlt     = parseInt(linha.substring(85, 87));
    const mesAlt     = parseInt(linha.substring(87, 89));
    const anoAlt     = parseInt(linha.substring(89, 91));
    const fornecedor = linha.substring(91, 101).trim();
    const dataE      = linha.substring(101, 107).trim();
    const percLucro  = parseInt(linha.substring(107, 110));

    await conn.execute(
      `INSERT INTO estoque 
      (codigo, descricao, marca, valor, valor2, quantidade, pto, preco_ant, 
       dia_alt, mes_alt, ano_alt, fornecedor, data_e, perc_lucro)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        codigo, descricao, marca, valor, valor2, quantidade, pto, precoAnt,
        diaAlt, mesAlt, anoAlt, fornecedor, dataE, percLucro
      ]
    );

    count++;
    if (count % 1000 === 0) {
      console.log(`${count} registros inseridos...`);
    }
  }

  console.log(`✅ Importação concluída. Total de registros: ${count}`);
  await conn.end();
}

// Executar
importarArquivo("DEPOSITO.DAT").catch(err => console.error(err));
