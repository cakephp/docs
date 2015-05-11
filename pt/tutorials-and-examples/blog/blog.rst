Conteúdos da página

•	Criando um blog 
•	Instalação do CakePHP
•	Permissões dos diretórios tmp e logs
•	Criando o Banco de Dados do blog
•	Configuração do Banco de Dados
•	Configuração opcional
•	Observação sobre o mod_rewrite

Criando um Blog

Este tutorial levará você até a criação de um simples blog. Faremos a instalação do CakePHP, criaremos um banco de dados, e implementaremos toda a lógica para listar, adicionar, editar, e deletar postagens do blog.
Aqui está o que você vai precisar para isto:
1.	Um servidor web em funcionamento.  Nós iremos assumir que você esteja usando o Apache, embora as instruções para outros servidores sejam bem similares. Talvez seja preciso alterarmos algumas configurações do servidor, mas a maioria das pessoas serão capazes de ter o CakePHP funcionando sem precisar alterar nada. Tenha certeza que você possui o PHP 5.4.16 ou mais recente, e que as extensões mbstring and intl estão habilitadas no PHP. Caso não saiba a versão do PHP que está utilizando, utilize a função phpinfo().
2.	Um servidor de banco de dados. Iremos usar o MySQL para este tutorial. Você precisará conhecer o mínimo sobre SQL para criar um banco de dados: O CakePHP pegará as rédeas a partir deste ponto. Já que usaremos MySQL, confira também se a extensão pdo_mysql está habilidade no PHP.
3.	Conhecimentos básicos de PHP.
Vamos começar!

Instalação do CakePHP

A forma mais fácil de se instalar o CakePHP é utilizando Composer. Composer é uma maneira simples de instalar o CakePHP a partir de seu terminal ou utilizando linhas de comando no prompt. Primeiro, você precisa baixar e instalar o Composer caso você ainda não o tenha instalado. Se você possui o cURL instalado, basta o executar o seguinte:

curl -s https://getcomposer.org/installer | php

Você também pode baixar o composer.phar a partir do website do Composer.
Então simplesmente execute a seguinte linha em seu terminal a partir do diretório em que deseja baixar o CakePHP para instalá-lo junto ao seu template básico de aplicação na pasta [nome_do_app]:

php composer.phar create-project --prefer-dist cakephp/app [app_name]

A vantagem em se utilizar o Composer é que este fará automaticamente algumas configurações importantes, como por exemplo, configurar corretamente as permissões de pasta e criar seu config/app.php para você.
Há outras maneiras de se instalar o CakePHP. Se você não pode ou não quer usar o Composer, confira a seção de Instalação. 
Independente de como você baixou e instalou o CakePHP, uma vez que a instalação esteja completa, a estrutura de seu diretório deve se parecer com a seguinte:

/cake_install
    /bin
    /config
    /logs
    /plugins
    /src
    /tests
    /tmp
    /vendor
    /webroot
    .editorconfig
    .gitignore
    .htaccess
    .travis.yml
    composer.json
    index.php
    phpunit.xml.dist
    README.md

Agora pode ser uma boa hora para aprender um mais sobre como funciona a estrutura de diretórios do  CakePHP: confira a seção Estrutura de diretórios do CakePHP.

Permissões do diretórios tmp e logs

Os diretórios tmp e logs devem possuir permissões adequadas de escrita para que possam ser alterados por seu servidor web. Se você usou o Composer para fazer a instalação, isto já deve ter sido feito para você e confirmado com uma mensagem “Permissions set on <folder>”. Se você ainda recebe uma mensagem de erro ou quer fazer isto manualmente, a melhor maneira para fazê-lo é encontrar qual o usuário está sendo utilizado por seu servidor web (<?= ‘whoami’; ?>) e alterar o proprietário destes dois diretórios para este usuário. Os últimos comandos que você executará (in *nix) devem ser algo como estes:

chown -R www-data tmp

chown -R www-data logs

Se por alguma razão o CakePHP não possuir permissão para escrita nestes dois diretórios, você será informado por um aviso enquanto não estiver em modo produção.
Embora não recomenado, se você não puder alterar as permissões de seu servidor web, você pode simplesmente alterar as permissões de escritas nos diretórios, executando os seguintes comandos:

chmod 777 -R tmp

chmod 777 -R logs

Criando o Banco de Dados do Blog

