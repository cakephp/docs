Flash
#####

.. php:namespace:: Cake\Controller\Component

.. php:class:: FlashComponent(ComponentCollection $collection, array $config = [])

O FlashComponent fornece uma maneira de definir as mensagens de notificação únicas 
a serem exibidas após o processamento de um formulário ou o reconhecimento de dados. 
CakePHP refere-se a essas mensagens como "mensagens flash". O FlashComponent grava 
mensagens flash em ``$_SESSION``, para serem renderizadas em uma View usando 
:doc:`FlashHelper </views/helpers/flash>`.

Configurando Mensagens em Flash
===============================

O FlashComponent fornece duas maneiras de definir mensagens em flash: seu método 
mágico ``__call()`` e seu método ``set()``. Para fornecer detalhes ao seu aplicativo, 
o método mágico ``__call()`` do FlashComponent permite que você use um nome de método 
que mapeie para um elemento localizado no diretório **templates/element/Flash**. Por 
convenção, os métodos camelcased serão mapeados para o nome do elemento em minúsculas 
e sublinhado::

    // Usa templates/element/Flash/success.php
    $this->Flash->success('This was successful');

    // Usa templates/element/Flash/great_success.php
    $this->Flash->greatSuccess('This was greatly successful');

Como alternativa, para definir uma mensagem de texto sem processar um elemento, 
você pode usar o método ``set()``::

    $this->Flash->set('This is a message');

Mensagens em Flash são anexadas a uma matriz internamente. Chamadas sucessivas 
para ``set()`` ou ``__call()`` com a mesma chave anexarão as mensagens em 
``$_SESSION``. Se você deseja sobrescrever as mensagens existentes ao definir 
uma mensagem flash, defina a opção ``clear`` como ``true`` ao configurar o 
componente.

Os métodos ``__call()`` e ``set()`` do FlashComponent recebem opcionalmente um 
segundo parâmetro, uma matriz de opções:

* ``key`` O padrão é 'flash'. A chave da matriz encontrada sob a chave ``Flash`` na sessão.
* ``element`` O padrão é ``null``, mas será automaticamente definido ao usar o método mágico 
``__call()``. O nome do elemento a ser usado para renderização.
* ``params`` Uma matriz opcional de chaves/valores para disponibilizar como variáveis dentro de um elemento.
* ``clear`` espera um ``bool`` e permite excluir todas as mensagens da pilha atual e iniciar uma nova.

Um exemplo de uso dessas opções::

    // Em seu Controller
    $this->Flash->success('The user has been saved', [
        'key' => 'positive',
        'clear' => true,
        'params' => [
            'name' => $user->name,
            'email' => $user->email
        ]
    ]);

    // Em sua View
    <?= $this->Flash->render('positive') ?>

    <!-- Em templates/element/Flash/success.php -->
    <div id="flash-<?= h($key) ?>" class="message-info success">
        <?= h($message) ?>: <?= h($params['name']) ?>, <?= h($params['email']) ?>.
    </div>

Note that the parameter ``element`` will be always overridden while using

Observe que o parâmetro ``element`` sempre será substituído ao usar ``__call()``. 
Para recuperar um elemento específico de um plugin, você deve definir o parâmetro 
``plugin``. Por exemplo::

    // Em seu Controller
    $this->Flash->warning('My message', ['plugin' => 'PluginName']);

O código acima usará o elemento **warning.php** em 
**plugins/PluginName/templates/element/Flash** para renderizar a mensagem flash.

.. note::

    Por padrão, o CakePHP escapa o conteúdo das mensagens em flash para evitar 
    scripts entre sites. Os dados do usuário em suas mensagens flash serão codificados 
    em HTML e seguros para serem impressos. Se você deseja incluir HTML em suas mensagens 
    em flash, é necessário passar a opção ``escape`` e ajustar seus modelos de mensagens 
    em flash para permitir desativar a fuga quando a opção de escape é aprovada.

HTML Em Mensagens Flash
=======================

É possível gerar HTML em mensagens flash usando a chave de opção ``'escape'``::

    $this->Flash->info(sprintf('<b>%s</b> %s', h($highlight), h($message)), ['escape' => false]);

Certifique-se de escapar da entrada manualmente, então. No exemplo acima, ``$highlights`` e 
``$message`` são entradas não HTML e, portanto, escapam.

Para obter mais informações sobre como renderizar suas mensagens em flash, consulte a 
seção :doc:`FlashHelper </views/helpers/flash>`.
