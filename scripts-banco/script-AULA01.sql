-- permite vizualizar todos os databases do banco de dados
show databases;

-- 'create': permite criar um banco de dados
#create database dbcontatos2022_2;

-- 'drop': permite excluir um banco de dados e toda a sua estrutura de tabelas e dados
#drop database dbcontatos2022_2;

create database db_lionschool;

-- 'use': permite ativar a utilização do banco de dados escolhido, para, assim, manipular este com os scripts seguintes
use db_lionschool;

-- permite vizualizar todas as tabelas existentes dentro do banco de dados:
show tables;

desc tbl_curso;

create table tbl_aluno (
	id int unsigned not null auto_increment primary key,
    nome varchar(80) not null,
    foto varchar(100) not null,
    sexo varchar(1),
    rg varchar(15) not null,
    cpf varchar(18) not null,
    email varchar(256) not null,
    telefone varchar(18),
    celular varchar(18),
    data_nascimento date not null,
    
    unique index(id)
);

create table tbl_curso (
	id int unsigned not null auto_increment primary key,
    nome varchar(50) not null,
    icone varchar(100),
    carga_horaria int not null,
    sigla varchar(5),
    
    unique index(id)
);

create table tbl_aluno_curso (
	id int unsigned not null auto_increment primary key,
    id_aluno int unsigned not null,
    id_curso int unsigned not null,
    matricula varchar(15) not null,
    status_aluno varchar(1) not null,
    
    -- programação para definir as chaves estrangeiras:
    foreign key(id_aluno)  # define qual será uma FK
		references tbl_aluno(id),  # define de onde virá a PK 
        
	foreign key(id_curso)
		references tbl_curso(id),
        
	unique index(id)    
);

-- comandos de manipulação de dados (CRUD):
	# (Create) insert into [nome da tabela]([atributos]): preencher os campos da tabela com os dados (create)
		# atributo não inteiro: obrigatório uso de aspas simples('')
        
	# (Read) select * from [nome da tabela]: permite vizualizar todos os dados de todas as colunas de uma tabela (read)
    
	# (Update) 'update [nome da tabela] set [atributo que será alterado] = [novo valor a ser atribuido nesse campo] where id = [id do registro que será alterado]*': permite alterar valor de um atributo da tabela
		# *: sempre especificar qual registro irá sofrer alteração (geralmente será a PK)
        
	# (Delete) 'delete from [nome da tabela]': exclui a tabela e todos os dados dela
		# 'delete from [nome da tabela] where id = [id do registro que será ecluído]*': exlui todos os dados do registro indicado, conforme a tabela
			# *: sempre especificar qual registro irá sofrer
	

select * from tbl_aluno;

insert into tbl_aluno(nome, 
					  foto,
                      sexo,
                      rg,
                      cpf,
                      email,
                      telefone,
                      celular,
                      data_nascimento)
	values			 ('Regminton',
					  'https://i.pinimg.com/originals/33/b8/c3/33b8c300e70bb9d3e119dbbd97a02908.jpg', 
                      'M',
                      '41.182-281.1',
                      '987.654.321-10',
                      'lindao@email.com',
                      '011 1234-8922',
                      '011 9 5678-5678',
                      '2004-10-12');

insert into tbl_aluno(nome, 
					  foto,
                      sexo,
                      rg,
                      cpf,
                      email,
                      telefone,
                      celular,
                      data_nascimento)
	values			 ('Dolores',
					  'https://i.pinimg.com/originals/33/b8/c3/33b8c300e70bb9d3e119dbbd97a02908.jpg', 
                      'F',
                      '41.182-281.8',
                      '987.654.321-41',
                      'lindao@email.com',
                      '011 6999-8922',
                      '011 9 5678-6669',
                      '2004-07-27');
                      

insert into tbl_aluno(nome, 
					  foto,
                      sexo,
                      rg,
                      cpf,
                      email,
                      telefone,
                      celular,
                      data_nascimento)
	values			 ('Andy',
					  'https://i.pinimg.com/originals/33/b8/c3/33b8c300e70bb9d3e119dbbd97a02908.jpg', 
                      'M',
                      '41.182-281.1',
                      '987.654.321-10',
                      'homao@email.com',
                      '011 1234-8922',
                      '011 9 5678-5678',
                      '2004-06-12');


update tbl_aluno set email = 'mulherao@email.com' where id = 2;

delete from tbl_aluno where id = 1;

select id from tbl_aluno order by id desc limit 1;