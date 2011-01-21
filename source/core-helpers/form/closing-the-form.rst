7.3.2 Closing the Form
----------------------

The FormHelper also includes an ``end()`` method that completes the
form markup. Often, ``end()`` only outputs a closing form tag, but
using ``end()`` also allows the FormHelper to insert needed hidden
form elements other methods may be depending on.

::

    <?php echo $this->Form->create(); ?>
     
    <!-- Form elements go here -->
     
    <?php echo $this->Form->end(); ?>


#. ``<?php echo $this->Form->create(); ?>``
#. ````
#. ``<!-- Form elements go here -->``
#. ````
#. ``<?php echo $this->Form->end(); ?>``

If a string is supplied as the first parameter to ``end()``, the
FormHelper outputs a submit button named accordingly along with the
closing form tag.

::

    <?php echo $this->Form->end('Finish'); ?>
     


#. ``<?php echo $this->Form->end('Finish'); ?>``

Will output:

::

     
    <div class="submit">
        <input type="submit" value="Finish" />
    </div>
    </form>

You can specify detail settings by passing an array to ``end()``.

::

    <?php 
    $options = array(
        'label' => 'Update',
        'value' => 'Update!',
        'div' => array(
            'class' => 'glass-pill',
        )
    );
    echo $this->Form->end($options);


#. ``<?php``
#. ``$options = array(``
#. ``'label' => 'Update',``
#. ``'value' => 'Update!',``
#. ``'div' => array(``
#. ``'class' => 'glass-pill',``
#. ``)``
#. ``);``
#. ``echo $this->Form->end($options);``

Will output:

::

    <div class="glass-pill"><input type="submit" value="Update!" name="Update"></div>

See the `API <http://api.cakephp.org>`_ for further details.

7.3.2 Closing the Form
----------------------

The FormHelper also includes an ``end()`` method that completes the
form markup. Often, ``end()`` only outputs a closing form tag, but
using ``end()`` also allows the FormHelper to insert needed hidden
form elements other methods may be depending on.

::

    <?php echo $this->Form->create(); ?>
     
    <!-- Form elements go here -->
     
    <?php echo $this->Form->end(); ?>


#. ``<?php echo $this->Form->create(); ?>``
#. ````
#. ``<!-- Form elements go here -->``
#. ````
#. ``<?php echo $this->Form->end(); ?>``

If a string is supplied as the first parameter to ``end()``, the
FormHelper outputs a submit button named accordingly along with the
closing form tag.

::

    <?php echo $this->Form->end('Finish'); ?>
     


#. ``<?php echo $this->Form->end('Finish'); ?>``

Will output:

::

     
    <div class="submit">
        <input type="submit" value="Finish" />
    </div>
    </form>

You can specify detail settings by passing an array to ``end()``.

::

    <?php 
    $options = array(
        'label' => 'Update',
        'value' => 'Update!',
        'div' => array(
            'class' => 'glass-pill',
        )
    );
    echo $this->Form->end($options);


#. ``<?php``
#. ``$options = array(``
#. ``'label' => 'Update',``
#. ``'value' => 'Update!',``
#. ``'div' => array(``
#. ``'class' => 'glass-pill',``
#. ``)``
#. ``);``
#. ``echo $this->Form->end($options);``

Will output:

::

    <div class="glass-pill"><input type="submit" value="Update!" name="Update"></div>

See the `API <http://api.cakephp.org>`_ for further details.