Em seguida, vamos configurar o banco de dados MySQL para nosso blog. Se você ainda não tiver feito isto, crie um banco de dados vazio para usar neste tutorial, com um nome de sua escolha, por exemplo cake_blog. Agora, vamos uma tabela para armazenar nossos artigos. Nós vamos também  inserir alguns artigos para usarmos em nossos testes. Execute os seguintes comandos SQL em seu banco de dados:

/*Primeiro, criaremos nossa tabela de artigos: */
CREATE TABLE artigos (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    titulo VARCHAR(50),
    conteudo TEXT,
    criado_em DATETIME DEFAULT NULL,
    modificado_em DATETIME DEFAULT NULL
);

/* Então inserimos alguns artigos para testes: */
INSERT INTO artigos (titulo, conteudo, criado_em)
    VALUES ('O título’, 'Este é o corpo do artigo.', NOW());
INSERT INTO artigos (titulo, conteudo, criado_em)
    VALUES (‘O título novamente', 'E segue o corpo do artigo.', NOW());
INSERT INTO artigos (titulo, conteudo, criado_em)
    VALUES (‘O título voltou', 'Isto é realmente animador! Não.', NOW());

A escolha dos nomes para tabelas e colunas não foi arbitrária. Usando convenções de nomenclatura do CakePHP, você pode aproveitar de diversas funcionalidades e evitar ter de configurar o framework. O CakePHP é flexível o suficiente para acomodar até mesmo esquemas de banco de dados legados inconsistentes, mas aderir às convenções vai lhe poupar tempo.
Confira Convenções do CakePHP  para mais informações, mas é suficiente dizer que o nome de nossa tabela ‘artigos’ automaticamente se engaja em nosso modelo Artigos, e os campos chamados ‘modificado_em’ e ‘criado_em’ serão automaticamente gerenciados pelo CakePHP.
Configuração do Banco de Dados
Em seguindo, vamos dizer ao CakePHP onde está nosso banco de dados e como se conectar a ele. Para muitos, esta será a primeira e a última vez que será necessário configurar algo.
A configuração é muito objetiva: apenas substitua os valores no array Datasources.default localizado no arquivo config/app.php com os valores que se aplicam à sua configuração. Um exemplo de configuração completa deve se parecer com o seguinte:

return [
    // Mais configurações acima.
    'Datasources' => [
        'default' => [
            'className' => 'Cake\Database\Connection',
            'driver' => 'Cake\Database\Driver\Mysql',
            'persistent' => false,
            'host' => 'host',
            'username' => 'usuario',
            'password' => 'senha',
            'database' => 'nome_do_banco’,
            'encoding' => 'utf8',
            'timezone' => 'UTC'
        ],
    ],
    // Mais configurações abaixo
];

Uma vez que tenha salvo seu arquivo config/app.php, você deve ser capaz de abrir seu navegador e ver a página de Bem-vindo do CakePHP. Ela também deve lhe dizer que sua configuração com o banco de dados foi encontrada e que o CakePHP conseguiu conectar-se com sucesso ao banco de dados.
Nota
Uma cópia do arquivo de configuração padrão do CakePHP  pode ser encontrada em config/app.default.php.

Configuração Opcional

Há alguns outros itens que podem ser configurados. Muitos desenvolvedores completam esta lista de itens, mas estes não são obrigatórios para este tutorial. Um deles é definir uma sequência personalizada (ou “salt”) para uso em hashes de segurança.
A sequência personalizada (ou salt) é utilizada para gerar hashes de segurança. Se você utilizou o Composer, ele cuidou disso para você durante a instalação. Apesar disso, você precisa alterar a sequência personalizada padrão editando o arquivo config/app.php. Não importa qual será o novo valor, somente deverá ser algo difícil de descobrir.

'Security' => [
    'salt' => 'algum valor longo contendo uma mistura aleatória de valores.',
],

Observação sobre o mod_rewrite

Ocasionalmente, novos usuários irão se atrapalhar com problemas de mod_rewrite. Por exemplo, se a página de Bem-vindo do CakePHP parecer-se estranha (sem imagens ou estilos CSS). Isto provavelmente significa que o mod_rewrite não está funcionando em seu servidor. Por favor, verifique a seção Reescrita de URL  como ajuda para resolver quaisquer problemas que você esteja enfrentando sobre isto.
Agora continue para Criando um Blog - Parte 2 para iniciar a construção de sua primeira aplicação com o CakePHP.
