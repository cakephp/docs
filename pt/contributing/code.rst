Código
######

*Patches* e *pull requests* são formas de contribuir com código para o CakePHP.
*Pull requests* podem ser criados no Github e tem preferência sobre arquivos de
*patch* nos comentários dos *tickets*.

Configuração inicial
====================

Antes de trabalhar em *patches* para o CakePHP, é uma boa ideia configurar seu
ambiente. Você vai precisar do seguinte *software*:

* Git
* PHP 5.5.9 ou maior
* PHPUnit 3.7.0 ou maior

Defina suas informações de usuário com seu nome e endereço de email::

    git config --global user.name 'Bob Barker'
    git config --global user.email 'bob.barker@example.com'

.. note::

    Se você é novo no Git, recomendamos que leia o gratuito e excelente manual
    `ProGit <http://git-scm.com/book/>`_.

Clone o código-fonte do CakePHP do Github:

* Se você não tem uma conta no `GitHub <http://github.com>`_, crie uma.
* Dê *Fork* no `repositório do CakePHP <http://github.com/cakephp/cakephp>`_
  clicando no botão **Fork&**.

Depois que seu *fork* for feito, clone seu *fork* para sua máquina::

    git clone git@github.com:SEUNOME/cakephp.git

Adicione o repositório original do CakePHP como seu repositório remoto. Você irá
usá-lo posteriormente para solicitar atualizações das alterações no repositório
do CakePHP. Assim sua versão local estará sempre atualizada::

    cd cakephp
    git remote add upstream git://github.com/cakephp/cakephp.git

Agora que você tem o CakePHP configurado você pode definir uma
:ref:`conexão com o banco de dados <database-configuration>` ``$test``, e
:ref:`executar todos os testes <running-tests>`.

Trabalhando em um patch
=======================

Toda vez que for trabalhar em um *bug*, *feature* ou melhoria, crie um *branch*
específico.

O *branch* criado deve ser baseado na versão que deseja atualizar. Por exemplo,
se você estiver corrigindo um *bug* na versão ``3.x``, você deve usar o
*branch* ``master`` como base. Se sua alteração for uma correção de *bug* para a
versão ``2.x``, você deve usar o *branch* ``2.x``. Isso faz o *merging*
das suas alterações uma tarefa muito mais simples futuramente::

    # corrigindo um bug na versão 3.x
    git fetch upstream
    git checkout -b ticket-1234 upstream/master

    # corrigindo um bug na versão 2.x
     git fetch upstream
     git checkout -b ticket-1234 upstream/2.x

.. tip::

    Use um nome descritivo para o seu *branch*, referenciar o nome do *ticket*
    ou da *feature* é uma boa convenção, e.g. ticket-1234, feature-awesome

A cima criamos um *branch* local baseado no *branch* do *upstream* (CakePHP)
2.x. Trabalhe na sua correção/atualização e faça quantos *commits* precisar, mas
tenha em mente o seguinte:

* Siga as :doc:`/contributing/cakephp-coding-conventions`.
* Adicione um caso de teste para mostrar que o *bug* está corrigido, ou que a
  nova *feature* funciona.
* Mantenha alguma lógica em seus *commits* e escreva mensagens limpas e
  coerentes.

Enviando um pull request
========================

Uma vez que suas alterações estiverem concluídas e prontas para serem integradas
ao CakePHP, você deve atualizar seu *branch*::

    # Correção por rebase a partir do topo do branch master
    git checkout master
    git fetch upstream
    git merge upstream/master
    git checkout <branch_name>
    git rebase master

Isso irá requisitar e mesclar quaisquer alterações que aconteceram no CakePHP
desde que você começou suas alterações, e então executar *rebase* ou replicar
suas alterações no topo da lista atual. Você pode encontrar um conflito durante
o ``rebase``. Se o *rebase* abortar prcocemente, você pode verificar que
arquivos são conflitantes usando o comando ``git status``. Resolva cada conflito
e então continue o *rebase*::

    git add <nome-do-arquivo> # faça isso para cada arquivo conflitante.
    git rebase --continue

Verifique se todos os seus testes continuam a passar e então faça *push* do seu
*branch* para o seu *fork*::

    git push origin <nome-do-branch>

Se você usou *rebase* após enviar as atualizações do seu *branch* por *push*,
você precisará forçar o *push*::

    git push --force origin <nome-do-branch>

Uma vez que o seu *branch* estiver no Github, você pode enviar um *pull request*
.

Escolhendo onde suas alterações serão incorporadas
--------------------------------------------------

Ao fazer *pull requests* você deve ter certeza que selecionou o *branch* correto
, pois você não pode fazer qualquer edição após o *pull request* ter sido criado
.

* Se sua alteração for um **bugfix**, não introduzir uma nova funcionalidade e
  apenas corrigir um comportamento existente que está presente no *release*
  atual, escolhe o *branch* **master** como seu alvo.
* Se sua alteração for uma **feature**, então você deve escolher o *branch*
  referente ao próximo número de versão. Por exemplo, se o *branch* atual
  estável for ``3.2.10``, o *branch* a receber novas funcionalidades será o
  ``3.next``.
* Se sua alteração quebra funcionalidades existentes, ou API's, então você
  deverá escolher o próximo *major release*. Por exemplo, se o branch estável
  atual for ``3.2.2``, então a versão na qual o comportamento pode ser quebrado
  será na versão ``4.x``.


.. note::

    Lembre-se que todo código que você contribui com o CakePHP será licensiado
    sob a licença MIT, e a `Cake Software Foundation <http://cakefoundation.org/pages/about>`_
    será a proprietária de qualquer código proveniente de contribuição. Os
    contribuidores devem seguir as
    `regras comunitárias do CakePHP <http://community.cakephp.org/guidelines>`_.

Todas as correções de *bugs* incorporadas a um *branch* de manutenção serão
posteriormente mescladas nos lançamentos futuros realizados pelo time do
CakePHP.


.. meta::
    :title lang=pt: Código
    :keywords lang=pt: git,branch,código,repositório,pull request,patch,testes,checkout
