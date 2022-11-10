/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *

 * Objetivo:     Arquivo responsável pela manipulação de recebimento, tratamento e retorno de dados, entre a API e a model
 * Autora:       Marina Santello
 * Data criação: 06/10/2022
 * Versão:       1.10

* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

// Import do arquivo de mensagens padronizadas
const { MESSAGE_ERROR, MESSAGE_SUCESS} = require('../module/config')

// Funcao para gerar um novo aluno
const novoAluno = async function(aluno) {
    // Import da model de aluno
    const novoAluno = require('../model/DAO/aluno.js')
    // Import da model 'aluno_curso' (tabela de casamento entre aluno e curso)
    const novoAlunoCurso = require('../model/DAO/aluno_curso.js')

    // Validação de campos obrigatórios
    if (aluno.nome == '' || aluno.foto == '' || aluno.rg == '' || aluno.cpf == '' || aluno.email == '' || aluno.data_nascimento == '' || aluno.nome == undefined || aluno.foto == undefined || aluno.rg == undefined || aluno.cpf == undefined || aluno.email == undefined || aluno.data_nascimento == undefined)
        return { statusCode: 400, message: MESSAGE_ERROR.REQUIRED_FIELDS }

    // Validação para verificar se o email é válido
    else if (!aluno.email.includes('@'))
        return { statusCode: 400, message: MESSAGE_ERROR.INVALID_EMAIL }
    
    else {
        // Chama a função para inserir um novo aluno
        const resultNovoAluno = await novoAluno.insertAluno(aluno)

        // Verificação do retono da função (se deu certo a inserção ou não)
        if(resultNovoAluno) {
            // Chamada da função que verifica qual o último ID gerado na tabela de aluno
            let idNovoAluno = await novoAluno.selectLastIDAluno()
            let idCurso = aluno.curso[0].id_curso

            // Variável que retorna o ano corrente
            let anoMatricula = new Date().getFullYear()

            if (idNovoAluno > 0) {
                let alunoCursoJSON = {}
                // Geração da matricula do aluno, concatenando o id do aluno, do curso e o ano de matricula
                let numeroMatricula = `${idNovoAluno}${idCurso}${anoMatricula}`
                
                // Criação de chaves do JSON para enviar os dados necessários, que não vem do front
                alunoCursoJSON.id_aluno = idNovoAluno
                alunoCursoJSON.id_curso = idCurso
                alunoCursoJSON.matricula = numeroMatricula
                alunoCursoJSON.status_aluno = 'Cursando'

                // Chamada da função que insere os dados na tabela de casamento aluno-curso
                const resultNovoAlunoCurso = await novoAlunoCurso.insertAlunoCurso(alunoCursoJSON)
                // console.log(resultNovoAlunoCurso)

                // Verificação do retono da função (se deu certo a inserção ou não)
                if (resultNovoAlunoCurso)
                    return { statusCode: 201, message: MESSAGE_SUCESS.INSERT_ITEM }

                else {
                    // Caso aconteça um erro nesse processo, obrigatoriamente deverá ser excluído do banco de dados o registro do aluno
                    await excluirAluno(idNovoAluno)

                    return { statusCode: 500, message: MESSAGE_ERROR.INTERNAL_ERROR_DB }
                }
            } else {
                // Caso aconteça um erro nesse processo, obrigatoriamente deverá ser excluído do banco de dados o registro do aluno
                await excluirAluno(idNovoAluno)

                return { statusCode: 500, message: MESSAGE_ERROR.INTERNAL_ERROR_DB }
            }
        } else
            return { statusCode: 500, message: MESSAGE_ERROR.INTERNAL_ERROR_DB }
    }
}

// Função para retornar outros registros
const listarAlunos = async function() {
    const { selectAllAlunos } = require('../model/DAO/aluno.js')
    const { selectAlunoCurso } = require('../model/DAO/aluno_curso.js')

    let alunosJSON = {}

    // busca todos os alunos
    const dadosAlunos = await selectAllAlunos()

    if (dadosAlunos){

        // 'await' só funciona em funções assíncronas e o map (e o forEach também) é uma função, logo, o async é necessário para o 'await' funcionar
        const alunosCursoArray = dadosAlunos.map(async itemAluno => {
            // busca os dados referente ao curso dos alunos
            const dadosAlunoCurso = await selectAlunoCurso(itemAluno.id)

            if (dadosAlunoCurso) 
                // acrescenta uma chave 'curso' e insere os dados do curso do aluno
                itemAluno.curso = dadosAlunoCurso

            else
                itemAluno.curso = MESSAGE_ERROR.NOT_COURSE
            // insere no array cada elemento contando com os dados do aluno e do curso, os juntando num só item do array
            // alunosCursoArray.push(itemAluno)

            return itemAluno
        })

        // 'Promise.all': executa a const aguardando todos os await/async serem finalizados (await para aguardar a execução do Promise)
        console.log(await Promise.all(alunosCursoArray))
        // Conversão do tipo de dados do ID de dados de BigInt para Int ***
        // dadosAlunos.forEach(element => {
        //     element.id = Number(element.id)        
        // }); *** melhor fazer esse processamento no banco
        
        // Criação chave 'alunos' no JSON para retornar o array de alunos
        alunosJSON.alunos = await Promise.all(alunosCursoArray) //.reverse() - comando que permite inverter a ordem dos elementos do array

        return alunosJSON
    }
    else
        return false
}

