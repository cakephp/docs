3.6.2 Configuring Components
----------------------------

Many of the core components require configuration. Some examples of
components requiring configuration are
`Auth </view/1250/Authentication>`_, `Cookie </view/1280/Cookies>`_
and `Email </view/1283/Email>`_. Configuration for these
components, and for components in general, is usually done in the
``$components`` array or your controller's ``beforeFilter()``
method.

::

    var $components = array(
        'Auth' => array(
            'authorize' => 'controller',
            'loginAction' => array('controller' => 'users', 'action' => 'login')
        ),
        'Cookie' => array('name' => 'CookieMonster')
    );


#. ``var $components = array(``
#. ``'Auth' => array(``
#. ``'authorize' => 'controller',``
#. ``'loginAction' => array('controller' => 'users', 'action' => 'login')``
#. ``),``
#. ``'Cookie' => array('name' => 'CookieMonster')``
#. ``);``

Would be an example of configuring a component with the
``$components`` array. All core components allow their
configuration settings to be set in this way. In addition you can
configure components in your controller's ``beforeFilter()``
method. This is useful when you need to assign the results of a
function to a component property. The above could also be expressed
as:

::

    function beforeFilter() {
        $this->Auth->authorize = 'controller';
        $this->Auth->loginAction = array('controller' => 'users', 'action' => 'login');
        
        $this->Cookie->name = 'CookieMonster';
    }


#. ``function beforeFilter() {``
#. ``$this->Auth->authorize = 'controller';``
#. ``$this->Auth->loginAction = array('controller' => 'users', 'action' => 'login');``
#. ````
#. ``$this->Cookie->name = 'CookieMonster';``
#. ``}``

It's possible, however, that a component requires certain
configuration options to be set before the controller's
``beforeFilter()`` is run. To this end, some components allow
configuration options be set in the ``$components`` array.

::

    var $components = array('DebugKit.toolbar' => array('panels' => array('history', 'session')));


#. ``var $components = array('DebugKit.toolbar' => array('panels' => array('history', 'session')));``

Consult the relevant documentation to determine what configuration
options each component provides.

3.6.2 Configuring Components
----------------------------

Many of the core components require configuration. Some examples of
components requiring configuration are
`Auth </view/1250/Authentication>`_, `Cookie </view/1280/Cookies>`_
and `Email </view/1283/Email>`_. Configuration for these
components, and for components in general, is usually done in the
``$components`` array or your controller's ``beforeFilter()``
method.

::

    var $components = array(
        'Auth' => array(
            'authorize' => 'controller',
            'loginAction' => array('controller' => 'users', 'action' => 'login')
        ),
        'Cookie' => array('name' => 'CookieMonster')
    );


#. ``var $components = array(``
#. ``'Auth' => array(``
#. ``'authorize' => 'controller',``
#. ``'loginAction' => array('controller' => 'users', 'action' => 'login')``
#. ``),``
#. ``'Cookie' => array('name' => 'CookieMonster')``
#. ``);``

Would be an example of configuring a component with the
``$components`` array. All core components allow their
configuration settings to be set in this way. In addition you can
configure components in your controller's ``beforeFilter()``
method. This is useful when you need to assign the results of a
function to a component property. The above could also be expressed
as:

::

    function beforeFilter() {
        $this->Auth->authorize = 'controller';
        $this->Auth->loginAction = array('controller' => 'users', 'action' => 'login');
        
        $this->Cookie->name = 'CookieMonster';
    }


#. ``function beforeFilter() {``
#. ``$this->Auth->authorize = 'controller';``
#. ``$this->Auth->loginAction = array('controller' => 'users', 'action' => 'login');``
#. ````
#. ``$this->Cookie->name = 'CookieMonster';``
#. ``}``

It's possible, however, that a component requires certain
configuration options to be set before the controller's
``beforeFilter()`` is run. To this end, some components allow
configuration options be set in the ``$components`` array.

::

    var $components = array('DebugKit.toolbar' => array('panels' => array('history', 'session')));


#. ``var $components = array('DebugKit.toolbar' => array('panels' => array('history', 'session')));``

Consult the relevant documentation to determine what configuration
options each component provides.
