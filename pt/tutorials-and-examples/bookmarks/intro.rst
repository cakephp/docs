Tutorial - Criando um Bookmarker - Parte 1
##########################################

Esse tutorial vai guiar você através da criação de uma simples aplicação de
marcação (bookmarker). Para começar, nós vamos instalar o CakePHP, criar
nosso banco de dados, e usar as ferramentas que o CakePHP fornece para obter
nossa aplicação de pé rápido.

Aqui está o que você vai precisar:

#. Um servidor de banco de dados. Nós vamos usar o servidor MySQL neste
   tutorial. Você precisa saber o suficiente sobre SQL para criar um banco de
   dados: O CakePHP vai tomar as rédeas a partir daí. Por nós estarmos
   usando o MySQL, também certifique-se que você tem a extensão ``pdo_mysql``
   habilitada no PHP.

#. Conhecimento básico sobre PHP.

Vamos começar!

Instalação do CakePHP
=====================

A maneira mais fácil de instalar o CakePHP é usando Composer, um gerenciador
de dependências para o PHP. É uma forma simples de instalar o CakePHP a
partir de seu terminal ou prompt de comando. Primeiro, você precisa baixar e
instalar o Composer. Se você tiver instalada a extensão cURL do PHP, execute
o seguinte comando::

    curl -s https://getcomposer.org/installer | php

Ao invés disso, você também pode baixar o arquivo ``composer.phar`` do
`site <https://getcomposer.org/download/>`_ oficial.

Em seguida, basta digitar a seguinte linha no seu terminal a partir do diretório
onde se localiza o arquivo ``composer.phar`` para instalar o esqueleto de
aplicações do CakePHP no diretório ``bookmarker``. ::

    php composer.phar create-project --prefer-dist cakephp/app bookmarker

A vantagem de usar Composer é que ele irá completar automaticamente um conjunto
importante de tarefas, como configurar as permissões de arquivo e criar a sua
**config/app.php**.

Há outras maneiras de instalar o CakePHP. Se você não puder ou não quiser usar
Composer, veja a seção :doc:`/installation`.

Independentemente de como você baixou o CakePHP, uma vez que sua instalação
for concluída, a estrutura dos diretórios deve ficar parecida com o seguinte::

    /bookmarker
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

Agora pode ser um bom momento para aprender sobre como a estrutura de diretórios
do CakePHP funciona: Confira a seção :doc:`/intro/cakephp-folder-structure`.

Verificando nossa instalação
============================

Podemos checar rapidamente que a nossa instalação está correta, verificando a
página inicial padrão. Antes que você possa fazer isso, você vai precisar
iniciar o servidor de desenvolvimento::

    bin/cake server

Isto irá iniciar o servidor embutido do PHP na porta 8765. Abra
``http://localhost:8765`` em seu navegador para ver a página de boas-vindas.
Todas as verificações devem estar checadas corretamente, a não ser a conexão com
banco de dados do CakePHP. Se não, você pode precisar instalar extensões do PHP
adicionais, ou definir permissões de diretório.

Criando o banco de dados
========================

Em seguida, vamos criar o banco de dados para a nossa aplicação. Se você
ainda não tiver feito isso, crie um banco de dados vazio para uso
nesse tutorial, com um nome de sua escolha, por exemplo, ``cake_bookmarks``.
Você pode executar o seguinte SQL para criar as tabelas necessárias::

    CREATE TABLE users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        email VARCHAR(255) NOT NULL,
        password VARCHAR(255) NOT NULL,
        created DATETIME,
        modified DATETIME
    );

    CREATE TABLE bookmarks (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        title VARCHAR(50),
        description TEXT,
        url TEXT,
        created DATETIME,
        modified DATETIME,
        FOREIGN KEY user_key (user_id) REFERENCES users(id)
    );

    CREATE TABLE tags (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255),
        created DATETIME,
        modified DATETIME,
        UNIQUE KEY (title)
    );

    CREATE TABLE bookmarks_tags (
        bookmark_id INT NOT NULL,
        tag_id INT NOT NULL,
        PRIMARY KEY (bookmark_id, tag_id),
        INDEX tag_idx (tag_id, bookmark_id),
        FOREIGN KEY tag_key(tag_id) REFERENCES tags(id),
        FOREIGN KEY bookmark_key(bookmark_id) REFERENCES bookmarks(id)
    );

Você deve ter notado que a tabela ``bookmarks_tags`` utilizada uma chave
primária composta. O CakePHP suporta chaves primárias compostas quase todos os
lugares, tornando mais fácil construir aplicações multi-arrendados.

