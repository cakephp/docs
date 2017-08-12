CakePHP 概览
###################

CakePHP 的设计是为了让共通的网络开发变得更加轻松，简单。通过提供给您一个全能工具箱来让
您很好地整体或者单独地使用它。

这篇概要的目的是介绍CakePHP的一般概念，并且为您介绍这些概念是如何在CakePHP中得到实现
的。如果你急于开始一个项目，你可以 :doc:`开始教程 
</tutorials-and-examples/bookmarks/intro>`, 或者 :doc:`直接参考文档</topics>`.

规约来替代设定
==============================

CakePHP提供的基本构造包括class名，文件名，数据库table名。尽管这些规约需要花一些时间
学习，遵从这些CakePHP为您提供的规约可以让您避免不必要的设定并且拥有一个使各种项目都能
简单使用的应用结构。在 :doc:`规约章节
</intro/conventions>` 囊括了CakePHP需要的各种规约.


模型（Model）层
===============

模型层为您的应用提供了实现业务逻辑的部分。他负责检索数据并且将其转换成对于应用有意义的形
式。包括了处理、验证、表结合以及其它操作数据的任务。

拿社交网络来举例子，Model层将负责像保存用户数据、保存朋友们的关联、存储和检索用户相片、
寻找关于新朋友的建议等等。这些Model对象可以被当作“朋友（Friend）”、“用户（User）”、
“评论（Comment）”、或者是“照片（Photo）”。如果你想要从我们的``users``表中读取一些数据，
我们可以::

    use Cake\ORM\TableRegistry;

    $users = TableRegistry::get('Users');
    $query = $users->find();
    foreach ($query as $row) {
        echo $row->username;
    }

您也许注意到了我们在使用我们的数据之前并不需要写任何代码。通过使用规约，CakePHP将会使用
我们还没有定义的table和entity类（classes）的标准类。

如果我们想要造一个新的User并且将其保存（通过验证），我们可以像如下::

    use Cake\ORM\TableRegistry;

    $users = TableRegistry::get('Users');
    $user = $users->newEntity(['email' => 'mark@example.com']);
    $users->save($user);

视图（View）层
==============

View层会渲染来自Model的数据。通过与Model对象的分离，它能够使用合适的信息来产生你的应
用需要的表示界面。

举个例子，View（视图）可以使用model数据来渲染一个View template（视图模板）包含的HTML，或者在
其它地方使用的XML形式的返回值::

    // In a view template file, we'll render an 'element' for each user.
    <?php foreach ($users as $user): ?>
        <li class="user">
            <?= $this->element('user', ['user' => $user]) ?>
        </li>
    <?php endforeach; ?>

View层提供了很多像 :ref:`view-templates`, :ref:`view-elements`
和 :doc:`/views/cells` 的扩展功能来让您重复利用你的表示逻辑。

View层不仅仅限制于呈现数据的HTML或者文本。它还可以用于传递像JSON、XML、以及任何可通
过插件追加的你需要的结构，比方说CSV。

控制器（Controller）层
====================

Controller层用于处理来自用户的请求。它能够在Model层和View层的帮助下渲染一个回应。

一个Controller可以被看成是一个管理者，它确保完成一个任务的所有资源被正确分配到员工手中。
它等待来自客户的请求，通过身份认证和权限检查来验证它们的合法性，委托Model取得和处理数据，
选择客户所接受的表示数据类型，最后委托View层来完成渲染过程。一个用户注册Controller的例子
将会是::

    public function add()
    {
        $user = $this->Users->newEntity();
        if ($this->request->is('post')) {
            $user = $this->Users->patchEntity($user, $this->request->getData());
            if ($this->Users->save($user, ['validate' => 'registration'])) {
                $this->Flash->success(__('You are now registered.'));
            } else {
                $this->Flash->error(__('There were some problems.'));
            }
        }
        $this->set('user', $user);
    }

你也许注意到了我们从来没有明示地渲染一个视图（view）。CakePHP的规约将负责选择正确的视
图，并且用我们准备的``set()``方法来渲染它。

.. _request-cycle:

CakePHP请求周期
=====================

现在你已经对不同的层有了一定的熟悉，让我回顾一下一个请求周期是如何在CakePHP中运作的:

.. figure:: /_static/img/typical-cake-request.png
   :align: center
   :alt: 该流程图展示了一个典型CakePHP请求

典型的CakePHP请求周期开始于用户请求在你应用中的页面或者资源。在一个很高的层级上各
自的请求都经过以下的步骤:

#. 网页服务器重写导向**webroot/index.php**请求路径的规则。
#. 你的应用程序被加载和绑定到一个``HttpServer``。
#. 你的应用程序的中间件被初始化。
#. 请求和请求结果通过你的应用程序使用的PSR-7中间件进行分配。这通常包括错误捕获和路径导向（路由）。
#. 如果中间件没有返回响应并且请求中包含路由信息，那么表明一个Controller&Action被指定。
#. Controller的Action被调用并且Controller与请求的Models和Components（部件）发生反应。
#. Controller分配给视图（view）一个创建的响应来生成Model数据输出的结果。
#. 视图（view）使用Helpers和Cells来生成响应的头部（headers）和身体（body）内容。
#. 响应结果通过 :doc:`/controllers/middleware`被送回。
#. ``HttpServer`` 向网页服务器放出响应结果。

让我们开始吧
==============

希望这个快速的概览能够激起你的兴趣。一些其它的CakePHP的显著特征是:

* 一个由Memcached, Redis 和其它后端所集成的 :doc:`缓存 </core-libraries/caching>`框架
* 强力的 :doc:`代码生成工具
  </bake/usage>` 让你可以迅速地开始
* :doc:`结合测试框架 </development/testing>` 可以让你确保你的代码完美运行


下一步明显要做的是 :doc:`下载 CakePHP </installation>`, 阅读
:doc:`教程并且制作些很棒的东西
</tutorials-and-examples/bookmarks/intro>`.

Additional Reading
==================

.. toctree::
    :maxdepth: 1

    /intro/where-to-get-help
    /intro/conventions
    /intro/cakephp-folder-structure

.. meta::
    :title lang=en: Getting Started
    :keywords lang=en: folder structure,table names,initial request,database table,organizational structure,rst,filenames,conventions,mvc,web page,sit

