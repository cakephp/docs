Código
######

Patches e pull requests são as melhores formas de colaborar com o CakePHP.
Pull requests podem ser feitos através do GitHub e geralmente é a melhor forma de contribuir.

Configuração Inicial
====================

Antes de trabalhar em patches para o CakePHP, é uma boa idea configurar seu ambiente.
Você vai precisar dos seguintes softwares:

* Git
* PHP 5.2.6 ou superior
* PHPUnit 3.5.10 ou superior (3.7.38 recommended)

Configure suas informações pessoais com seu nome e e-mail::

    git config --global user.name 'Bob Barker'
    git config --global user.email 'bob.barker@example.com'

.. note::

    Se você é novo com Git, é recomendável que você leia o excelente e gratuito
    `ProGit <http://git-scm.com/book/>`_ book.

Faça o clone do código do CakePHP diretamente do GitHub:

* Se você não tem uma conta no `github <http://github.com>`_, crie uma.
* Faça um Fork do `repositório CakePHP <http://github.com/cakephp/cakephp>`_ clicando
  no botão **Fork**.

Depois clone o fork feito para sua máquina local::

    git clone git@github.com:YOURNAME/cakephp.git

Adicione o repositório oficial do CakePHP como repositório remoto.
Assim você mantém seu Fork atualizado com o repositório oficial::

    cd cakephp
    git remote add upstream git://github.com/cakephp/cakephp.git

Agora que está tudo configurado, você poderá definir a conexão ``$test``
:ref:`database connection <database-configuration>`, e
:ref:`run all the tests <running-tests>`.

Trabalhando em um Patch
=======================

Sempre que você quiser corrigir um bug, criar um recurso ou uma melhoria, crie
um *topic branch*.

O branch que você criar deve ser baseado na versão que você está corrigindo/melhorando.
Por exemplo: Se você vai corrigir um bug na versão ``2.0`` você precisa usar o branch ``2.0``
como base para o seu branch. Isso facilita para aplicar suas alterações::

    # fixing a bug on 2.0
    git fetch upstream
    git checkout -b ticket-1234 upstream/2.0

.. tip::

    Utilize nome descritivos para os branchs, referenciando o ticket é uma boa
    convenção. Ex.: ticket-1234, feature-awesome

O trecho acima vai criar um branch local baseado no branch 2.0 do repositório oficial (*upstream*)
Faça as alterações necessárias e faça quantos *commits* achar necessário, mas tenha sempre em mente:

* Siga a :doc:`/contributing/cakephp-coding-conventions`.
* Adicione um *test case* para mostrar que o bug foi corrigido ou que o novo recurso funciona.
* Mantenha os commits lógicos, escreva mensagens claras e consistentes.

Enviando um pull request
========================

Agora que suas alterações estão prontas é hora de fazer o *merge* no CakePHP,
mas antes de enviar você precisa atualizar suas *branchs*::

    git checkout 2.0
    git fetch upstream
    git merge upstream/2.0
    git checkout <branch_name>
    git rebase 2.0

O trecho acima vai pegar todas as alterações que ocorreram no repositório oficial
desde que você começou sua branch local e fazer o *merge*. E depois faz um *rebase*
- replicando suas alterações no código atualizado. Podem acontecer conflitos durante
o ``rebase``. Caso ocorra um conflito você poderá ver quais arquivos estão com conflitos
com ``git status``.
Resolva cada conflito e continue seu *rebase*::

    git add <filename> # faça isso para cada arquivo com conflito.
    git rebase --continue

Verifique se todos os seus testes (*test case*) estão passando. Então envie
sua branch para seu fork::

    git push origin <branch-name>

Agora que sua branch está no GitHub, você pode discutir as alterações
na lista de discussão `cakephp-core <http://groups.google.com/group/cakephp-core>`_  ou
enviar um pull request no GitHub.

.. note::

	Lembre-se de que todo o código contribuido para o CakePHP será licenciado sob
	a licença MIT, e a Cake Software Foundation se tornará proprietária de qualquer
	código contribuido, além de que todo código contribuido está sujeito ao
	`Contrato de licença de contribuidores <http://cakefoundation.org/pages/cla>`_.

Todos as correções de bugs serão aplicadas em um branch de manutenção que será aplicado
nas próximas versão pelo *core team*.
