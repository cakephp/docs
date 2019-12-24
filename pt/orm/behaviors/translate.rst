Translate
#########

.. php:namespace:: Cake\ORM\Behavior

.. php:class:: TranslateBehavior

O comportamento Translate permite criar e recuperar cópias traduzidas de suas 
entidades em vários idiomas. Isso é feito usando uma tabela ``i18n`` separada, 
na qual armazena a tradução para cada um dos campos de qualquer objeto de Tabela 
ao qual está vinculado.

.. warning::

    O TranslateBehavior não suporta chaves primárias compostas neste momento.

Um Tour Rápido
==============

Depois de criar a tabela ``i18n`` no seu banco de dados, anexe o comportamento 
a qualquer objeto da Tabela que você deseja tornar traduzível::

    class ArticlesTable extends Table
    {
        public function initialize(array $config)
        {
            $this->addBehavior('Translate', ['fields' => ['title']]);
        }
    }

Agora, selecione um idioma a ser usado para recuperar entidades alterando 
o idioma do aplicativo, o que afetará todas as traduções::

    // Em um controlador. Alterar a localidade, por exemplo para espanhol
    I18n::setLocale('es');
    $this->loadModel('Articles');

Em seguida, obtenha uma entidade existente::

    $article = $this->Articles->get(12);
    echo $article->title; // Eco em 'Um título', ainda não traduzido

Em seguida, traduza sua entidade::

    $article->title = 'Un Artículo';
    $this->Articles->save($article);

Agora você pode tentar obter sua entidade novamente::

    $article = $this->Articles->get(12);
    echo $article->title; // Echo em 'Un Artículo', yay pedaço de bolo!

O trabalho com várias traduções pode ser feito usando uma trait 
especial na sua classe Entity::

    use Cake\ORM\Behavior\Translate\TranslateTrait;
    use Cake\ORM\Entity;

    class Article extends Entity
    {
        use TranslateTrait;
    }

Agora você pode encontrar todas as traduções para uma única entidade::

    $article = $this->Articles->find('translations')->first();
    echo $article->translation('es')->title; // 'Un Artículo'

    echo $article->translation('en')->title; // 'An Article';

É igualmente fácil salvar várias traduções ao mesmo tempo::

    $article->translation('es')->title = 'Otro Título';
    $article->translation('fr')->title = 'Un autre Titre';
    $this->Articles->save($article);

Se você quiser se aprofundar em como ele funciona ou como ajustar o 
comportamento às suas necessidades, continue lendo o restante deste capítulo.

Inicializando a Tabela do Banco de Dados i18n
=============================================

Para usar o comportamento, você precisa criar uma tabela ``i18n`` com o 
esquema correto. Atualmente, a única maneira de carregar a tabela ``i18n`` 
é executando manualmente o seguinte script SQL no seu banco de dados:

.. code-block:: mysql

    CREATE TABLE i18n (
        id int NOT NULL auto_increment,
        locale varchar(6) NOT NULL,
        model varchar(255) NOT NULL,
        foreign_key int(10) NOT NULL,
        field varchar(255) NOT NULL,
        content text,
        PRIMARY KEY	(id),
        UNIQUE INDEX I18N_LOCALE_FIELD(locale, model, foreign_key, field),
        INDEX I18N_FIELD(model, foreign_key, field)
    );

O esquema também está disponível como arquivo sql em **/config/schema/i18n.sql**.

Uma observação sobre as abreviações de idioma: O comportamento de tradução não 
impõe restrições ao identificador de idioma; os valores possíveis são restritos 
apenas pelo tipo/tamanho da coluna ``locale``. ``locale`` é definido como 
``varchar(6)`` caso você queira usar abreviações como ``es-419`` (espanhol para América Latina, 
abreviação de idioma com código de área `UN M.49 <https://en.wikipedia.org/wiki/UN_M.49>`_).

.. tip::

    É aconselhável usar as mesmas abreviações de idioma necessárias para 
    :doc:`Internacionalização e localização</core-libraries/internationalization-and-location>`. 
    Assim, é consistente e a alternância do idioma funciona de forma idêntica para 
    ambos, o ``Translate Behaviour`` e ``Internationalization and Localization``.

