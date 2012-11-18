Sessions
########

O componente Session do CakePHP oferece uma maneira de persistir dados
do cliente entre requisições de páginas. Este componente funciona como
um encapsulador para a variável $\_SESSION além de oferecer métodos de
conveniência para diversas funções relacionadas ao $\_SESSION.

Sessões podem ser persistidas de diferentes maneiras. O padrão é usar as
configurações definidas pelo PHP; no entanto existem outras opções.

cake
    Salva os arquivos de sessão do diretório tmp/sessions de sua
    aplicação.
database
    Utiliza sessões da base de dados do CakePHP.
cache
    Utiliza o mecanismo de cache configurado em Cache::config(). Muito
    útil para ser usado em conjunto com o Memcache (em ambientes
    servindo múltiplas aplicações) para armazenar tanto dados em cache
    quanto dados de sessões.
php
    A configuração padrão. Salva os arquivos de sessão conforme definido
    no php.ini.

Para modificar o método padrão de manipulação de sessões, altere a
configuração de Session.save para refletir a opção de sua preferência.
Se você escolher 'database', você deveria também descomentar as
configurações de Session.database e rodar o arquivo de script SQL
localizado em app/config.

Para usar uma configuração personalizada, defina o valor de Session.save
para um nome de um arquivo. O CakePHP vai considerar este arquivo
informado no diretório CONFIGS.

::

    // app/config/core.php
    Configure::write('Session.save','my_session');

Isto permite que você personalize a manipulação de sessões.

::

    // app/config/my_session.php
    //
    // Reverte o valor e força checagem do referrer mesmo quando
    // Security.level for medium
    ini_restore('session.referer_check');

    ini_set('session.use_trans_sid', 0);
    ini_set('session.name', Configure::read('Session.cookie'));

    // Cookies agora são destruídos quando o navegador é fechado,
    // não persiste a informação por dias e é o padrão para nível
    // de segurança em low ou medium
    ini_set('session.cookie_lifetime', 0);

    // Cookie path agora é '/', mesmo se sua aplicação estiver
    // em um subdiretório no domínio
    $this->path = '/';
    ini_set('session.cookie_path', $this->path);

    // Cookies de sessão agora são persistidos para todos
    // os subdomínios
    ini_set('session.cookie_domain', env('HTTP_BASE'));

Métodos
=======

O componente Session é usado para interagir com as informações na
sessão. Ele inclui funções CRUD básicas bem como recursos para criação
de mensagens de feedback para os usuários.

Deve-se notar que estruturas de array podem ser criadas na sessão
utilizando-se a notação de ponto. Assim, User.username deve referenciar
a seguinte estrutura:

::

        array('User' => 
                array('username' => 'clarkKent@dailyplanet.com')
        );

Pontos são usados para indicar arrays dentro de arrays. Esta notação
pode ser usada para todos os métodos do componente Session onde $name
for usado.

write
-----

``write($name, $value)``

Escreve na sessão, atribuindo $value para $name. $name pode referenciar
um array na notação de ponto. Por exemplo:

::

    $this->Session->write('Person.eyeColor', 'Green');

Isto escrever o valor 'Green' na chave de sessão sob Person => eyeColor.

setFlash
--------

``setFlash($message, $layout = 'default', $params = array(), $key = 'flash')``

Usado para definir uma variável de sessão que pode ser usada para
exibição na view. O parâmtro $layout lhe permite selecionar o layout
(presente em ``/app/views/layouts``) a ser usado para renderizar a
mensagem. Se você mantiver ``$layout`` como 'default', a mensagem será
encapsulada da seguinte maneira:

::

    <div id="flashMessage" class="message"> [message] </div>

$params lhe permite passar variáveis adicionais para a view para o
layout renderizado. $key atribui o índice de $messages no array Message.
Seu valor padrão é 'flash'.

Podem ser passados parâmetros que afetem a div renderizada, por exemplo,
incluir uma chave "class" no array $params irá aplicar aquela classe à
``div`` de saída usando ``$session->flash()`` em seu layout ou view.

::

    $this->Session->setFlash('Texto de uma mensagem de exemplo', 'default', array('class' => 'example_class'))

A saída ao usar ``$session->flash()`` com o código de exemplo acima será
algo como:

::

    <div id="flashMessage" class="example_class">Texto de uma mensagem de exemplo</div>

read
----

``read($name)``

Retorna o valor armazenado em $name na sessão. Se $name for null, os
valores de toda a sessão seráo retornado. P.ex.:

::

    $green = $this->Session->read('Person.eyeColor');

Retorna o valor Green a partir da sessão.

check
-----

``check($name)``

Usado para verificar se a variável de sessão está definida. Retorna true
se a variável dada existir e false em caso contrário.

delete
------

``delete($name) /*or*/ del($name)``

Limpa o valor da sessão data em $name. Ex.

::

    $this->Session->del('Pessoa.CorDoOlho');

Sua sessão não contém o valor 'Verde', ou CorDoOlho não está definida.
No entanto, a Pessoa existe na sessão. Para deletar a informação da
Pessoa completa da sessão use.

::

    $this->Session->del('Pessoa');

destroy
-------

O método ``destroy`` irá excluir o cookie de sessão e todos os dados
armazenados no sistema de arquivo temporário. Este método vai destruir a
sessão PHP e então criar uma nova sessão limpa.

::

    $this->Session->destroy()

error
-----

``error()``

Usado para determinar o último erro na sessão.