Os nomes de tabelas e colunas que usamos não foram arbitrárias. Usando
:doc:`convenções de nomenclatura </intro/conventions>` do CakePHP, podemos
alavancar o desenvolvimento e evitar ter de configurar o framework. O CakePHP
é flexível o suficiente para acomodar até mesmo esquemas de banco de dados
legados inconsistentes, mas aderir às convenções vai lhe poupar tempo.

Configurando o banco de dados
=============================

Em seguida, vamos dizer ao CakePHP onde o nosso banco de dados está como se
conectar a ele. Para muitos, esta será a primeira e última vez que você vai
precisar configurar qualquer coisa.

A configuração é bem simples: basta alterar os valores do array
``Datasources.default`` no arquivo **config/app.php** pelos que se
aplicam à sua configuração. A amostra completa da gama de configurações pode
ser algo como o seguinte::

    return [
        // Mais configuração acima.
        'Datasources' => [
            'default' => [
                'className' => 'Cake\Database\Connection',
                'driver' => 'Cake\Database\Driver\Mysql',
                'persistent' => false,
                'host' => 'localhost',
                'username' => 'cakephp',
                'password' => 'AngelF00dC4k3~',
                'database' => 'cake_bookmarks',
                'encoding' => 'utf8',
                'timezone' => 'UTC',
                'cacheMetadata' => true,
            ],
        ],
        // Mais configuração abaixo.
    ];

Depois de salvar o seu arquivo **config/app.php**, você deve notar que a
mensagem 'CakePHP is able to connect to the database' tem uma marca de
verificação.

.. note::

    Uma cópia do arquivo de configuração padrão do CakePHP é encontrado em
    **config/app.default.php**.

Gerando o código base
=====================

Devido a nosso banco de dados seguir as convenções do CakePHP, podemos usar o
:doc:`bake console </bake/usage>` para gerar rapidamente uma aplicação básica
. Em sua linha de comando execute::

    bin/cake bake all users
    bin/cake bake all bookmarks
    bin/cake bake all tags

Isso irá gerar os controllers, models, views, seus casos de teste
correspondentes, e fixtures para os nossos users, bookmarks e tags. Se você
parou seu servidor, reinicie-o e vá para ``http://localhost:8765/bookmarks``.

Você deverá ver uma aplicação que dá acesso básico, mas funcional a tabelas
de banco de dados. Adicione alguns users, bookmarks e tags.

Adicionando criptografia de senha
=================================

Quando você criou seus users, você deve ter notado que as senhas foram
armazenadas como texto simples. Isso é muito ruim do ponto de vista da
segurança, por isso vamos consertar isso.

Este também é um bom momento para falar sobre a camada de modelo. No CakePHP,
separamos os métodos que operam em uma coleção de objetos, e um único objeto
em diferentes classes. Métodos que operam na recolha de entidades são
colocadas na classe *Table*, enquanto as características pertencentes a um
único registro são colocados na classe *Entity*.

Por exemplo, a criptografia de senha é feita no registro individual, por
isso vamos implementar esse comportamento no objeto entidade. Dada a
circunstância de nós querermos criptografar a senha cada vez que é
definida, vamos usar um método modificador/definidor. O CakePHP vai chamar
métodos de definição baseados em convenções a qualquer momento que uma
propriedade é definida em uma de suas entidades. Vamos adicionar um definidor
para a senha. Em **src/Model/Entity/User.php** adicione o seguinte::

    namespace App\Model\Entity;

    use Cake\ORM\Entity;
    use Cake\Auth\DefaultPasswordHasher;

    class User extends Entity
    {

        // Code from bake.

        protected function _setPassword($value)
        {
            $hasher = new DefaultPasswordHasher();
            return $hasher->hash($value);
        }
    }

Agora atualize um dos usuários que você criou anteriormente, se você alterar
sua senha, você deve ver um senha criptografada ao invés do valor original nas
páginas de lista ou visualização. O CakePHP criptografa senhas com
`bcrypt <http://codahale.com/how-to-safely-store-a-password/>`_ por padrão.
Você também pode usar sha1 ou md5 caso venha a trabalhar com um
banco de dados existente.

Recuperando bookmarks com uma tag específica
============================================

Agora que estamos armazenando senhas com segurança, podemos construir algumas
características mais interessantes em nossa aplicação. Uma vez que você
acumulou uma coleção de bookmarks, é útil ser capaz de pesquisar através
deles por tag. Em seguida, vamos implementar uma rota, a ação do controller, e
um método localizador para pesquisar através de bookmarks por tag.

