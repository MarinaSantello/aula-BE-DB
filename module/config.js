/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *

 * Objetivo:     Arquivo responsável pela configuração de variáveis, constantes e mensagens do sistema
 * Autora:       Marina Santello
 * Data criação: 13/10/2022
 * Versão:       1.2

* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

const MESSAGE_ERROR = {
    REQUIRED_FIELDS   : 'Existe(m) campo(s) obrigatório(s) que deve(m) ser enviado(s).',
    INVALID_EMAIL     : 'O e-mail informado não é válido.',
    CONTENT_TYPE      : "O cabeçalho da requisição não possui 'Content-Type' válido.",
    EMPTY_BODY        : 'O body da requisição deve haver conteúdo.',
    NOT_FOUND_DB      : 'Não foram encontrados registros no banco de dados.',
    INTERNAL_ERROR_DB : 'Não foi possível realizar a operação com o banco de dados.',
    REQUIRED_ID       : 'O ID do registro é obrigatório neste tipo de requisição',
    TYPE_VAR          : 'Existe(m) campo(s), cujo o(s) tipo(s) de dado(s) não é(são) válido(s).',
    LIMIT_EXCEEDED    : 'Existe(m) campo(s), cujo tamanho excede o limite.',
    NOT_COURSE        : 'Esse aluno não possui um curso em seu registro.'
}

const MESSAGE_SUCESS = {
    INSERT_ITEM     : 'Item criado com sucesso no banco de dados.',
    UPDATE_ITEM     : 'Item atualizado com sucesso no banco de dados.',
    DELETE_ITEM     : 'Item excluído com sucesso no banco de dados.',
}

module.exports = {
    MESSAGE_ERROR,
    MESSAGE_SUCESS
}