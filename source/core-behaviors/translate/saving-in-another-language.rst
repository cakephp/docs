6.3.6 Saving in another language
--------------------------------

You can force the model which is using the TranslateBehavior to
save in a language other than the on detected.

To tell a model in what language the content is going to be you
simply change the value of the ``$locale`` property on the model
before you save the data to the database. You can do that either in
your controller or you can define it directly in the model.

**Example A:** In your controller
::

    <?php
    class PostsController extends AppController {
        var $name = 'Posts';
        
        function add() {
            if ($this->data) {
                $this->Post->locale = 'de_de'; // we are going to save the german version
                $this->Post->create();
                if ($this->Post->save($this->data)) {
                    $this->redirect(array('action' => 'index'));
                }
            }
        }
    }
    ?>


#. ``<?php``
#. ``class PostsController extends AppController {``
#. ``var $name = 'Posts';``
#. ````
#. ``function add() {``
#. ``if ($this->data) {``
#. ``$this->Post->locale = 'de_de'; // we are going to save the german version``
#. ``$this->Post->create();``
#. ``if ($this->Post->save($this->data)) {``
#. ``$this->redirect(array('action' => 'index'));``
#. ``}``
#. ``}``
#. ``}``
#. ``}``
#. ``?>``

**Example B:** In your model
::

    <?php
    class Post extends AppModel {
        var $name = 'Post';
        var $actsAs = array(
            'Translate' => array(
                'name'
            )
        );
        
        // Option 1) just define the property directly
        var $locale = 'en_us';
        
        // Option 2) create a simple method 
        function setLanguage($locale) {
            $this->locale = $locale;
        }
    }
    ?>


#. ``<?php``
#. ``class Post extends AppModel {``
#. ``var $name = 'Post';``
#. ``var $actsAs = array(``
#. ``'Translate' => array(``
#. ``'name'``
#. ``)``
#. ``);``
#. ````
#. ``// Option 1) just define the property directly``
#. ``var $locale = 'en_us';``
#. ````
#. ``// Option 2) create a simple method``
#. ``function setLanguage($locale) {``
#. ``$this->locale = $locale;``
#. ``}``
#. ``}``
#. ``?>``

6.3.6 Saving in another language
--------------------------------

You can force the model which is using the TranslateBehavior to
save in a language other than the on detected.

To tell a model in what language the content is going to be you
simply change the value of the ``$locale`` property on the model
before you save the data to the database. You can do that either in
your controller or you can define it directly in the model.

**Example A:** In your controller
::

    <?php
    class PostsController extends AppController {
        var $name = 'Posts';
        
        function add() {
            if ($this->data) {
                $this->Post->locale = 'de_de'; // we are going to save the german version
                $this->Post->create();
                if ($this->Post->save($this->data)) {
                    $this->redirect(array('action' => 'index'));
                }
            }
        }
    }
    ?>


#. ``<?php``
#. ``class PostsController extends AppController {``
#. ``var $name = 'Posts';``
#. ````
#. ``function add() {``
#. ``if ($this->data) {``
#. ``$this->Post->locale = 'de_de'; // we are going to save the german version``
#. ``$this->Post->create();``
#. ``if ($this->Post->save($this->data)) {``
#. ``$this->redirect(array('action' => 'index'));``
#. ``}``
#. ``}``
#. ``}``
#. ``}``
#. ``?>``

**Example B:** In your model
::

    <?php
    class Post extends AppModel {
        var $name = 'Post';
        var $actsAs = array(
            'Translate' => array(
                'name'
            )
        );
        
        // Option 1) just define the property directly
        var $locale = 'en_us';
        
        // Option 2) create a simple method 
        function setLanguage($locale) {
            $this->locale = $locale;
        }
    }
    ?>


#. ``<?php``
#. ``class Post extends AppModel {``
#. ``var $name = 'Post';``
#. ``var $actsAs = array(``
#. ``'Translate' => array(``
#. ``'name'``
#. ``)``
#. ``);``
#. ````
#. ``// Option 1) just define the property directly``
#. ``var $locale = 'en_us';``
#. ````
#. ``// Option 2) create a simple method``
#. ``function setLanguage($locale) {``
#. ``$this->locale = $locale;``
#. ``}``
#. ``}``
#. ``?>``
