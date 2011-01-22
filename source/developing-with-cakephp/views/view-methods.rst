3.10.4 View methods
-------------------

View methods are accessible in all view, element and layout files.
To call any view method use ``$this->method()``

set()
~~~~~

``set(string $var, mixed $value)``

Views have a ``set()`` method that is analogous to the ``set()``
found in Controller objects. It allows you to add variables to the
. Using set() from your view file will add the variables to the
layout and elements that will be rendered later. See
:doc:`/developing-with-cakephp/controllers/controller-methods` for more
information on using set().

In your view file you can do

::

        $this->set('activeMenuButton', 'posts');

Then in your layout the ``$activeMenuButton`` variable will be
available and contain the value 'posts'.

getVar()
~~~~~~~~

``getVar(string $var)``

Gets the value of the viewVar with the name $var

getVars()
~~~~~~~~~

``getVars()``

Gets a list of all the available view variables in the current
rendering scope. Returns an array of variable names.

error()
~~~~~~~

``error(int $code, string $name, string $message)``

Displays an error page to the user. Uses layouts/error.ctp to
render the page.

::

        $this->error(404, 'Not found', 'This page was not found, sorry');

This will render an error page with the title and messages
specified. Its important to note that script execution is not
stopped by ``View::error()`` So you will have to stop code
execution yourself if you want to halt the script.

element()
~~~~~~~~~

``element(string $elementPath, array $data, bool $loadHelpers)``

Renders an element or view partial. See the section on
:doc:`/developing-with-cakephp/views/elements` for more information and
examples.

uuid
~~~~

``uuid(string $object, mixed $url)``

Generates a unique non-random DOM ID for an object, based on the
object type and url. This method is often used by helpers that need
to generate unique DOM ID's for elements such as the AjaxHelper.

::

        $uuid = $this->uuid('form', array('controller' => 'posts', 'action' => 'index'));
        //$uuid contains 'form0425fe3bad'

addScript()
~~~~~~~~~~~

``addScript(string $name, string $content)``

Adds content to the internal scripts buffer. This buffer is made
available in the layout as ``$scripts_for_layout``. This method is
helpful when creating helpers that need to add javascript or css
directly to the layout. Keep in mind that scripts added from the
layout, or elements in the layout will not be added to
``$scripts_for_layout``. This method is most often used from inside
helpers, like the :doc:`/core-helpers/javascript` and
:doc:`/core-helpers/html` Helpers.
