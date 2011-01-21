7.4.3 Creating breadcrumb trails with HtmlHelper
------------------------------------------------

CakePHP has the built in ability to automatically create a
breadcrumb trail in your app. To set this up, first add something
similar to the following in your layout template.

::

         echo $this->Html->getCrumbs(' > ','Home');

Now, in your view you'll want to add the following to start the
breadcrumb trails on each of the pages.

::

         echo $this->Html->addCrumb('Users', '/users');
         echo $this->Html->addCrumb('Add User', '/users/add');

This will add the output of "**Home > Users > Add User**" in your
layout where getCrumbs was added.

7.4.3 Creating breadcrumb trails with HtmlHelper
------------------------------------------------

CakePHP has the built in ability to automatically create a
breadcrumb trail in your app. To set this up, first add something
similar to the following in your layout template.

::

         echo $this->Html->getCrumbs(' > ','Home');

Now, in your view you'll want to add the following to start the
breadcrumb trails on each of the pages.

::

         echo $this->Html->addCrumb('Users', '/users');
         echo $this->Html->addCrumb('Add User', '/users/add');

This will add the output of "**Home > Users > Add User**" in your
layout where getCrumbs was added.
