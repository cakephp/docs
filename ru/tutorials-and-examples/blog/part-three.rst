Пример создания блога - Часть 3
###############################

Создание дерева категорий
=========================

Давайте продолжим создание нашего приложения блога и представим, что мы хотим
добавить категории для наших статей. Мы хотим, чтобы категории были
упорядочены, и для этого мы используем 
:doc:`поведение Дерево </orm/behaviors/tree>` для помощи в построении иерархии. 

Но сначала нам нужно изменить наши таблицы.

Плагин Миграций
===============

Мы используем `плагин миграций <https://github.com/cakephp/migrations>`_ для
создания таблицы в нашей базе данных. Если у вас уже создана таблица 'articles'
в вашей базе данных, удалите ее.

Откройте файл **composer.json** вашего приложения. Вероятно вы увидите, что
плагин миграций уже находится внутри  ``require``. В противном случае добавьте
нужную строку выполнив команду::

    composer require cakephp/migrations:~1.0

Плагин миграций теперь будет находиться в папке **plugins** вашего приложения.
Также добавьте строку ``Plugin::load('Migrations');`` в файл **bootstrap.php**.

Как только плагин загружен выполните следующую команду для создания файла
миграции::

    bin/cake bake migration CreateArticles title:string body:text category_id:integer created modified

Файл миграции будет создан в папке **/config/Migrations** со следующим содержимым::

    <?php

    use Migrations\AbstractMigration;

    class CreateArticles extends AbstractMigration
    {
        public function change()
        {
            $table = $this->table('articles');
            $table->addColumn('title', 'string', [
                'default' => null,
                'limit' => 255,
                'null' => false,
            ]);
            $table->addColumn('body', 'text', [
                'default' => null,
                'null' => false,
            ]);
            $table->addColumn('category_id', 'integer', [
                'default' => null,
                'limit' => 11,
                'null' => false,
            ]);
            $table->addColumn('created', 'datetime', [
                'default' => null,
                'null' => false,
            ]);
            $table->addColumn('modified', 'datetime', [
                'default' => null,
                'null' => false,
            ]);
            $table->create();
        }
    }

Для создания таблицы ``categories`` выполните еще одну команду. Если вам нужно
определить длину поля, вы можете сделать это используя квадратные скобки после
указания типа поля::

    bin/cake bake migration CreateCategories parent_id:integer lft:integer[10] rght:integer[10] name:string[100] description:string created modified

Это создаст следующий файл в папке **config/Migrations**::

    <?php

    use Migrations\AbstractMigration;

    class CreateCategories extends AbstractMigration
    {
        public function change()
        {
            $table = $this->table('categories');
            $table->addColumn('parent_id', 'integer', [
                'default' => null,
                'limit' => 11,
                'null' => false,
            ]);
            $table->addColumn('lft', 'integer', [
                'default' => null,
                'limit' => 10,
                'null' => false,
            ]);
            $table->addColumn('rght', 'integer', [
                'default' => null,
                'limit' => 10,
                'null' => false,
            ]);
            $table->addColumn('name', 'string', [
                'default' => null,
                'limit' => 100,
                'null' => false,
            ]);
            $table->addColumn('description', 'string', [
                'default' => null,
                'limit' => 255,
                'null' => false,
            ]);
            $table->addColumn('created', 'datetime', [
                'default' => null,
                'null' => false,
            ]);
            $table->addColumn('modified', 'datetime', [
                'default' => null,
                'null' => false,
            ]);
            $table->create();
        }
    }

Теперь, когда файлы миграции созданы, вы можете отредактировать их перед
созданием ваших таблиц. Нам нужно изменить значение ``'null' => false``
для поля ``parent_id`` на ``'null' => true``, потому что категории верхнего
уровня имеют значение ``parent_id`` равное null.

Для создания ваших таблиц выполните следующую команду::

    bin/cake migrations migrate

Доработка таблиц
================

После создания таблиц мы теперь можем сконцентрироваться на добавлении
категорий для наших статей.

Мы предполагаем, что у вас уже существуют все необходимые файлы (Таблицы,
Контроллеры, Шаблоны статей) из части 2. Так что мы просто добавим связи
к категориям.

