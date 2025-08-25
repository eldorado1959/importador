CREATE TABLE estoque (
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
);
