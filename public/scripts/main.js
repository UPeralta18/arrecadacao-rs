// Função para ler os dados do XML e exibir em uma tabela
function exibirDadosXML() {
    // Caminho do arquivo XML
    var arquivoXML = "data/pontos.xml";

    // Requisição XMLHttpRequest para carregar o arquivo XML
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            // Parse do XML
            var xmlDoc = this.responseXML;
            // Array para armazenar os dados dos pontos
            var ponto = xmlDoc.getElementsByTagName("ponto");
            // Construção da tabela
            var tabelaHTML = "<table id='myTable' class='display'><thead><tr><th>Lugar</th><th>Endereço</th><th>Cidade</th><th>Estado</th><th>Contato</th><th>Redes Sociais</th><th>O que está arrecadando</th><th>Horário de Atendimento</th><th>Data Limite</th></tr></thead><tbody>";
            for (var i = 0; i < ponto.length; i++) {
                tabelaHTML += "<tr>";
                tabelaHTML += "<td>" + ponto[i].getElementsByTagName("Lugar")[0].childNodes[0].nodeValue + "</td>";
                tabelaHTML += "<td>" + ponto[i].getElementsByTagName("Endereco")[0].childNodes[0].nodeValue + "</td>";
                tabelaHTML += "<td>" + ponto[i].getElementsByTagName("Cidade")[0].childNodes[0].nodeValue + "</td>";
                tabelaHTML += "<td>" + ponto[i].getElementsByTagName("Estado")[0].childNodes[0].nodeValue + "</td>";
                tabelaHTML += "<td>" + ponto[i].getElementsByTagName("Contato")[0].childNodes[0].nodeValue + "</td>";
                tabelaHTML += "<td>" + ponto[i].getElementsByTagName("Redes")[0].childNodes[0].nodeValue + "</td>";
                tabelaHTML += "<td>" + ponto[i].getElementsByTagName("O_que_esta_arrecadando")[0].childNodes[0].nodeValue + "</td>";
                tabelaHTML += "<td>" + ponto[i].getElementsByTagName("Horario_Atendimento")[0].childNodes[0].nodeValue + "</td>";
                tabelaHTML += "<td>" + ponto[i].getElementsByTagName("Data_Limite")[0].childNodes[0].nodeValue + "</td>";
                tabelaHTML += "</tr>";
            }
            tabelaHTML += "</tbody></table>";

            // Exibição da tabela na div com id "dados"
            document.getElementById("dados").innerHTML = tabelaHTML;
            let table = $('#myTable').DataTable({
                language: {
                    url: "scripts/data-table-br/pt-BR.json",
                },
            });

            if ($('#estadoBusca').val() != null) {
                table.columns(3).search($('#estadoBusca').val()).draw();
            }
            if ($('#cidadeBusca').val() != null) {
                table.columns(2).search($('#cidadeBusca').val()).draw();
            }
        }
    };
    xhttp.open("GET", arquivoXML, true);
    xhttp.send();
}

// Chama a função para exibir os dados quando a página é carregada
exibirDadosXML();

$(document).ready(function () {

    // Função para lidar com o envio do formulário
    const formCadastro = document.getElementById('formCadastro');

    // $("#save").click(function () {
    formCadastro.addEventListener('submit', function (event) {
        event.preventDefault(); // Impede o envio padrão do formulário

        fetch('/salvar', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: new URLSearchParams(new FormData(formCadastro))
        })
            .then(response => response.text())
            .then(data => {
                console.log(data); // Exibe a resposta do servidor no console
            })
            .catch(error => {
                console.error('Erro ao enviar os dados:', error);
            });

        // Feche a modal
        $("#modalCadastro").modal("hide");
        // Chama a função para exibir os dados quando a página é carregada
        location.reload();
    });


    // Função para carregar os estados
    function carregarEstados() {
        $.ajax({
            url: "https://servicodados.ibge.gov.br/api/v1/localidades/estados",
            type: "GET",
            success: function (estados) {
                var selectEstado = $("#estado");
                selectEstado.empty();
                selectEstado.append("<option value=''>Selecione um estado</option>");
                $.each(estados, function (index, estado) {
                    selectEstado.append("<option value='" + estado.nome + "' estado_id='" + estado.id + "'>" + estado.nome + "</option>");
                });
            }
        });

        $.ajax({
            url: "https://servicodados.ibge.gov.br/api/v1/localidades/estados",
            type: "GET",
            success: function (estados) {
                var selectEstado = $("#estadoBusca");
                selectEstado.empty();
                selectEstado.append("<option value=''>Selecione um estado</option>");
                $.each(estados, function (index, estado) {
                    selectEstado.append("<option value='" + estado.nome + "' estado_id='" + estado.id + "'>" + estado.nome + "</option>");
                });
            }
        });
    }
    // Carregar os estados quando a página é carregada
    carregarEstados();

    // Quando um estado é selecionado, carregar as cidades desse estado
    $("#estado").on("change", function () {
        var estadoId = $(this).find(":selected").attr("estado_id");
        if (estadoId) {
            carregarCidades(estadoId);
        } else {
            $("#cidade").empty().append("<option value=''>Selecione um estado primeiro</option>");
        }
    });
    $("#estadoBusca").on("change", function () {
        exibirDadosXML()
        var estadoId = $(this).find(":selected").attr("estado_id");
        if (estadoId) {
            carregarCidadesBusca(estadoId);
        } else {
            $("#cidade").empty().append("<option value=''>Selecione um estado primeiro</option>");
        }
    });

    // Função para carregar as cidades de um estado específico
    function carregarCidades(estadoId) {
        $.ajax({
            url: "https://servicodados.ibge.gov.br/api/v1/localidades/estados/" + estadoId + "/municipios",
            type: "GET",
            success: function (cidades) {
                var selectCidade = $("#cidade");
                selectCidade.empty();
                selectCidade.append("<option value=''>Selecione uma cidade</option>");
                $.each(cidades, function (index, cidade) {
                    selectCidade.append("<option value='" + cidade.nome + "'>" + cidade.nome + "</option>");
                });
            }
        });
    }
    function carregarCidadesBusca(estadoId) {
        $.ajax({
            url: "https://servicodados.ibge.gov.br/api/v1/localidades/estados/" + estadoId + "/municipios",
            type: "GET",
            success: function (cidades) {
                var selectCidade = $("#cidadeBusca");
                selectCidade.empty();
                selectCidade.append("<option value=''>Selecione uma cidade</option>");
                $.each(cidades, function (index, cidade) {
                    selectCidade.append("<option value='" + cidade.nome + "'>" + cidade.nome + "</option>");
                });
            }
        });
    }

    $("#cidadeBusca").on("change", function () {
        exibirDadosXML()
    });
});