Portanto, é recomendável usar o código ISO de duas letras do idioma como ``en``, ``fr``, 
``de`` ou o nome completo da localidade, como ``fr_FR``, ``es_AR`` , ``da_DK``, que 
contém o idioma e o país em que é falado.

Anexando o Comportamento da Conversão às suas Tabelas
=====================================================

Anexar o comportamento pode ser feito no método ``initialize()`` na sua classe Table::

    class ArticlesTable extends Table
    {

        public function initialize(array $config)
        {
            $this->addBehavior('Translate', ['fields' => ['title', 'body']]);
        }
    }

A primeira coisa a observar é que você deve passar a chave ``fields`` na matriz de configuração. 
Essa lista de campos é necessária para informar ao comportamento quais colunas serão capazes de 
armazenar traduções.

Usando uma Tabela de Traduções Separada
---------------------------------------

Se você deseja usar uma tabela diferente de ``i18n`` para converter um repositório específico, 
pode especificar o nome da classe da tabela para sua tabela personalizada na configuração 
do comportamento. Isso é comum quando você tem várias tabelas para traduzir e deseja uma separação 
mais limpa dos dados armazenados para cada tabela diferente::

    class ArticlesTable extends Table
    {
        public function initialize(array $config)
        {
            $this->addBehavior('Translate', [
                'fields' => ['title', 'body'],
                'translationTable' => 'ArticlesI18n'
            ]);
        }
    }

Você precisa ter certeza de que qualquer tabela personalizada usada tenha as colunas 
``field``, ``foreign_key``, ``locale`` e ``model``.

Lendo Conteúdo Traduzido
========================

Como mostrado acima, você pode usar o método ``setLocale()`` para escolher a tradução 
ativa para entidades que são carregadas::

    // Carregue as funções principais do I18n no início do seu Controller:
    use Cake\I18n\I18n;

    // Depois, você pode alterar o idioma em sua ação:
    I18n::setLocale('es');
    $this->loadModel('Articles');

    // Todas as entidades nos resultados conterão tradução para o espanhol
    $results = $this->Articles->find()->all();

Este método funciona com qualquer localizador em suas tabelas. Por exemplo, você 
pode usar o TranslateBehavior com ``find('list')``::

    I18n::setLocale('es');
    $data = $this->Articles->find('list')->toArray();

    // Os dados conterão
    [1 => 'Mi primer artículo', 2 => 'El segundo artículo', 15 => 'Otro articulo' ...]

Recuperar Todas as Traduções para uma Entidade
----------------------------------------------

Ao criar interfaces para atualizar o conteúdo traduzido, geralmente é útil mostrar 
uma ou mais traduções ao mesmo tempo. Você pode usar o localizador de ``traduções`` 
para isso::

    // Encontre o primeiro artigo com todas as traduções correspondentes
    $article = $this->Articles->find('translations')->first();

No exemplo acima, você receberá uma lista de entidades que possuem um conjunto de 
propriedades ``_translations``. Esta propriedade conterá uma lista de entidades 
de dados de conversão. Por exemplo, as seguintes propriedades estariam acessíveis::

    // Saídas 'en'
    echo $article->_translations['en']->locale;

    // Saídas 'title'
    echo $article->_translations['en']->field;

    // Saídas 'My awesome post!'
    echo $article->_translations['en']->body;

Uma maneira mais elegante de lidar com esses dados é adicionando uma trait 
à classe de entidade usada para sua tabela::

    use Cake\ORM\Behavior\Translate\TranslateTrait;
    use Cake\ORM\Entity;

    class Article extends Entity
    {
        use TranslateTrait;
    }

Essa trait contém um único método chamado ``translation``, que permite acessar 
ou criar novas entidades de tradução em tempo real::

    // Saída de 'title'
    echo $article->translation('en')->title;

    // Adiciona uma nova entidade de dados de tradução ao artigo
    $article->translation('de')->title = 'Wunderbar';

