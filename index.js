const express = require('express');
const app = express();

app.use(express.json());

// ======================================================
// ETAPA 1: Tratar e Validar Celular
// ======================================================
app.post('/tratar-telefone', (req, res) => {
  const { telefone } = req.body;

  if (!telefone) {
    return res.status(400).json({ valido: false, erro: 'Informe o número de telefone.' });
  }

  // Remove caracteres não numéricos
  let numeroLimpo = telefone.toString().replace(/\D/g, '');

  // Remove o DDI 55 do início se existir
  if (numeroLimpo.startsWith('55')) {
    numeroLimpo = numeroLimpo.substring(2);
  }

  // Valida se ficou com 10 ou 11 dígitos (DDD + número)
  if (numeroLimpo.length < 10 || numeroLimpo.length > 11) {
    return res.status(400).json({
      valido: false,
      erro: 'Número inválido. Envie o telefone com DDD (ex: 11999998888).'
    });
  }

  return res.json({
    valido: true,
    telefoneTratado: numeroLimpo
  });
});

// ======================================================
// ETAPA 2: Validar Nome
// ======================================================
app.post('/validar-nome', (req, res) => {
  const { nome } = req.body;

  if (!nome) {
    return res.status(400).json({ valido: false, erro: 'Informe o nome.' });
  }

  // Divide por espaços
  const palavras = nome.toString().trim().split(/\s+/);

  // Valida se tem pelo menos 2 palavras com no mínimo 3 letras cada
  if (palavras.length < 2 || palavras[0].length < 3 || palavras[1].length < 3) {
    return res.status(400).json({
      valido: false,
      erro: 'Por favor, digite seu nome e sobrenome (mínimo de 3 letras em cada).'
    });
  }

  return res.json({
    valido: true,
    nomeTratado: nome.trim()
  });
});

// ======================================================
// ETAPA 3: Validar CPF
// ======================================================
app.post('/validar-cpf', (req, res) => {
  const { cpf } = req.body;

  if (!cpf) {
    return res.status(400).json({ valido: false, erro: 'Informe o CPF.' });
  }

  // Remove pontos e traços
  const cpfLimpo = cpf.toString().replace(/\D/g, '');

  if (cpfLimpo.length !== 11) {
    return res.status(400).json({
      valido: false,
      erro: 'CPF inválido. O CPF precisa ter exatamente 11 dígitos.'
    });
  }

  return res.json({
    valido: true,
    cpfTratado: cpfLimpo
  });
});

// ======================================================
// ETAPA 4: Validar e Formatar Data de Nascimento (AAAA-MM-DD)
// ======================================================
app.post('/validar-data-nascimento', (req, res) => {
  const { dataNascimento } = req.body;

  if (!dataNascimento) {
    return res.status(400).json({ valido: false, erro: 'Informe a data de nascimento.' });
  }

  // Apenas os números digitados
  const apenasNumeros = dataNascimento.toString().replace(/\D/g, '');

  if (apenasNumeros.length !== 8) {
    return res.status(400).json({
      valido: false,
      erro: 'Data inválida. Envie com dia, mês e ano completo (ex: 03/05/1990).'
    });
  }

  let dia, mes, ano;

  // Identifica se a pessoa enviou no padrão AAAA-MM-DD ou DD-MM-AAAA
  if (dataNascimento.toString().trim().startsWith('19') || dataNascimento.toString().trim().startsWith('20')) {
    // Formato tipo AAAA/MM/DD
    ano = apenasNumeros.substring(0, 4);
    mes = apenasNumeros.substring(4, 6);
    dia = apenasNumeros.substring(6, 8);
  } else {
    // Formato BR clássico: DD/MM/AAAA
    dia = apenasNumeros.substring(0, 2);
    mes = apenasNumeros.substring(2, 4);
    ano = apenasNumeros.substring(4, 8);
  }

  // Validação real da data (se dia/mês/ano existem)
  const dataObjeto = new Date(`${ano}-${mes}-${dia}T00:00:00`);
  const anoAtual = new Date().getFullYear();

  if (
    isNaN(dataObjeto.getTime()) ||
    Number(mes) < 1 || Number(mes) > 12 ||
    Number(dia) < 1 || Number(dia) > 31 ||
    Number(ano) < 1900 || Number(ano) > anoAtual
  ) {
    return res.status(400).json({
      valido: false,
      erro: 'Data de nascimento inexistente ou inválida.'
    });
  }

  // Retorna no formato YYYY-MM-DD
  const dataFormatada = `${ano}-${mes.padStart(2, '0')}-${dia.padStart(2, '0')}`;

  return res.json({
    valido: true,
    dataNascimentoTratada: dataFormatada
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor do Bot rodando na porta ${PORT}`);
});