Нам нужно связать таблицы Articles и Categories. Откройте файл
**src/Model/Table/ArticlesTable.php** и добавьте туда следующее::

	// src/Model/Table/ArticlesTable.php

    namespace App\Model\Table;

    use Cake\ORM\Table;

    class ArticlesTable extends Table
    {
        public function initialize(array $config)
        {
            $this->addBehavior('Timestamp');
            // Просто добавьте связь belongsTo с таблицей CategoriesTable
            $this->belongsTo('Categories', [
                'foreignKey' => 'category_id',
            ]);
        }
    }

Генерирование шаблонного кода для категорий
===========================================

Создайте все необходимые файлы с помощью команд bake::

    bin/cake bake model Categories
    bin/cake bake controller Categories
    bin/cake bake template Categories

Вы также можете сделать все это одной командой::

    bin/cake bake all Categories

Bake создал все необходимве файлы с нужным содержимым. Вы можете бегло изучить
их если хотите освежить в памяти принцип работы CakePHP.

.. note::
    Если вы пользуетесь Windows не забудьте  использовать \\ вместо /.

Вам придется внести следующие правки в **src/Template/Categories/add.ctp**
и в **src/Template/Categories/edit.ctp**::

    echo $this->Form->input('parent_id', [
        'options' => $parentCategories,
        'empty' => 'Нет родительской категории'
    ]);

Привязка TreeBehavior к CategoriesTable
=======================================

:doc:`TreeBehavior </orm/behaviors/tree>` помогает вам управлять структурой
иерархического Дерева в таблице базы данных. Оно использует `MPTT логику
<http://www.sitepoint.com/hierarchical-data-database-2/>`_ для управления
данными. Структура дерева MPTT оптимизирована для операций чтения, что зачастую
делает ее хорошим выбором для чтения таких ресурсоемких приложений, как блоги.

Если вы откроете файл **src/Model/Table/CategoriesTable.php**, вы увидите,
что поведение TreeBehavior было привязано к таблице CategoriesTable внутри
метода ``initialize()``. Bake добавляет это поведение к любым таблицам,
содержащим поля ``lft`` и ``rght``::

    $this->addBehavior('Tree');

С привязанным TreeBehavior вам будут доступны такие возможности, как изменение
порядка категорий. Мы скоро это увидим.

А пока что вы должны удалить следующие инпуты в файлах шаблонов 'add' и 'edit'
в папке Categories::

    echo $this->Form->input('lft');
    echo $this->Form->input('rght');

В добавок к этому вы должны удалить или закомментировать опцию requirePresence
в валидаторе для полей ``lft`` и ``rght`` в вашей модели CategoriesTable::

    public function validationDefault(Validator $validator)
    {
        $validator
            ->add('id', 'valid', ['rule' => 'numeric'])
            ->allowEmpty('id', 'create');

        $validator
            ->add('lft', 'valid', ['rule' => 'numeric'])
        //    ->requirePresence('lft', 'create')
            ->notEmpty('lft');

        $validator
            ->add('rght', 'valid', ['rule' => 'numeric'])
        //    ->requirePresence('rght', 'create')
            ->notEmpty('rght');
    }

Эти поля автоматически управляются поведением TreeBehavior при сохранении
категории.

Используя ваш веб-браузер добавьте какие-нибудь новые категории с помощью
экшена ``/yoursite/categories/add``.

Изменение порядка категорий с TreeBehavior
==========================================

В вашем файле шаблона 'index', вы можете выводить список категорий и менять их
иерархию.

