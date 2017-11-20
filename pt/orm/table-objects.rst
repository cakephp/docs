Objetos de tabela
#################

.. note::
    Atualmente, a documentação desta página não é suportada em português.

    Por favor, sinta-se a vontade para nos enviar um *pull request* para o
    `Github <https://github.com/cakephp/docs>`_ ou use o botão
    **IMPROVE THIS DOC** para propor suas mudanças diretamente.

    Você pode consultar a versão em inglês deste tópico através do seletor de
    idiomas localizado ao lado direito do campo de buscas da documentação.

.. _table-callbacks:

Lifecycle Callbacks
===================

Behaviors
=========

.. php:method:: addBehavior($name, array $options = [])

.. start-behaviors

Behaviors fornecem uma maneira fácil de criar partes de lógica horizontalmente
reutilizáveis relacionadas às classes de tabela. Você pode estar se perguntando
por que os behaviors são classes regulares e não traits. O principal motivo para
isso é event listeners. Enquanto as traits permitiriam partes reutilizáveis de
lógica, eles complicariam ligar os eventos.

Para adicionar um behavior à sua tabela, você pode chamar o método ``addBehavior()``.
Geralmente o melhor lugar para fazer isso está no método ``initialize()``::

    namespace App\Model\Table;

    use Cake\ORM\Table;

    class ArticlesTable extends Table
    {
        public function initialize(array $config)
        {
            $this->addBehavior('Timestamp');
        }
    }

Como acontece com as associações, você pode usar :term:`sintaxe plugin` e fornecer
opções de configuração adicionais::

    namespace App\Model\Table;

    use Cake\ORM\Table;

    class ArticlesTable extends Table
    {
        public function initialize(array $config)
        {
            $this->addBehavior('Timestamp', [
                'events' => [
                    'Model.beforeSave' => [
                        'created_at' => 'new',
                        'modified_at' => 'always'
                    ]
                ]
            ]);
        }
    }

.. end-behaviors

Você pode descobrir mais sobre behavior, incluindo os behaviors fornecidos
pelo CakePHP no capítulo sobre :doc:`/orm/behaviors`.

.. _configuring-table-connections:

Configurando Conexões
=====================
