Request and Response objects
############################

Request properties

.. php:attr:: params

Controller parameters are available at ``$this->params`` in your
CakePHP controller. This variable is used to provide access to
information about the current request. The most common usage of
``$this->params`` is to get access to information that has been
handed to the controller via POST or GET operations.

form
^^^^

``$this->params['form']``

Any POST data from any form is stored here, including information
also found in ``$_FILES``.

admin
^^^^^

``$this->params['admin']``

Is set to 1 if the current action was invoked via admin routing.

bare
^^^^

``$this->params['bare']``

Stores 1 if the current layout is empty, 0 if not.

isAjax
^^^^^^

``$this->params['isAjax']``

Stores 1 if the current request is an ajax call, 0 if not. This
variable is only set if the RequestHandler Component is being used
in the controller.

controller
^^^^^^^^^^

``$this->params['controller']``

Stores the name of the current controller handling the request. For
example, if the URL /posts/view/1 was requested,
``$this->params['controller']`` would equal "posts".

action
^^^^^^

``$this->params['action']``

Stores the name of the current action handling the request. For
example, if the URL /posts/view/1 was requested,
``$this->params['action']`` would equal "view".

pass
^^^^

``$this->params['pass']``

Returns an array (numerically indexed) of URL parameters after the
Action.

::

    // URL: /posts/view/12/print/narrow

    Array
    (
        [0] => 12
        [1] => print
        [2] => narrow
    )

url
^^^

``$this->params['url']``

Stores the current URL requested, along with key-value pairs of get
variables. For example, if the URL /posts/view/?var1=3&var2=4 was
called, ``$this->params['url']`` would contain:

::

    [url] => Array
    (
        [url] => posts/view
        [var1] => 3
        [var2] => 4
    )

data
^^^^

``$this->data``

Used to handle POST data sent from the FormHelper forms to the
controller.

::

    // The FormHelper is used to create a form element:
    $form->text('User.first_name');

Which when rendered, looks something like:

::


    <input name="data[User][first_name]" value="" type="text" />

When the form is submitted to the controller via POST, the data
shows up in ``this->data``

::


    //The submitted first name can be found here:
    $this->data['User']['first_name'];

prefix
^^^^^^

``$this->params['prefix']``

Set to the routing prefix. For example, this attribute would
contain the string "admin" during a request to
/admin/posts/someaction.

named
^^^^^

``$this->params['named']``

Stores any named parameters in the url query string in the form
/key:value/. For example, if the URL /posts/view/var1:3/var2:4 was
requested, ``$this->params['named']`` would be an array
containing:

::

    [named] => Array
    (
        [var1] => 3
        [var2] => 4
    )
