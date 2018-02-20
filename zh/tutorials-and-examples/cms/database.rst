CMS 教程 － 创建数据库
####################################

CakePHP 已经安装好，我们可以开始为 :abbr:`CMS (內容管理系統)` 应用建立数据库了。首先建立一个
空的数据库，你可以使用任意的名字，比如 ``cake_cms``。执行以下 SQL 语句来建立需要的数据库表::

    USE cake_cms;

    CREATE TABLE users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        email VARCHAR(255) NOT NULL,
        password VARCHAR(255) NOT NULL,
        created DATETIME,
        modified DATETIME
    );

    CREATE TABLE articles (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        title VARCHAR(255) NOT NULL,
        slug VARCHAR(191) NOT NULL,
        body TEXT,
        published BOOLEAN DEFAULT FALSE,
        created DATETIME,
        modified DATETIME,
        UNIQUE KEY (slug),
        FOREIGN KEY user_key (user_id) REFERENCES users(id)
    ) CHARSET=utf8mb4;

    CREATE TABLE tags (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(191),
        created DATETIME,
        modified DATETIME,
        UNIQUE KEY (title)
    ) CHARSET=utf8mb4;

    CREATE TABLE articles_tags (
        article_id INT NOT NULL,
        tag_id INT NOT NULL,
        PRIMARY KEY (article_id, tag_id),
        FOREIGN KEY tag_key(tag_id) REFERENCES tags(id),
        FOREIGN KEY article_key(article_id) REFERENCES articles(id)
    );

    INSERT INTO users (email, password, created, modified)
    VALUES
    ('cakephp@example.com', 'sekret', NOW(), NOW());

    INSERT INTO articles (user_id, title, slug, body, published, created, modified)
    VALUES
    (1, 'First Post', 'first-post', 'This is the first post.', 1, now(), now());

你也许已经注意到 ``articles_tags`` 表使用了复合主键。CakePHP 几乎支持所有的复合主键，这样便于你
使用比较简单的数据库结构，不用添加额外的 ``id`` 列。

以上所使用的数据表名以及列名都不是随意的。利用 CakePHP 的 :doc:`命名约定 </intro/conventions>`，
我们可以更有效的使用并且避免了配置框架的需要。虽然 CakePHP 的灵活度可以容纳几乎所有的数据库结构，
但是采取约定，利用 CakePHP 提供的默认的约定可以节省你很多的开发时间，

数据库配置
======================

接着我们需要告诉 CakePHP 我们之前创建的数据库地址以及如何连接。在 **config/app.php** 文件中，
找到 ``Datasources.default`` 数组，更改为相对应的值。以下的例子是一个完整的配置数组::


    <?php
    return [
        // More configuration above.
        'Datasources' => [
            'default' => [
                'className' => 'Cake\Database\Connection',
                'driver' => 'Cake\Database\Driver\Mysql',
                'persistent' => false,
                'host' => 'localhost',
                'username' => 'cakephp',
                'password' => 'AngelF00dC4k3~',
                'database' => 'cake_cms',
                'encoding' => 'utf8mb4',
                'timezone' => 'UTC',
                'cacheMetadata' => true,
            ],
        ],
        // More configuration below.
    ];

一旦配置好你的 **config/app.php** 文件以后，你应该看到 'CakePHP is able to connect to 
the database' 的部分也出现一个绿色厨师帽。

.. note::
    
    一份默认的 CakePHP 配置文件可在 **config/app.default.php** 找到。

创建第一个的模型
========================

模型是一个 CakePHP 应用的核心。通过他们，我们能够读取以及修改数据。他们让我们可以将数据关联
起来，验证数据以及运用各种业务逻辑。模型是建立控制器的动作 （action） 和 模块（template）的基石。

CakePHP 的模型是由 ``Table`` and ``Entity`` 两种对象组成。``Table`` 为是一个特定的数据库表
的抽象。他们储存在 **src/Model/Table** 目录中。在本教程中，我们将建立文件 
**src/Model/Table/ArticlesTable.php**。 完成的文件内容如下::


    <?php
    // src/Model/Table/ArticlesTable.php
    namespace App\Model\Table;

    use Cake\ORM\Table;

    class ArticlesTable extends Table
    {
        public function initialize(array $config)
        {
            $this->addBehavior('Timestamp');
        }
    }

我们附属了 :doc:`/orm/behaviors/timestamp` 行为 （behavior）。此行为将会帮助我们自动填充
被附属的数据库表的 ``created`` 列 和 ``modified`` 列。利用 CakePHP 的命名约定，我们取其名为 ``ArticlesTable``，
这样 CakePHP 便可自动找到 ``articles`` 数据库表。同样利用命名约定，CakePHP 默认 ``id`` 为主键。
 
.. note::
	
	如果一个模型的定义文件在 **src/Model/Table** 目录中缺失， CakePHP 会动态的建立一个模型对象。
	这代表着，如果我们不小心写错文件名（比如错写成 articlestable.php 或者 ArticleTable.php），
	CakePHP 将无法读取你的设置，而是使用动态生成的模型。

我们也需要为 Articles 创建一个 Entity 的类。Entity 是数据库表中单个记录的抽象，它提供数据库行层面的
行为。在本教程中，我们将建立文件 **src/Model/Entity/Article.php**。 完成的文件内容如下::


    <?php
    // src/Model/Entity/Article.php
    namespace App\Model\Entity;

    use Cake\ORM\Entity;

    class Article extends Entity
    {
        protected $_accessible = [
            '*' => true,
            'id' => false,
            'slug' => false,
        ];
    }

以上的 Entity 目前比较单一，我们仅仅建立了 ``_accessible`` 属性。它规定了此类的各种属性的控制规则
:ref:`entities-mass-assignment`。

目前为止，我们的模型都很简单，接下来我们将创建我们的第一个 :doc:`控制器和模版 </tutorials-and-examples/cms/articles-controller>`。
