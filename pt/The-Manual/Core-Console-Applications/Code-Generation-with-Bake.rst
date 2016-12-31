Geração de código com o Bake
############################

Você já aprendeu sobre *scaffolding* no CakePHP: uma maneira simples de
pegar e executar com apenas um banco de dados e algumas poucas classes.
O console do Bake no CakePHP é outra tentativa para que você pegue e
execute no CakePHP – rapidamente. O console do Bake pode criar qualquer
um dos ingredientes básicos do CakePHP: *models*, *views* e
*controllers*. E não estamos falando apenas de classes *skeleton*: O
Bake pode criar uma aplicação completa e funcional em poucos minutos. De
fato, o Bake é um passo natural a seguir uma vez que foi feito o
*scaffold* da aplicação.

Aqueles que são novos no Bake (especialmente usuários de Windows) podem
achar o `Bake screencast <https://cakephp.org/screencasts/view/6>`_ útil
para esclarecer as coisas antes de continuar.

Dependendo da configuração da sua instalação, você terá que setar os
direitos de execução no script bash do cake ou chamá-lo utilizando
./cake bake. O console do cake é executado utilizando o CLI (*command
line interface*) do PHP. Caso você tenha problemas executando o script,
certifique-se de ter o CLI do PHP instalado e que ele tenha os módulos
apropriados habilitados (Ex: MySQL).

Quando executar o Bake pela primeira vez, você será solicitado a criar o
arquivo de configuração do banco de dados, caso você já não o tenha
criado.

Depois de criar o arquivo de configuração do banco de dados, ao executar
o Bake serão apresentadas a você as seguintes opções:

::

    ---------------------------------------------------------------
    App : app
    Path: /path-to/project/app
    ---------------------------------------------------------------
    Interactive Bake Shell
    ---------------------------------------------------------------
    [D]atabase Configuration
    [M]odel
    [V]iew
    [C]ontroller
    [P]roject
    [Q]uit
    What would you like to Bake? (D/M/V/C/P/Q) 
    >  

Alternativamente, você pode executar qualquer um destes comandos
diretamente da linha de comando:

::

    $ cake bake db_config
    $ cake bake model
    $ cake bake view 
    $ cake bake controller
    $ cake bake project
    $ cake bake test

