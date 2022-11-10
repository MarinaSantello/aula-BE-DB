/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *

 * Objetivo:     Arquivo responsável pela manipulação de dados, com o DB (insert, select, update e delete - CRUD)
 * Autora:       Marina Santello
 * Data criação: 06/10/2022
 * Versão:       1.7

* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

// função para inserir um novo registro no DB
const insertAluno = async function(aluno) {

    try {
        // Import da classe 'PrismaClient', que é responsável pelas interações com o DB
        const { PrismaClient } = require('@prisma/client')

        // Instância da classe 'PrismaClient' ('prisma': objeto)
        const prisma = new PrismaClient()

        let sql = `insert into tbl_aluno (nome, 
                                        foto, 
                                        rg, 
                                        cpf, 
                                        email, 
                                        data_nascimento, 
                                        telefone, 
                                        celular, 
                                        sexo)
                                        
                                        values (
                                            '${aluno.nome}',
                                            '${aluno.foto}',
                                            '${aluno.rg}',
                                            '${aluno.cpf}',
                                            '${aluno.email}',
                                            '${aluno.data_nascimento}',
                                            '${aluno.telefone}',
                                            '${aluno.celular}',
                                            '${aluno.sexo}')`

        // Executa o script sql no banco de dados
            // 'executeRawUnsafe()': permite executar uma variável contendo o script
            //   retono:
            // - true: execução do scrpit teve sucesso
            // - false: execução do scrpit não teve sucesso
        const result = await prisma.$executeRawUnsafe(sql)

        // Verifica se o script foi executado com sucesso no BD
        if (result) 
            return true

        else
            return false
        
    }

    catch(error) {
        return false
    }

}

// função para retornar todos os registros do DB
const selectAllAlunos = async function() {

    // Import da classe 'PrismaClient', que é responsável pelas interações com o DB
    const { PrismaClient } = require('@prisma/client')

    // Instância da classe 'PrismaClient' ('prisma': objeto)
    const prisma = new PrismaClient()

    // Criação de objeto do tipo 'RecordSet' (rsAlunos), para receber os dados do DB, através do script SQL (select)
    const rsAlunos = await prisma.$queryRaw `select cast(id as float) as id, nome, foto, sexo, rg, cpf, email, telefone, celular, data_nascimento from tbl_aluno order by id desc`

    if (rsAlunos.length > 0)
        return rsAlunos

    else
        return false
}

// função para atuarlizar um registro no DB
const updateAluno = async function(aluno) {

    try {
        // Import da classe 'PrismaClient', que é responsável pelas interações com o DB
        const { PrismaClient } = require('@prisma/client')

        // Instância da classe 'PrismaClient' ('prisma': objeto)
        const prisma = new PrismaClient()

        let sql = `update tbl_aluno set nome            = '${aluno.nome}',
                                        foto            = '${aluno.foto}',
                                        rg              = '${aluno.rg}',
                                        cpf             = '${aluno.cpf}',
                                        email           = '${aluno.email}',
                                        data_nascimento = '${aluno.data_nascimento}',
                                        telefone        = '${aluno.telefone}',
                                        celular         = '${aluno.celular}',
                                        sexo            = '${aluno.sexo}'
                                  where id              = ${aluno.id};`

        // Executa o script sql no banco de dados
            // 'executeRawUnsafe()': permite executar uma variável contendo o script
            //   retono:
            // - true: execução do scrpit teve sucesso
            // - false: execução do scrpit não teve sucesso
        const result = await prisma.$executeRawUnsafe(sql)

        // Verifica se o script foi executado com sucesso no BD
        if (result) 
            return true

        else
            return false
        
    }

    catch(error) {
        return false
    }
}

// função para deletar um registro no DB
const deleteAluno = async function(id) {

    try {
        // Import da classe 'PrismaClient', que é responsável pelas interações com o DB
        const { PrismaClient } = require('@prisma/client')

        // Instância da classe 'PrismaClient' ('prisma': objeto)
        const prisma = new PrismaClient()

        let sql = `delete from tbl_aluno where id = ${id};`

        // Executa o script sql no banco de dados
            // 'executeRawUnsafe()': permite executar uma variável contendo o script
            //   retono:
            // - true: execução do scrpit teve sucesso
            // - false: execução do scrpit não teve sucesso
        const result = await prisma.$executeRawUnsafe(sql)

        // Verifica se o script foi executado com sucesso no BD
        if (result) 
            return true

        else
            return false
        
    }

    catch(error) {
        return false
    }

}

// função para retornar apenas o registro baseado no ID
const selectByIDAluno = async function(id) {

    // Import da classe 'PrismaClient', que é responsável pelas interações com o DB
    const { PrismaClient } = require('@prisma/client')

    // Instância da classe 'PrismaClient' ('prisma': objeto)
    const prisma = new PrismaClient()

    let sql =  `select cast(id as float) as id, 
                       nome, 
                       foto, 
                       sexo, 
                       rg, 
                       cpf, 
                       email, 
                       telefone, 
                       celular, 
                       data_nascimento 
                from tbl_aluno 
                where id = ${id}`

    // Criação de objeto do tipo 'RecordSet' (rsAlunos), para receber os dados do DB, através do script SQL (select)
    const rsAluno = await prisma.$queryRawUnsafe(sql)

    if (rsAluno.length > 0)
        return rsAluno

    else
        return false
}

// função para retornar o último ID gerado na tabela de aluno
const selectLastIDAluno = async function() {
    // Import da classe 'PrismaClient', que é responsável pelas interações com o DB
    const { PrismaClient } = require('@prisma/client')

    // Instância da classe 'PrismaClient' ('prisma': objeto)
    const prisma = new PrismaClient()

    // script para buscar o último ID gerado na tabela de aluno
    let sql = `select cast(id as float) as id 
                    from tbl_aluno 
                    order by id desc 
                    limit 1;`
    
    const rsAluno = await prisma.$queryRawUnsafe(sql)

    if (rsAluno)
        return rsAluno[0].id

    else
        return false
}

module.exports = {
    selectAllAlunos,
    insertAluno,
    updateAluno,
    deleteAluno,
    selectByIDAluno,
    selectLastIDAluno
}