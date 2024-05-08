const express = require('express');
const app = express();
const path = require('path');
const fs = require('fs');
const bodyParser = require('body-parser');
const parseString = require('xml2js').parseString;
const xmlBuilder = require('xml2js').Builder;

// Define o diretório para servir arquivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// Define a rota principal
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Configuração do body-parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Rota para lidar com a submissão do formulário
app.post('/salvar', (req, res) => {
    const dadosDoFormulario = req.body;

    // Constrói o caminho completo do arquivo XML
    const caminhoArquivo = path.join(__dirname, 'public/data', 'pontos.xml');

    // Ler o arquivo XML existente
    fs.readFile(caminhoArquivo, 'utf-8', (err, data) => {
        if (err) {
            console.error('Erro ao ler o arquivo XML:', err);
            res.status(500).send('Erro ao ler o arquivo XML');
            return;
        }

        // Parseia o XML para objeto JavaScript
        parseString(data, (err, result) => {
            if (err) {
                console.error('Erro ao analisar o XML:', err);
                res.status(500).send('Erro ao analisar o XML');
                return;
            }

            console.log(dadosDoFormulario);

            // Adiciona o novo ponto ao objeto JavaScript
            result.pontos.ponto.push({
                Endereco: dadosDoFormulario.endereco,
                Cidade: dadosDoFormulario.cidade,
                Estado: dadosDoFormulario.estado,
                Contato: dadosDoFormulario.contato == '' ? '-' : dadosDoFormulario.contato,
                Redes: dadosDoFormulario.redes == '' ? '-' : dadosDoFormulario.redes,
                O_que_esta_arrecadando: dadosDoFormulario.arrecadacao == '' ? '-' : dadosDoFormulario.arrecadacao,
                Horario_Atendimento: dadosDoFormulario.horario_atendimento == '' ? '-' : dadosDoFormulario.horario_atendimento,
                Data_Limite: dadosDoFormulario.data_limite == '' ? '-' : dadosDoFormulario.data_limite
            });

            // Converte o objeto JavaScript de volta para XML
            const builder = new xmlBuilder();
            const xml = builder.buildObject(result);

            // Salva o XML atualizado de volta ao arquivo
            fs.writeFile(caminhoArquivo, xml, 'utf-8', (err) => {
                if (err) {
                    console.error('Erro ao salvar o arquivo XML:', err);
                    res.status(500).send('Erro ao salvar o arquivo XML');
                    return;
                }
                console.log('Novo ponto adicionado ao XML com sucesso');
                res.status(200).send('Novo ponto adicionado ao XML com sucesso');
            });
        });
    });
});


// Inicia o servidor
const port = 3333;
app.listen(port, () => {
    console.log(`Servidor está ouvindo na porta ${port}`);
});