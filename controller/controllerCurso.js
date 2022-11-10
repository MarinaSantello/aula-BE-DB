/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *

 * Objetivo:     Arquivo responsável pela manipulação de recebimento, tratamento e retorno de dados, entre a API e a model
 * Autora:       Marina Santello
 * Data criação: 27/10/2022
 * Versão:       1.0

* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

// Import do arquivo de mensagens padronizadas
const { MESSAGE_ERROR, MESSAGE_SUCESS} = require('../module/config')

// Import do arquivo com as funções da model
const modelCurso = require('../model/DAO/curso')

const novoCurso = async function(curso) {
    // Variável que armazena o json de cursos
    let cursoJSON = await curso

    // Validação do tipo de dado que está sendo recebido na carga horária
    if(isNaN(cursoJSON.carga_horaria))
        return { statusCode: 400, message: MESSAGE_ERROR.TYPE_VAR }

    // Validação de preenchimento do campo de icone, para controlar a quantidade de caracteres no endereço da imagem
    else if (cursoJSON.icone != '') {
        // Validação da quantidade de caracteres no endereço da imagem
        if (cursoJSON.icone.length > 200) {
            return { statusCode: 400, message: MESSAGE_ERROR.LIMIT_EXCEEDED }
        }
        // Validação de campos obrigatórios
        else if (cursoJSON.nome == '' || cursoJSON.carga_horaria == '' || cursoJSON.nome == undefined || cursoJSON.carga_horaria == undefined)
            return { statusCode: 400, message: MESSAGE_ERROR.REQUIRED_FIELDS }

        else {
            // Chama a função para inserir um novo aluno
            const result = await modelCurso.insertCurso(cursoJSON)

        // Verificação do retono da função (se deu certo a inserção ou não)
        if (result)
            return { statusCode: 201, message: MESSAGE_SUCESS.INSERT_ITEM }

        else
            return { statusCode: 500, message: MESSAGE_ERROR.INTERNAL_ERROR_DB }

        }
    }
}

const listarCursos = async function() {
    let cursosJSON = {}

    const dadosCursos = await modelCurso.selectAllCursos()

    if (dadosCursos) {
        cursosJSON.statusCode = 200
        cursosJSON.cursos = dadosCursos

        return cursosJSON
    }

    else
        return false
}

const buscarCurso = async function (id) {
    let cursoID = await id
    let cursoJSON = {}

    const cursoEncontrado = await modelCurso.selectByIDCurso(cursoID)

    if (cursoID == '' || cursoID == undefined)
        return { statusCode: 400, message: MESSAGE_ERROR.REQUIRED_ID }

    else if(cursoEncontrado) {
        cursoJSON.statusCode = 200
        cursoJSON.curso = cursoEncontrado

        return cursoJSON
    }

    else
        return false
}

const atualizarCurso = async function(curso) {
    // Variável que armazena o json de cursos
    let cursoJSON = await curso

    // Validação do tipo de dado que está sendo recebido na carga horária
    if(isNaN(cursoJSON.carga_horaria))
        return { statusCode: 400, message: MESSAGE_ERROR.TYPE_VAR }

    // Validação de campos obrigatórios
    else if (cursoJSON.nome == '' || cursoJSON.carga_horaria == '' || cursoJSON.nome == undefined || cursoJSON.carga_horaria == undefined)
        return { statusCode: 400, message: MESSAGE_ERROR.REQUIRED_FIELDS }

    else {
        // Chama a função para inserir um novo aluno
        const result = await modelCurso.updateCurso(cursoJSON)

        // Verificação do retono da função (se deu certo a inserção ou não)
        if (result)
            return { statusCode: 201, message: MESSAGE_SUCESS.UPDATE_ITEM }
        
        else
            return { statusCode: 500, message: MESSAGE_ERROR.INTERNAL_ERROR_DB }
    }    
}

const excluirCurso = async function(id) {
    let cursoID = await id

    // Variável para validação da existencia do ID no DB
    const encontrarCurso = await buscarCurso(cursoID)

    const result = await modelCurso.deleteCurso(cursoID)

    if (cursoID == '' || cursoID == undefined)
        return { statusCode: 400, message: MESSAGE_ERROR.REQUIRED_ID }

    // Verfica se foi encontrado um registro válido
    else if(encontrarCurso) {

        if (result)
            return { statusCode: 200, message: MESSAGE_SUCESS.DELETE_ITEM }
        
        else
            return { statusCode: 500, message: MESSAGE_ERROR.INTERNAL_ERROR_DB }
    }

    else
        return { statusCode: 404, message: MESSAGE_ERROR.NOT_FOUND_DB }
}

module.exports = {
    novoCurso,
    listarCursos,
    buscarCurso,
    atualizarCurso,
    excluirCurso
}