Limitando as Traduções a serem Recuperadas
------------------------------------------

Você pode limitar os idiomas buscados no banco de dados para um conjunto específico de registros::

    $results = $this->Articles->find('translations', [
        'locales' => ['en', 'es']
    ]);
    $article = $results->first();
    $spanishTranslation = $article->translation('es');
    $englishTranslation = $article->translation('en');

Impedindo a Recuperação de Traduções Vazias
-------------------------------------------

Os registros de tradução podem conter qualquer sequência, se um registro tiver sido traduzido e 
armazenado como uma sequência vazia (''), o comportamento da conversão será usado e o substituirá 
pelo valor do campo original.

Se isso for indesejável, você pode ignorar as traduções vazias usando a chave de configuração 
``allowEmptyTranslations``::

    class ArticlesTable extends Table
    {
        public function initialize(array $config)
        {
            $this->addBehavior('Translate', [
                'fields' => ['title', 'body'],
                'allowEmptyTranslations' => false
            ]);
        }
    }

O exemplo acima carregaria apenas os dados traduzidos que tenham conteúdo.

Recuperando Todas as Traduções para Associações
-----------------------------------------------

Também é possível encontrar traduções para qualquer associação em uma única operação de localização::

    $article = $this->Articles->find('translations')->contain([
        'Categories' => function ($query) {
            return $query->find('translations');
        }
    ])->first();

    // Saídas 'Programación'
    echo $article->categories[0]->translation('es')->name;

Isso pressupõe que ``Categories`` tem o TranslateBehavior associado. Simplesmente
use a função de construtor de consultas ``contain`` para usar o 
find personalizado ``translator`` na associação.

.. _retrieving-one-language-without-using-i18n-locale:

Recuperando um Idioma Sem Usar I18n::SetLocale
----------------------------------------------

chamando ``I18n::setLocale('es');`` altera a localidade padrão para todas as descobertas 
traduzidas, pode haver momentos em que você deseja recuperar o conteúdo traduzido sem 
modificar o estado do aplicativo. Para esses cenários, use o método ``setLocale()`` 
do comportamento::

    I18n::setLocale('en'); // redefinir para ilustração

    $this->loadModel('Articles');

    // localidade específica. Use locale () anterior à 3.6
    $this->Articles->setLocale('es');

    $article = $this->Articles->get(12);
    echo $article->title; // Echoes 'Un Artículo', yay piece of cake!

Observe que isso altera apenas a localidade da tabela Articles, isso não afetaria o idioma dos 
dados associados. Para afetar os dados associados, é necessário chamar o método em cada 
tabela, por exemplo::

    I18n::setLocale('en'); // Reseta para ilustração

    $this->loadModel('Articles');
    // Use locale() anterior à 3.6
    $this->Articles->setLocale('es');
    $this->Articles->Categories->setLocale('es');

    $data = $this->Articles->find('all', ['contain' => ['Categories']]);

Este exemplo também pressupõe que ``Categories`` tem o TranslateBehavior associado.

Consultando Campos Traduzidos
-----------------------------

TranslateBehavior não substitui as condições de localização por padrão. Você 
precisa usar o método ``translationField()`` para compor as condições de localização nos 
campos traduzidos::

    // Use locale() anterior à 3.6
    $this->Articles->setLocale('es');
    $data = $this->Articles->find()->where([
        $this->Articles->translationField('title') => 'Otro Título'
    ]);

Salvando em Outro Idioma
========================

A filosofia por trás do TranslateBehavior é que você tem uma entidade que representa o 
idioma padrão e várias traduções que podem substituir determinados campos nessa entidade. 
Tendo isso em mente, você pode salvar intuitivamente traduções para qualquer entidade. 
Por exemplo, dada a seguinte configuração::

    // Em src/Model/Table/ArticlesTable.php
    class ArticlesTable extends Table
    {
        public function initialize(array $config)
        {
            $this->addBehavior('Translate', ['fields' => ['title', 'body']]);
        }
    }

    // Em src/Model/Entity/Article.php
    class Article extends Entity
    {
        use TranslateTrait;
    }

    // Em um Controller
    $this->loadModel('Articles');
    $article = new Article([
        'title' => 'My First Article',
        'body' => 'This is the content',
        'footnote' => 'Some afterwords'
    ]);

    $this->Articles->save($article);