Idealmente, nós teríamos uma URL que se parece com
``http://localhost:8765/bookmarks/tagged/funny/cat/gifs``. Isso deveria nos
permitir a encontrar todos os bookmarks que têm as tags 'funny', 'cat' e
'gifs'. Antes de podermos implementar isso, vamos adicionar uma nova rota. Em
**config/routes.php**, adicione o seguinte na parte superior do arquivo::

    Router::scope(
        '/bookmarks',
        ['controller' => 'Bookmarks'],
        function ($routes) {
            $routes->connect('/tagged/*', ['action' => 'tags']);
        }
    );

O acima define uma nova "rota" que liga o caminho ``/bookmarks/tagged/*``, a
``BookmarksController::tags()``. Ao definir rotas, você pode isolar como
suas URLs parecerão, de como eles são implementadas. Se fôssemos visitar
``http://localhost:8765/bookmarks/tagged``, deveriamos ver uma página de erro
informativa do CakePHP. Vamos implementar esse método ausente agora. Em
**src/Controller/BookmarksController.php** adicione o seguinte::

    public function tags()
    {
        $tags = $this->request->getParam('pass');
        $bookmarks = $this->Bookmarks->find('tagged', [
            'tags' => $tags
        ]);
        $this->set(compact('bookmarks', 'tags'));
    }

Criando o método localizador
============================

No CakePHP nós gostamos de manter as nossas ações do controller enxutas, e
colocar a maior parte da lógica de nossa aplicação nos modelos. Se você fosse
visitar a URL ``/bookmarks/tagged`` agora, você veria um erro sobre o
método ``findTagged`` não estar implementado ainda, então vamos fazer isso. Em
**src/Model/Table/BookmarksTable.php** adicione o seguinte::

    public function findTagged(Query $query, array $options)
    {
        $bookmarks = $this->find()
            ->select(['id', 'url', 'title', 'description']);

        if (empty($options['tags'])) {
            $bookmarks->leftJoinWith('Tags', function ($q) {
                return $q->where(['Tags.title IS ' => null]);
            });
        } else {
            $bookmarks->innerJoinWith('Tags', function ($q) use ($options) {
                return $q->where(['Tags.title IN' => $options['tags']]);
            });
        }

        return $bookmarks->group(['Bookmarks.id']);
    }

Nós implementamos um método
:ref:`localizador customizado <custom-find-methods>`. Este é um conceito
muito poderoso no CakePHP que lhe permite construir consultas reutilizáveis.
Em nossa pesquisa, nós alavancamos o método ``matching()`` que nos habilita
encontrar bookmarks que têm uma tag 'correspondente'.

Criando a view
==============

Agora, se você visitar a URL ``/bookmarks/tagged``, o CakePHP irá mostrar um
erro e deixá-lo saber que você ainda não fez um arquivo view. Em seguida,
vamos construir o arquivo view para a nossa ação ``tags``. Em
**src/Template/Bookmarks/tags.ctp** coloque o seguinte conteúdo::

    <h1>
        Bookmarks tagged with
        <?= $this->Text->toList(h($tags)) ?>
    </h1>

    <section>
    <?php foreach ($bookmarks as $bookmark): ?>
        <article>
            <h4><?= $this->Html->link($bookmark->title, $bookmark->url) ?></h4>
            <small><?= h($bookmark->url) ?></small>
            <?= $this->Text->autoParagraph(h($bookmark->description)) ?>
        </article>
    <?php endforeach; ?>
    </section>

O CakePHP espera que os nossos templates sigam a convenção de nomenclatura onde
o nome do template é a versão minúscula e grifada do nome da ação do
controller.

Você pode perceber que fomos capazes de utilizar as variáveis ``$tags`` e
``bookmarks`` em nossa view. Quando usamos o método ``set()`` em nosso
controller, automaticamente definimos variáveis específicas que devem ser
enviadas para a view. A view vai tornar todas as variáveis passadas
disponíveis nos templates como variáveis locais.

Em nossa view, usamos alguns dos :doc:`helpers </views/helpers>` nativos do
CakePHP. Helpers são usados para criar lógica re-utilizável para a
formatação de dados, a criação de HTML ou outra saída da view.

Agora você deve ser capaz de visitar a URL ``/bookmarks/tagged/funny`` e ver
todas os bookmarks com a tag 'funny'.

Até agora, nós criamos uma aplicação básica para gerenciar bookmarks, tags e
users. No entanto, todos podem ver as tags de toda a gente. No próximo
capítulo, vamos implementar a autenticação e restringir os bookmarks visíveis
para somente aqueles que pertencem ao usuário atual.

Agora vá a :doc:`/tutorials-and-examples/bookmarks/part-two` para continuar a
construir sua aplicação ou :doc:`mergulhe na documentação </topics>` para
saber mais sobre o que CakePHP pode fazer por você.
