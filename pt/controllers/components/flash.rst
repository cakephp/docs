Flash
#####

.. php:namespace:: Cake\Controller\Component

.. php:class:: FlashComponent(ComponentCollection $collection, array $config = [])

FlashComponent fornece uma maneira de definir mensagens de notificação únicas a serem
exibidas após processar um formulário ou reconhecer dados. O CakePHP se refere a essas
mensagens como "mensagens flash". FlashComponent grava mensagens flash em
``$_SESSION``, para serem renderizadas em uma View usando
:doc:`FlashHelper </views/helpers/flash>`.

Definindo Mensagens Flash
==========================

FlashComponent fornece duas maneiras de definir mensagens flash: seu método mágico ``__call()``
e seu método ``set()``. Para fornecer verbosidade à sua aplicação,
o método mágico ``__call()`` do FlashComponent permite que você use um nome de método que
mapeia para um elemento localizado no diretório **templates/element/flash**.
Por convenção, métodos camelcased serão mapeados para o nome do elemento
em letras minúsculas e com underscores::

    // Usa templates/element/flash/success.php
    $this->Flash->success('This was successful');

    // Usa templates/element/flash/great_success.php
    $this->Flash->greatSuccess('This was greatly successful');

Alternativamente, para definir uma mensagem de texto simples sem renderizar um elemento, você pode
usar o método ``set()``::

    $this->Flash->set('This is a message');

Mensagens flash são anexadas a um array internamente. Chamadas sucessivas a
``set()`` ou ``__call()`` com a mesma chave irão anexar as mensagens em
``$_SESSION``. Se você quiser sobrescrever mensagens existentes ao definir uma mensagem
flash, defina a opção ``clear`` como ``true`` ao configurar o Component.

Os métodos ``__call()`` e ``set()`` do FlashComponent opcionalmente aceitam um segundo
parâmetro, um array de opções:

* ``key`` Padrão é 'flash'. A chave do array encontrada sob a chave ``Flash`` na
  sessão.
* ``element`` Padrão é ``null``, mas será automaticamente definido ao usar o
  método mágico ``__call()``. O nome do elemento a ser usado para renderização.
* ``params`` Um array opcional de chaves/valores para disponibilizar como variáveis
  dentro de um elemento.
* ``clear`` espera um ``bool`` e permite que você exclua todas as mensagens na
  pilha atual e inicie uma nova.

Um exemplo de uso dessas opções::

    // In your Controller
    $this->Flash->success('The user has been saved', [
        'key' => 'positive',
        'clear' => true,
        'params' => [
            'name' => $user->name,
            'email' => $user->email,
        ],
    ]);

    // In your View
    <?= $this->Flash->render('positive') ?>

    <!-- In templates/element/flash/success.php -->
    <div id="flash-<?= h($key) ?>" class="message-info success">
        <?= h($message) ?>: <?= h($params['name']) ?>, <?= h($params['email']) ?>.
    </div>

Note que o parâmetro ``element`` sempre será sobrescrito ao usar
``__call()``. Para recuperar um elemento específico de um plugin, você deve
definir o parâmetro ``plugin``. Por exemplo::

    // In your Controller
    $this->Flash->warning('My message', ['plugin' => 'PluginName']);

O código acima usará o elemento **warning.php** sob
**plugins/PluginName/templates/element/flash** para renderizar a mensagem
flash.

.. note::

    Por padrão, o CakePHP escapa o conteúdo em mensagens flash para prevenir cross
    site scripting. Dados do usuário em suas mensagens flash serão codificados em HTML e
    seguros para serem impressos. Se você quiser incluir HTML em suas mensagens flash, você
    precisa passar a opção ``escape`` e ajustar seus templates de mensagens flash
    para permitir desabilitar o escape quando a opção escape for passada.

HTML em Mensagens Flash
========================

É possível gerar HTML em mensagens flash usando a chave de opção ``'escape'``::

    $this->Flash->info(sprintf('<b>%s</b> %s', h($highlight), h($message)), ['escape' => false]);

Certifique-se de escapar a entrada manualmente. No exemplo acima,
``$highlight`` e ``$message`` são entradas não-HTML e, portanto, escapadas.

Para mais informações sobre renderização de suas mensagens flash, consulte a
seção :doc:`FlashHelper </views/helpers/flash>`.
