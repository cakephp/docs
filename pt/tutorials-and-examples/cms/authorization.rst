CMS Tutorial - Authorization
############################

Agora que os usuários podem fazer login em nosso CMS, queremos aplicar regras de autorização
para garantir que cada usuário edite apenas as postagens que lhe pertencem. Usaremos o
`plugin de autorização <https://book.cakephp.org/authorization/2>`__ para fazer isso.

Instalando o Plugin Authorization
=================================

Use o composer para instalar o Plugin Authorization:

.. code-block:: console

    composer require "cakephp/authorization:^3.0"

Carregue o plugin adicionando a seguinte declaração ao método ``bootstrap()`` em **src/Application.php**::

    $this->addPlugin('Authorization');

Habilitando o Plugin Authorization
==================================

O plugin Authorization integra-se à sua aplicação como uma camada de middleware
e, opcionalmente, como um componente para facilitar a verificação da autorização. Primeiro, vamos
aplicar o middleware. Em **src/Application.php**, adicione o seguinte à classe
imports::

    use Authorization\AuthorizationService;
    use Authorization\AuthorizationServiceInterface;
    use Authorization\AuthorizationServiceProviderInterface;
    use Authorization\Middleware\AuthorizationMiddleware;
    use Authorization\Policy\OrmResolver;

Adicione ``AuthorizationServiceProviderInterface`` às interfaces implementadas em seu aplicativo::

    class Application extends BaseApplication
        implements AuthenticationServiceProviderInterface,
        AuthorizationServiceProviderInterface

Em seguida, adicione o seguinte ao seu método ``middleware()``::

    // Adicionar autorização **após** a autenticação
    $middlewareQueue->add(new AuthorizationMiddleware($this));

O ``AuthorizationMiddleware`` chamará um método de gancho em sua aplicação quando
começar a processar a requisição. Este método de gancho permite que sua aplicação
defina o ``AuthorizationService`` que deseja usar. Adicione o seguinte método ao seu
**src/Application.php**::

    public function getAuthorizationService(ServerRequestInterface $request): AuthorizationServiceInterface
    {
        $resolver = new OrmResolver();

        return new AuthorizationService($resolver);
    }

O OrmResolver permite que o plugin de autorização encontre classes de políticas para entidades e consultas ORM. 
Outros resolvedores podem ser usados ​​para encontrar políticas para outros tipos de recursos.

Em seguida, vamos adicionar o ``AuthorizationComponent`` ao ``AppController``. Em
**src/Controller/AppController.php**, adicione o seguinte ao método ``initialize()``::

    $this->loadComponent('Authorization.Authorization');

Por fim, marcaremos as ações de adicionar, fazer login e sair como não exigindo
autorização, adicionando o seguinte a
**src/Controller/UsersController.php**::

    // Nos métodos add, login e logout
    $this->Authorization->skipAuthorization();

O método ``skipAuthorization()`` deve ser chamado em qualquer ação do controlador
que deve ser acessível a todos os usuários, mesmo aqueles que ainda não efetuaram login.

Criando Nossa Primeira Política
===============================

O plugin Authorization modela autorização e permissões como classes de Política.
Essas classes implementam a lógica para verificar se uma **identidade** tem ou não 
permissão para **executar uma ação** em um determinado **recurso**. Nossa **identidade** será
nosso usuário logado, e nossos **recursos** serão nossas entidades ORM e
consultas. Vamos usar o bake para gerar uma política básica:

.. code-block:: console

    bin/cake bake policy --type entity Article

Isso gerará uma classe de política vazia para nossa entidade ``Article``. Você pode
encontrar a política gerada em **src/Policy/ArticlePolicy.php**. Em seguida, atualize a
política para que fique semelhante à seguinte::

    <?php
    namespace App\Policy;

    use App\Model\Entity\Article;
    use Authorization\IdentityInterface;

    class ArticlePolicy
    {
        public function canAdd(IdentityInterface $user, Article $article)
        {
            // Todos os usuários logados podem criar artigos.
            return true;
        }

        public function canEdit(IdentityInterface $user, Article $article)
        {
            // usuários logados podem editar seus próprios artigos.
            return $this->isAuthor($user, $article);
        }

        public function canDelete(IdentityInterface $user, Article $article)
        {
            // usuários logados podem excluir seus próprios artigos.
            return $this->isAuthor($user, $article);
        }

        protected function isAuthor(IdentityInterface $user, Article $article)
        {
            return $article->user_id === $user->getIdentifier();
        }
    }

Embora tenhamos definido algumas regras muito simples, você pode usar uma lógica tão 
complexa quanto seu aplicativo exigir em suas políticas.

