/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *

 * Objetivo:     API responsável pela manipulação de dados do BACK-END
                (GET, POST, PUT e DELETE)
 * Autora:       Marina Santello
 * Data criação: 10/10/2022
 * Versão:       2.0

 * Anotações:
 - Comandos de instalação para manipulação do acesso ao banco de dados:
    (pode-se utilizar o 'Prisma', ou outros frameworks com a mesma finalidade)

 * npm install prisma --save
 * npx prisma
 * npx prisma init
 * npm install @prisma/client

 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

// Import das bibliotecas
const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const { request, response } = require('express')

// Import do arquivo de mensagens padronizadas
const { MESSAGE_ERROR, MESSAGE_SUCESS} = require('./module/config')
const e = require('express')

const app = express()

// Confuguração de cors para liberar o acesso a API
app.use((request, response, next) => {
    response.header('Access-Control-Allow-Origin', '*')
    response.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE, OPTIONS')

    app.use(cors())
    next()
})

// Criação de objeto que permite receber um JSON no body nas requisições
const jsonParser = bodyParser.json()

/* * * * * * * * * * * * * * * * * *

 * Rotas para CRUD de alunos 
 * Data: 10/10/20222

* * * * * * * * * * * * * * * * * */

// EndPoint para listar alunos
app.get('/v1/alunos', cors(), async function(request, response) {
    let statusCode
    let message

    // Import di arquivo 'controllerAluno'
    const controllerAluno = require('./controller/controllerAluno')

    // Retorna todos os alunos existentes no banco de dados, a partir da função 'listaAlunos'
    const dadosAlunos = await controllerAluno.listarAlunos()

    // Valida se existe retorno de dados
    if(dadosAlunos) {
        // Caso de dados retornados com sucesso
        statusCode = 200
        message = dadosAlunos
    }
    else {
        // Caso de dados retornados sem sucesso
        statusCode = 404
        message = MESSAGE_ERROR.NOT_FOUND_DB
    }

    // Retorno de dados da API
    response.status(statusCode)
    response.json(message)
})

// EndPoint para inserir um novo aluno
app.post('/v1/aluno', cors(), jsonParser, async function(request, response) {
    // Import do arquivo da controller de aluno
    const controllerAluno = require('./controller/controllerAluno.js')
    let statusCode
    let message
    let headerContentType

    // Recebe o tipo de coontent-type que foi enviado no header da requisição (application/json)
    // 'content-type': propriedade que retorna o formato de dados da requisição
    headerContentType = request.headers['content-type']

    // console.log(headerContentType)

    if (headerContentType == 'application/json'){
        // Recebe conteúdo do corpo (body) da mensagem
        let dadosBody = request.body

        // Realiza um processo de conversão de dados para ser possível a comparação do json vazio
        if (JSON.stringify(dadosBody) == '{}') {
            statusCode = 400;
            message = MESSAGE_ERROR.EMPTY_BODY
        }

        else {
            // Chama a função 'novoAluno' da controller e encaminha os dados do body
            const novoAluno = await controllerAluno.novoAluno(dadosBody)

            statusCode = novoAluno.statusCode
            message = novoAluno.message
        }
    }

    else {
        statusCode = 415
        message = MESSAGE_ERROR.CONTENT_TYPE
    }

    response.status(statusCode)
    response.json(message)
})

// EndPoint para atualizar os dados de um aluno existente
app.put('/v1/aluno/:id', cors(), jsonParser, async function(request, response) {
    let id = request.params.id

    // Import do arquivo da controller de aluno
    const controllerAluno = require('./controller/controllerAluno.js')
    let statusCode
    let message
    let headerContentType

    // Recebe o tipo de coontent-type que foi enviado no header da requisição (application/json)
    // 'content-type': propriedade que retorna o formato de dados da requisição
    headerContentType = request.headers['content-type']

    // console.log(headerContentType)

    if(headerContentType == 'application/json') {
        // Recebe conteúdo do corpo (body) da mensagem
        let dadosBody = request.body

        // Realiza um processo de conversão de dados para ser possível a comparação do json vazio
        if (JSON.stringify(dadosBody) == '{}') {
            statusCode = 400;
            message = MESSAGE_ERROR.EMPTY_BODY
        }

        else {

            if(id != '' && id != undefined) {
                // Adiciona o id no JSON que chegou no corpo da requisição
                dadosBody.id = id

                // Chama a função 'novoAluno' da controller e encaminha os dados do body
                const alunoAtualizado = await controllerAluno.atualizarAluno(dadosBody)
    
                statusCode = alunoAtualizado.statusCode
                message = alunoAtualizado.message

            }
        }
    }

    else {
        statusCode = 415
        message = MESSAGE_ERROR.CONTENT_TYPE
    }

    response.status(statusCode)
    response.json(message)
})

// EndPoint para excluir um aluno existente
app.delete('/v1/aluno/:id', cors(), jsonParser, async function(request, response) {
    let id = request.params.id

    // Import do arquivo da controller de aluno
    const controllerAluno = require('./controller/controllerAluno.js')
    let statusCode
    let message

    if(id !== '' && id !== undefined) {
        // Chama a função da controller para excluir um item
        const alunoExcluido = await controllerAluno.excluirAluno(id)

        statusCode = alunoExcluido.statusCode
        message = alunoExcluido.message
    }

    else {
        statusCode = 400
        message = MESSAGE_ERROR.REQUIRED_ID
    }

    response.status(statusCode)
    response.json(message)
})