Давайте изменим метод index в вашем **CategoriesController.php** и добавим
методы ``moveUp()`` и ``moveDown()`` для возможности изменять расположение
категорий в дереве::

    class CategoriesController extends AppController
    {
        public function index()
        {
            $categories = $this->Categories->find()
                ->order(['lft' => 'ASC']);
            $this->set(compact('categories'));
            $this->set('_serialize', ['categories']);
        }

        public function moveUp($id = null)
        {
            $this->request->allowMethod(['post', 'put']);
            $category = $this->Categories->get($id);
            if ($this->Categories->moveUp($category)) {
                $this->Flash->success('Категория была перемещена вверх.');
            } else {
                $this->Flash->error('Категория не может быть перемещена вверх.
                					Пожалуйста, попробуйте еще раз.');
            }
            return $this->redirect($this->referer(['action' => 'index']));
        }

        public function moveDown($id = null)
        {
            $this->request->allowMethod(['post', 'put']);
            $category = $this->Categories->get($id);
            if ($this->Categories->moveDown($category)) {
                $this->Flash->success('Категория была перемещена вниз.');
            } else {
                $this->Flash->error('Категория не может быть перемещена вниз.
                					Пожалуйста, попробуйте еще раз.');
            }
            return $this->redirect($this->referer(['action' => 'index']));
        }
    }

В **src/Template/Categories/index.ctp** замените содержимое на::

    <div class="actions large-2 medium-3 columns">
        <h3><?= __('Действия') ?></h3>
        <ul class="side-nav">
            <li><?= $this->Html->link(__('Новая Категория'), ['action' => 'add']) ?></li>
        </ul>
    </div>
    <div class="categories index large-10 medium-9 columns">
        <table cellpadding="0" cellspacing="0">
        <thead>
            <tr>
                <th>Id</th>
                <th>Id Родителя</th>
                <th>Lft</th>
                <th>Rght</th>
                <th>Имя</th>
                <th>Описание</th>
                <th>Создано</th>
                <th class="actions"><?= __('Действия') ?></th>
            </tr>
        </thead>
        <tbody>
        <?php foreach ($categories as $category): ?>
            <tr>
                <td><?= $category->id ?></td>
                <td><?= $category->parent_id ?></td>
                <td><?= $category->lft ?></td>
                <td><?= $category->rght ?></td>
                <td><?= h($category->name) ?></td>
                <td><?= h($category->description) ?></td>
                <td><?= h($category->created) ?></td>
                <td class="actions">
                    <?= $this->Html->link(__('Просмотреть'), ['action' => 'view', $category->id]) ?>
                    <?= $this->Html->link(__('Изменить'), ['action' => 'edit', $category->id]) ?>
                    <?= $this->Form->postLink(__('Удалить'), ['action' => 'delete', $category->id], ['confirm' => __('Вы уверены, что хотите удалить # {0}?', $category->id)]) ?>
                    <?= $this->Form->postLink(__('Сместить вниз'), ['action' => 'moveDown', $category->id], ['confirm' => __('Вы уверены, что хотите сдвинуть категорию вниз # {0}?', $category->id)]) ?>
                    <?= $this->Form->postLink(__('Сместить вверх'), ['action' => 'moveUp', $category->id], ['confirm' => __('Вы уверены, что хотите сдвинуть категорию вверх # {0}?', $category->id)]) ?>
                </td>
            </tr>
        <?php endforeach; ?>
        </tbody>
        </table>
    </div>


Изменение контроллера ArticlesController
========================================

В нашем ``ArticlesController``, мы будем получать список всех категорий.
Это позволит нам выбирать категорию для стптьия при ее создании и
редактировании::

    // src/Controller/ArticlesController.php

    namespace App\Controller;

    use Cake\Network\Exception\NotFoundException;

    class ArticlesController extends AppController
    {

        // ...

        public function add()
        {
            $article = $this->Articles->newEntity();
            if ($this->request->is('post')) {
                $article = $this->Articles->patchEntity($article, $this->request->getData());
                if ($this->Articles->save($article)) {
                    $this->Flash->success(__('Ваша статья была сохранена.'));
                    return $this->redirect(['action' => 'index']);
                }
                $this->Flash->error(__('Невозможно добавить вашу статью.'));
            }
            $this->set('article', $article);

            // Просто добавляем список категорий для возможности выбора
            // одной категории для статьи
            $categories = $this->Articles->Categories->find('treeList');
            $this->set(compact('categories'));
        }
    }


Доработка шаблонов статей
=========================

Файл add должен выглядеть примерно так:

.. code-block:: php

    <!-- Файл: src/Template/Articles/add.ctp -->

    <h1>Добавить статью</h1>
    <?php
    echo $this->Form->create($article);
    // просто добавили инпут для выбора категорий
    echo $this->Form->input('category_id');
    echo $this->Form->input('title');
    echo $this->Form->input('body', ['rows' => '3']);
    echo $this->Form->button(__('Сохранить статью'));
    echo $this->Form->end();

Когда вы перейдете по адресу `/yoursite/articles/add` вы должны увидеть список
категорий.

.. meta::
    :title lang=ru: Руководство по созданию блога миграции и дерево
    :keywords lang=ru: doc models,миграции,дерево,controller actions,model article,класс php,класс модели,model object,business logic,таблица базы данных,naming convention,bread and butter,callbacks,префиксы,nutshell,interaction,массив,cakephp,интерфейс,applications,delete