Verificando a Autorização no ArticlesController
===============================================

Com nossa política criada, podemos começar a verificar a autorização em cada ação
do controller. Se esquecermos de verificar ou pularmos a autorização em uma ação do controller, o plugin
Authorization lançará uma exceção nos informando que esquecemos de aplicar
a autorização. Em **src/Controller/ArticlesController.php**, adicione o seguinte aos
métodos ``add``, ``edit`` e ``delete``::

    public function add()
    {
        $article = $this->Articles->newEmptyEntity();
        $this->Authorization->authorize($article);
        // Resto do método
    }

    public function edit($slug)
    {
        $article = $this->Articles
            ->findBySlug($slug)
            ->contain('Tags') // load associated Tags
            ->firstOrFail();
        $this->Authorization->authorize($article);
        // Resto do método
    }

    public function delete($slug)
    {
        $this->request->allowMethod(['post', 'delete']);

        $article = $this->Articles->findBySlug($slug)->firstOrFail();
        $this->Authorization->authorize($article);
        // Resto do método
    }

O método ``AuthorizationComponent::authorize()`` usará o nome da ação
do controller atual para gerar o método de política a ser chamado. Se desejar
chamar um método de política diferente, você pode chamar ``authorize`` com o nome da operação::

    $this->Authorization->authorize($article, 'update');

Por fim, adicione o seguinte aos métodos ``tags``, ``view`` e ``index`` no
``ArticlesController``::

    // As ações de visualização, índice e tags são métodos públicos
    // e não requerem verificações de autorização.
    $this->Authorization->skipAuthorization();

Corrigindo as Ações de Adicionar e Editar
=========================================

Embora tenhamos bloqueado o acesso à ação de edição, ainda estamos abertos a usuários
que alterem o atributo ``user_id`` dos artigos durante a edição.
Resolveremos esses problemas a seguir. A primeira é a ação ``add``.

Ao criar artigos, queremos corrigir o ``user_id`` para que seja o usuário
atualmente conectado. Substitua sua ação de adição pelo seguinte::

    // in src/Controller/ArticlesController.php

    public function add()
    {
        $article = $this->Articles->newEmptyEntity();
        $this->Authorization->authorize($article);

        if ($this->request->is('post')) {
            $article = $this->Articles->patchEntity($article, $this->request->getData());

            // Alterado: Defina o user_id do usuário atual.
            $article->user_id = $this->request->getAttribute('identity')->getIdentifier();

            if ($this->Articles->save($article)) {
                $this->Flash->success(__('Seu artigo foi salvo.'));

                return $this->redirect(['action' => 'index']);
            }
            $this->Flash->error(__('Não é possível adicionar seu artigo.'));
        }
        $tags = $this->Articles->Tags->find('list')->all();
        $this->set(compact('article', 'tags'));
    }

Em seguida, atualizaremos a ação ``edit``. Substitua o método de edição pelo seguinte::

    // in src/Controller/ArticlesController.php

    public function edit($slug)
    {
        $article = $this->Articles
            ->findBySlug($slug)
            ->contain('Tags') // carrega as Tags associadas
            ->firstOrFail();
        $this->Authorization->authorize($article);

        if ($this->request->is(['post', 'put'])) {
            $this->Articles->patchEntity($article, $this->request->getData(), [
                // Adicionado: desabilitar modificação do user_id.
                'accessibleFields' => ['user_id' => false]
            ]);
            if ($this->Articles->save($article)) {
                $this->Flash->success(__('Seu artigo foi atualizado.'));

                return $this->redirect(['action' => 'index']);
            }
            $this->Flash->error(__('Não é possível atualizar seu artigo.'));
        }
        $tags = $this->Articles->Tags->find('list')->all();
        $this->set(compact('article', 'tags'));
    }

Aqui, estamos modificando quais propriedades podem ser atribuídas em massa, por meio das opções
para ``patchEntity()``. Consulte a seção ``changing-accessible-fields`` para
mais informações. Lembre-se de remover o controle ``user_id`` de
**templates/Articles/edit.php**, pois não precisamos mais dele.

Concluindo
===========

Criamos um aplicativo CMS simples que permite aos usuários fazer login, publicar artigos,
marcá-los, explorar artigos publicados por tag e aplicar controle de acesso básico a
artigos. Também adicionamos algumas melhorias interessantes na UX, aproveitando os recursos do FormHelper e do ORM.

Obrigado por dedicar seu tempo para explorar o CakePHP. Em seguida, você deve aprender mais sobre
o :doc:`/orm` ou consultar o :doc:`/topics`.