Portanto, depois de salvar seu primeiro artigo, você pode salvar uma tradução para ele, 
existem algumas maneiras de fazê-lo. O primeiro é definir o idioma diretamente na entidade::

    $article->_locale = 'es';
    $article->title = 'Mi primer Artículo';

    $this->Articles->save($article);

Depois que a entidade tiver sido salva, o campo traduzido também será mantido. Um valor 
a ser observado é que os valores do idioma padrão que não foram substituídos serão 
preservados::

    // Saídas 'Este é o conteúdo'
    echo $article->body;

    // Saídas 'Mi primer Artículo'
    echo $article->title;

Depois de substituir o valor, a conversão para esse campo será salva e poderá ser recuperada como 
de costume::

    $article->body = 'El contendio';
    $this->Articles->save($article);

A segunda maneira de usar para salvar entidades em outro idioma é definir o idioma padrão 
diretamente para a tabela::

    $article->title = 'Mi Primer Artículo';

    // Use locale() anterior à 3.6
    $this->Articles->setLocale('es');
    $this->Articles->save($article);

Definir o idioma diretamente na tabela é útil quando você precisa recuperar e salvar entidades 
para o mesmo idioma ou quando você precisa salvar várias entidades ao mesmo tempo.

.. _saving-multiple-translations:

Salvando Várias Traduções
=========================

É um requisito comum poder adicionar ou editar várias traduções em qualquer registro do banco de 
dados ao mesmo tempo. Isso pode ser feito usando o ``TranslateTrait``::

    use Cake\ORM\Behavior\Translate\TranslateTrait;
    use Cake\ORM\Entity;

    class Article extends Entity
    {
        use TranslateTrait;
    }

Agora, você pode preencher as traduções antes de salvá-las::

    $translations = [
        'fr' => ['title' => "Un article"],
        'es' => ['title' => 'Un artículo']
    ];

    foreach ($translations as $lang => $data) {
        $article->translation($lang)->set($data, ['guard' => false]);
    }

    $this->Articles->save($article);

A partir do 3.3.0, o trabalho com várias traduções foi simplificado. Você pode criar controles de 
formulário para seus campos traduzidos::

    // Em um template.
    <?= $this->Form->create($article); ?>
    <fieldset>
        <legend>French</legend>
        <?= $this->Form->control('_translations.fr.title'); ?>
        <?= $this->Form->control('_translations.fr.body'); ?>
    </fieldset>
    <fieldset>
        <legend>Spanish</legend>
        <?= $this->Form->control('_translations.es.title'); ?>
        <?= $this->Form->control('_translations.es.body'); ?>
    </fieldset>

No seu controlador, você pode organizar os dados normalmente::

    $article = $this->Articles->newEntity($this->request->getData());
    $this->Articles->save($article);

Isso resultará no seu artigo, que todas as traduções em francês e espanhol serão mantidas.
Você precisará se lembrar de adicionar ``_translations`` aos campos ``$ _accessible`` 
da sua entidade também.

Validando Entidades Traduzidas
------------------------------

Ao anexar ``TranslateBehavior`` a um modelo, você pode definir o validador que deve ser 
usado quando os registros de conversão são criados/modificados pelo comportamento durante 
``newEntity()`` ou ``patchEntity()``::

    class ArticlesTable extends Table
    {
        public function initialize(array $config)
        {
            $this->addBehavior('Translate', [
                'fields' => ['title'],
                'validator' => 'translated'
            ]);
        }
    }

O texto acima usará o validador criado por ``validationTranslated`` para entidades traduzidas validadas.

.. versionadded:: 3.3.0
    A validação de entidades traduzidas e o salvamento simplificado da tradução foram adicionados 
    no 3.3.0
