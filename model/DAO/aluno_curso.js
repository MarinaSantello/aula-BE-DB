/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *

 * Objetivo:     Arquivo responsável pela manipulação de dados, com o DB (insert, select, update e delete - CRUD)
 * Autora:       Marina Santello
 * Data criação: 31/10/2022
 * Versão:       1.0

* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

// função para inserir um novo registro no DB
const insertAlunoCurso = async function(alunoCurso) {

    try {
        // Import da classe 'PrismaClient', que é responsável pelas interações com o DB
        const { PrismaClient } = require('@prisma/client')

        // Instância da classe 'PrismaClient' ('prisma': objeto)
        const prisma = new PrismaClient()

        let sql = `insert into tbl_aluno_curso (id_aluno,
                                                id_curso,
                                                matricula,
                                                status_aluno)
                                        values ('${alunoCurso.id_aluno}',
                                                '${alunoCurso.id_curso}',
                                                '${alunoCurso.matricula}',
                                                '${alunoCurso.status_aluno}');`

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
        console.log('teste')
        return false
    }
}

// função para buscar os dados de um curso referente a um aluno
const selectAlunoCurso = async function(idAluno) {

    try {
        // Import da classe 'PrismaClient', que é responsável pelas interações com o DB
        const { PrismaClient } = require('@prisma/client')

        // Instância da classe 'PrismaClient' ('prisma': objeto)
        const prisma = new PrismaClient()

        let sql = `select cast(tbl_curso.id as float) as id_curso, tbl_curso.nome as nome_curso, tbl_curso.sigla as sigla_curso, tbl_curso.carga_horaria,
                          tbl_aluno_curso.matricula, tbl_aluno_curso.status_aluno
                    from tbl_aluno_curso
                
                    inner join tbl_aluno
                            on tbl_aluno.id = tbl_aluno_curso.id_aluno
                
                    inner join tbl_curso
                            on tbl_curso.id = tbl_aluno_curso.id_curso
                
                    where tbl_aluno.id = ${idAluno}`

        const rsAlunCurso = await prisma.$queryRawUnsafe(sql)

        if(rsAlunCurso.length > 0) 
            return rsAlunCurso
        
        else
            return falses
    }

    catch(error){
        return false
    }

}

module.exports = {
    insertAlunoCurso,
    selectAlunoCurso
}