// EndPoint para buscar um registro de aluno no banco, pelo ID
app.get('/v1/aluno/:id', cors(), async function(request, response) {
    let id = request.params.id
    let statusCode
    let message

    if(id != '' && id != undefined) {
        // Import di arquivo 'controllerAluno'
        const controllerAluno = require('./controller/controllerAluno')

        // Retorna todos os alunos existentes no banco de dados, a partir da função 'listaAlunos'
        const dadosAluno = await controllerAluno.buscarAluno(id)

        // Valida se existe retorno de dados
        if(dadosAluno) {
            // Caso de dados retornados com sucesso
            statusCode = 200
            message = dadosAluno
        }
        else {
            // Caso de dados retornados sem sucesso
            statusCode = 404
            message = MESSAGE_ERROR.NOT_FOUND_DB
        }
    }

    else {
        statusCode = 400
        message = MESSAGE_ERROR.REQUIRED_ID
    }

    // Retorno de dados da API
    response.status(statusCode)
    response.json(message)
})

/* * * * * * * * * * * * * * * * * *

 * Rotas para CRUD de cursos 
 * Data: 27/10/20222

* * * * * * * * * * * * * * * * * */

// Import do arquivo 'controllerCurso'
const controllerCurso = require('./controller/controllerCurso')

// EndPoint para listar cursos
app.get('/v1/cursos', cors(), async function(request, response) {
    let statusCode
    let message = {}

    // Retorna todos os alunos existentes no banco de dados, a partir da função 'listaAlunos'
    const dadosCursos = await controllerCurso.listarCursos()
    // console.log(dadosCursos)

    // Valida se existe retorno de dados
    if(dadosCursos) {
        // Caso de dados retornados com sucesso
        statusCode = dadosCursos.statusCode
        message.cursos = dadosCursos.cursos
    }
    else {
        // Caso de dados retornados sem sucesso
        statusCode = 404
        message = MESSAGE_ERROR.NOT_FOUND_DB
    }

    // Retorno de dados da API
    response.status(statusCode)
    response.json(message)
})

// EndPoint para inserir um curso
app.post('/v1/curso', cors(), jsonParser, async function(request, response) {
    let statusCode
    let message
    let headerContentType

    // Recebe o tipo de coontent-type que foi enviado no header da requisição (application/json)
    // 'content-type': propriedade que retorna o formato de dados da requisição
    headerContentType = request.headers['content-type']

    // console.log(headerContentType)

    if (headerContentType == 'application/json'){
        // Recebe conteúdo do corpo (body) da mensagem
        let dadosBody = request.body

        // Realiza um processo de conversão de dados para ser possível a comparação do json vazio
        if (JSON.stringify(dadosBody) == '{}') {
            statusCode = 400;
            message = MESSAGE_ERROR.EMPTY_BODY
        }

        else {
            const inserirCurso = await controllerCurso.novoCurso(dadosBody)

            statusCode = inserirCurso.statusCode
            message = inserirCurso.message
        }
    }

    else {
        statusCode = 415
        message = MESSAGE_ERROR.CONTENT_TYPE
    }

    response.status(statusCode)
    response.json(message)
})

// EndPoint para atualizar os dados de um curso existente
app.put('/v1/curso/:id', cors(), jsonParser, async function(request, response) {
    const id = request.params.id
    let statusCode
    let message
    let headerContentType

    // Recebe o tipo de coontent-type que foi enviado no header da requisição (application/json)
    // 'content-type': propriedade que retorna o formato de dados da requisição
    headerContentType = request.headers['content-type']

    // console.log(headerContentType)

    if(headerContentType == 'application/json') {
        // Recebe conteúdo do corpo (body) da mensagem
        let dadosBody = request.body

        // Realiza um processo de conversão de dados para ser possível a comparação do json vazio
        if (JSON.stringify(dadosBody) == '{}') {
            statusCode = 400;
            message = MESSAGE_ERROR.EMPTY_BODY
        }

        else {

            if(id != '' && id != undefined) {
                // Adiciona o id no JSON que chegou no corpo da requisição
                dadosBody.id = id

                // Chama a função 'atualizarCurso' da controller e encaminha os dados do body
                const cursoAtualizado = await controllerCurso.atualizarCurso(dadosBody)

                statusCode = cursoAtualizado.statusCode
                message = cursoAtualizado.message

            }
        }
    }

    else {
        statusCode = 415
        message = MESSAGE_ERROR.CONTENT_TYPE
    }

    response.status(statusCode)
    response.json(message)
})

// EndPoint para excluir um registro existente
app.delete('/v1/curso/:id', cors(), jsonParser, async function(request, response){
    let id = request.params.id
    let statusCode
    let message

    if(id !== '' && id !== undefined) {
        // Chama a função da controller para excluir um item
        const cursoExcluido = await controllerCurso.excluirCurso(id)

        statusCode = cursoExcluido.statusCode
        message = cursoExcluido.message
    }

    else {
        statusCode = 400
        message = MESSAGE_ERROR.REQUIRED_ID
    }

    response.status(statusCode)
    response.json(message)
})

// EndPoint para encontrar um registro existente
app.get('/v1/curso/:id', cors(), jsonParser, async function(request, response){
    let id = request.params.id
    let statusCode
    let message

    if(id != '' && id != undefined) {
        const dadosCurso = await controllerCurso.buscarCurso(id)

        // Valida se existe retorno de dados
        if(dadosCurso) {
            // Caso de dados retornados com sucesso
            statusCode = dadosCurso.statusCode
            message = dadosCurso.curso
        }
        else {
            // Caso de dados retornados sem sucesso
            statusCode = 404
            message = MESSAGE_ERROR.NOT_FOUND_DB
        }
    }

    else {
        statusCode = 400
        message = MESSAGE_ERROR.REQUIRED_ID
    }

    // Retorno de dados da API
    response.status(statusCode)
    response.json(message)
})
// Ativa o servidor para receber requisições HTTP
app.listen(8080, function(){
    console.log('Servidor aguardando requisições.')
})