// Função para atualizar um registro
const atualizarAluno = async function(aluno) {
    // Import da model de aluno
    const atualizarAluno = require('../model/DAO/aluno.js')

    // Validação de campos obrigatórios
    if (aluno.nome == '' || aluno.foto == '' || aluno.rg == '' || aluno.cpf == '' || aluno.email == '' || aluno.data_nascimento == '' || aluno.nome == undefined || aluno.foto == undefined || aluno.rg == undefined || aluno.cpf == undefined || aluno.email == undefined || aluno.data_nascimento == undefined)
        return { statusCode: 400, message: MESSAGE_ERROR.REQUIRED_FIELDS }

    // Validação para verificar se o email é válido
    else if (!aluno.email.includes('@'))
        return { statusCode: 400, message: MESSAGE_ERROR.INVALID_EMAIL }
    
    else {
        // Chama a função para atualizar um aluno
        const result = await atualizarAluno.updateAluno(aluno)
        //console.log(result)

        // Verificação do retono da função (se deu certo a inserção ou não)
        if (result)
            return { statusCode: 200, message: MESSAGE_SUCESS.UPDATE_ITEM }
        
        else
            return { statusCode: 500, message: MESSAGE_ERROR.INTERNAL_ERROR_DB }
    }
}

// Função para excluir um registro
const excluirAluno = async function(id) {
    // Import da model de aluno
    const excluirAluno = require('../model/DAO/aluno.js')

    if (id == '' || id == undefined)
        return { statusCode: 400, message: MESSAGE_ERROR.REQUIRED_ID }

    else {
        // Validação da existencia do ID no DB
        const encontrarAluno = await buscarAluno(id)

        // Verfica se foi encontrado um registro válido
        if(encontrarAluno) {
            // Chama a função para atualizar um aluno
            const result = await excluirAluno.deleteAluno(id)
            //console.log(result)

            // Verificação do retono da função (se deu certo a inserção ou não)
            if (result)
                return { statusCode: 200, message: MESSAGE_SUCESS.DELETE_ITEM }
            
            else
                return { statusCode: 500, message: MESSAGE_ERROR.INTERNAL_ERROR_DB }
        }

        else 
            return { statusCode: 404, message: MESSAGE_ERROR.NOT_FOUND_DB }
    }

}

// Função para retornar um registro a partir do ID
const buscarAluno = async function(id) {
    const { selectByIDAluno } = require('../model/DAO/aluno.js')
    const { selectAlunoCurso } = require('../model/DAO/aluno_curso.js')
    let alunoJSON = {}
    
    if (id == '' || id == undefined)
        return { statusCode: 400, message: MESSAGE_ERROR.REQUIRED_ID }

    else {
        const dadosAluno = await selectByIDAluno(id)

        if (dadosAluno) {
            // Conversão do tipo de dados do ID de dados de BigInt para Int ***
            // dadosAlunos.forEach(element => {
            //     element.id = Number(element.id)        
            // }); *** melhor fazer esse processamento no banco
            
            // Busca os dados referente ao curso do aluno
            const dadosAlunoCurso = await selectAlunoCurso(id)

            // Verifica se a busca teve sucesso
            if (dadosAlunoCurso) {
                // Adiciona a chave curso dentro do objeto dos dados do aluno e acrescenta os dados do curso, que
                dadosAluno[0].curso = dadosAlunoCurso

                // Criação chave 'alunos' no JSON para retornar o array de alunos
                alunoJSON.aluno = dadosAluno //.reverse() - comando que permite inverter a ordem dos elementos do array
    
                return alunoJSON
            } else {
                alunoJSON.aluno = dadosAluno
    
                return alunoJSON
            }
        }
        
        else
            return false
    }
}

module.exports = {
    listarAlunos,
    novoAluno,
    atualizarAluno,
    excluirAluno,
    buscarAluno
}
// console.log(listarAlunos())