Objetos de Registro
###################

As classes de registro fornecem uma maneira simples de criar e recuperar instâncias
carregadas de um determinado tipo de objeto. Existem classes de registro para Components,
Helpers, Tasks e Behaviors.

Embora os exemplos abaixo usem Components, o mesmo comportamento pode ser esperado
para Helpers, Behaviors e Tasks, além de Components.

Carregando Objetos
==================

Objetos podem ser carregados dinamicamente usando add<registry-object>()
Exemplo::

    $this->loadComponent('Acl.Acl');
    $this->addHelper('Flash')

Isso resultará no carregamento da propriedade ``Acl`` e do helper ``Flash``.
A configuração também pode ser definida dinamicamente. Exemplo::

    $this->loadComponent('Cookie', ['name' => 'sweet']);

Quaisquer chaves e valores fornecidos serão passados para o construtor do Component. A
única exceção a esta regra é ``className``. Classname é uma chave especial que é
usada para criar aliases de objetos em um registro. Isso permite que você tenha nomes de components
que não refletem os nomes de classe, o que pode ser útil ao estender components
do núcleo::

    $this->Flash = $this->loadComponent('Flash', ['className' => 'MyCustomFlash']);
    $this->Flash->error(); // Actually using MyCustomFlash::error();

Acionando Callbacks
===================

Callbacks não são fornecidos por objetos de registro. Você deve usar o
:doc:`sistema de eventos </core-libraries/events>` para disparar quaisquer eventos/callbacks
para sua aplicação.

Desabilitando Callbacks
========================

Em versões anteriores, objetos de coleção forneciam um método ``disable()`` para desabilitar
objetos de receber callbacks. Você deve usar os recursos do sistema de eventos para
fazer isso agora. Por exemplo, você poderia desabilitar callbacks de components da
seguinte maneira::

    // Remove MyComponent from callbacks.
    $this->getEventManager()->off($this->MyComponent);

    // Re-enable MyComponent for callbacks.
    $this->getEventManager()->on($this->MyComponent);

.. meta::
    :title lang=pt: Objetos de Registro
    :keywords lang=pt: array name,loading components,several different kinds,unified api,loading objects,component names,special key,core components,callbacks,prg,callback,alias,fatal error,collections,memory,priority,priorities
