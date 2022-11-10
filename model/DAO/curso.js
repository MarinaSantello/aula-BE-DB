/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *

 * Objetivo:     Arquivo responsável pela manipulação de dados, com o DB (insert, select, update e delete - CRUD)
 * Autora:       Marina Santello
 * Data criação: 27/10/2022
 * Versão:       1.0

* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

const insertCurso = async function(curso) {
    try {
        // Variável que armazena o json de cursos
        let cursoJSON = await curso

        // Import da classe 'PrismaClient', que é responsável pelas interações com o DB
        const { PrismaClient } = require('@prisma/client')

        // Instância da classe 'PrismaClient' ('prisma': objeto)
        const prisma = new PrismaClient()

        let sql = `insert into tbl_curso (nome, 
                                         icone, 
                                         carga_horaria, 
                                         sigla)
                                        
                                        values (
                                            '${cursoJSON.nome}',
                                            '${cursoJSON.icone}',
                                            '${cursoJSON.carga_horaria}',
                                            '${cursoJSON.sigla}'
                                        )`

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
    
    catch (error) {
        return false
    }
}

const selectAllCursos = async function() {
    try {
        // Import da classe 'PrismaClient', que é responsável pelas interações com o DB
        const { PrismaClient } = require('@prisma/client')

        // Instância da classe 'PrismaClient' ('prisma': objeto)
        const prisma = new PrismaClient()

        // 'query': retorna dados
        let rsCursos = await prisma.$queryRaw `select cast(id as float) as id, nome, icone, carga_horaria, sigla from tbl_curso order by id desc`

        // Verifica se o script foi executado com sucesso no BD
        if (rsCursos.length > 0) 
            return rsCursos

        else
            return false        
    } 
    
    catch (error) {
        return false
    }

}

const selectByIDCurso = async function(id) {
    try {
        // Variável que armazena o id do curso a ser encontrado
        let cursoID = await id

        // Import da classe 'PrismaClient', que é responsável pelas interações com o DB
        const { PrismaClient } = require('@prisma/client')

        // Instância da classe 'PrismaClient' ('prisma': objeto)
        const prisma = new PrismaClient()

        let sql = `select cast(id as float) as id, 
                            nome, 
                            icone,
                            carga_horaria,
                            sigla
                    from tbl_curso

                    where id = ${cursoID}`

        // Criação de objeto do tipo 'RecordSet' (rsCurso), para receber os dados do DB, através do script SQL (select) - 'queryRawUnsafe': permite executar uma variável contendo o script
        const rsCurso = await prisma.$queryRawUnsafe(sql)

        // Verifica se o script foi executado com sucesso no BD
        if (rsCurso.length > 0) 
            return rsCurso

        else
            return false

    } 
    
    catch (error) {
        return false
    }
}

const updateCurso = async function(curso) {
    try {
        // Variável que armazena o json de cursos
        let cursoJSON = await curso

        // Import da classe 'PrismaClient', que é responsável pelas interações com o DB
        const { PrismaClient } = require('@prisma/client')

        // Instância da classe 'PrismaClient' ('prisma': objeto)
        const prisma = new PrismaClient()

        let sql = `update tbl_curso set nome          = '${cursoJSON.nome}',
                                        icone         = '${cursoJSON.icone}',
                                        carga_horaria = '${cursoJSON.carga_horaria}',
                                        sigla         = '${cursoJSON.sigla}'
                                        
                                    where id = ${cursoJSON.id}`

        // Executa o script sql no banco de dados
            // 'executeRawUnsafe()': permite executar uma variável contendo o script
            //   retono:
            // - true: execução do scrpit teve sucesso
            // - false: execução do scrpit não teve sucesso

            // 'execute': não retorna nada
        const result = await prisma.$executeRawUnsafe(sql)

        // Verifica se o script foi executado com sucesso no BD
        if (result) 
            return true

        else
            return false        
    } 
    
    catch (error) {
        return false
    }
}

const deleteCurso = async function(id) {
    try {
        // Variável que armazena o id do curso a ser encontrado
        let cursoID = await id

        // Import da classe 'PrismaClient', que é responsável pelas interações com o DB
        const { PrismaClient } = require('@prisma/client')

        // Instância da classe 'PrismaClient' ('prisma': objeto)
        const prisma = new PrismaClient()

        let sql = `delete from tbl_curso where id = ${cursoID}`

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
    
    catch (error) {
        return false
    }
}

module.exports = {
    insertCurso,
    selectAllCursos,
    selectByIDCurso,
    updateCurso,
    deleteCurso
}