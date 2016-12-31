Helpers
#######

Helpers are meant to provide functions that are commonly needed in views
to format and present data in useful ways.

HTML
====

Introduction
------------

The HTML helper is one of Cake's ways of making development less
monotonous and more rapid. The HTML helper has two main goals: to aid in
the insertion of often-repeated sections of HTML code, and to aid in the
quick-and-easy creation of web forms. The following sections will walk
you through the most important functions in the helper, but remember
https://api.cakephp.org should always be used as a final reference.

Many of the functions in the HTML helper make use of a HTML tag
definition file called **tags.ini.php**. Cake's core configuration
contains a tags.ini.php, but if you'd like to make some changes, create
a copy of **/cake/config/tags.ini.php** and place it in your
**/app/config/** folder. The HTML helper uses the tag definitions in
this file to generate tags you request. Using the HTML helper to create
some of your view code can be helpful, as a change to the tags.ini.php
file will result in a site-wide cascading change.

Additionally, if AUTO\_OUTPUT is set to true in your core config file
for your application (**/app/config/core.php**), the helper will
automatically output the tag, rather than returning the value. This has
been done in an effort to assuage those who dislike short tags (<?= ?>)
or lots of echo() calls in their view code. Functions that include the
$return parameter allow you to force-override the settings in your core
config. Set $return to true if you'd like the HTML helper to return the
HTML code regardless of any AUTO\_OUTPUT settings.

HTML helper functions also include a $htmlAttributes parameter, that
allow you to tack on any extra attributes on your tags. For example, if
you had a tag you'd like to add a class attribute to, you'd pass this as
the $htmlAttribute value::

    array('class'=>'someClass')

Inserting Well-Formatted elements
---------------------------------

If you'd like to use Cake to insert well-formed and often-repeated
elements in your HTML code, the HTML helper is great at doing that.
There are functions in this helper that insert media, aid with tables,
and there's even guiListTree which creates an unordered list based on a
PHP array.

-  **charset**
-  string *$charset*
-  boolean *$return*

This is used to generate a charset META-tag.

-  **css**
-  string *$path*
-  string *$rel = 'stylesheet'*
-  array *$htmlAttributes*
-  boolean *$return = false*

Creates a link to a CSS stylesheet. The $rel parameter allows you to
provide a rel= value for the tag.

-  **image**
-  string *$path*
-  array *$htmlAttributes*
-  boolean *$return = false*

Renders an image tag. The code returned from this function can be used
as an input for the link() function to automatically create linked
images.

-  **link**
-  string *$title*
-  string *$url*
-  array *$htmlAttributes*
-  string *$confirmMessage = false*
-  boolean *$escapeTitle = true*
-  boolean *$return = false*

Use this function to create links in your view. $confirmMessage is used
when you need a JavaScript confirmation message to appear once the link
is clicked. For example, a link that deletes an object should probably
have a "Are you sure?" type message to confirm the action before the
link is activated. Set $escapeTitle to true if you'd like to have the
HTML helper escape the data you handed it in the $title variable.

-  **tableHeaders**
-  array *$names*
-  array *$tr\_options*
-  array *$th\_options*

Used to create a formatted table header.

-  **tableCells**
-  array *$data*
-  array *$odd\_tr\_options*
-  array *$even\_tr\_options*

Used to create a formatted set of table cells.

-  **guiListTree**
-  array *$data*
-  array *$htmlAttributes*
-  string *$bodyKey = 'body'*
-  string *$childrenKey = 'children'*
-  boolean *$return = false*

Generates a nested unordered list tree from an array.

Forms and Validation
--------------------

The HTML helper really shines when it comes to quickening your form code
in your views. It generates all your form tags, automatically fills
values back in during error situations, and spits out error messages. To
help illustrate, let's walk through a quick example. Imagine for a
moment that your application has a Note model, and you want to create
controller logic and a view to add and edit Note objects. In your
NotesController, you would have an edit action that might look something
like the following:

Edit Action inside of the NotesController
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

::

    <?php
    function edit($id)
    {
      //First, let's check to see if any form data has been
      //submitted to the action.
      if (!empty($this->data['Note']))
      {
         //Here's where we try to validate the form data (see Chap. 12)
         //and save it
         if ($this->Note->save($this->data['Note']))
         {
            //If we've successfully saved, take the user
            //to the appropriate place
            $this->flash('Your information has been saved.', '/notes/edit/' . $id);
            exit();
         }
         else
         {

            //Generate the error messages for the appropriate fields
            //this is not really necessary as save already does this, but it is an example
            //call $this->Note->validates($this->data['Note']); if you are not doing a save
            //then use the method below to populate the tagErrorMsg() helper method
            $this->validateErrors($this->Note);

            //And render the edit view code
            $this->render();
         }
      }

      // If we haven't received any form data, get the note we want to edit, and hand
      // its information to the view
      $this->set('note', $this->Note->find("id = $id"));
      $this->render();
    }

Once we've got our controller set up, let's look at the view code (which
would be found in **app/views/notes/edit.thtml**). Our Note model is
pretty simple at this point as it only contains an id, a submitter's id
and a body. This view code is meant to display Note data and allow the
user to enter new values and save that data to the model.

The HTML helper is available in all views by default, and can be
accessed using **$html.**

Specifically, let's just look at the table where the guts of the form
are found:

Edit View code (edit.thtml) sample
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

::

    <!-- This tag creates our form tag -->

    <?php echo $html->formTag('/notes/edit/' . $html->tagValue('Note/id')) ?>

    <table cellpadding="10" cellspacing="0">
    <tr>
       <td align="right">Body: </td>
       <td>

          <!-- Here's where we use the HTML helper to render the text
               area tag and its possible error message the $note
               variable was created by the controller, and contains
               the data for the note we're editing. -->
          <?php echo
          $html->textarea('Note/body', array('cols'=>'60', 'rows'=>'10'));
          ?>
          <?php echo $html->tagErrorMsg('Note/body',
          'Please enter in a body for this note.') ?>
       </td>
    </tr>
    <tr>
       <td></td>
       <td>

          <!-- We can also use the HTML helper to include
               hidden tags inside our table -->

          <?php echo $html->hidden('Note/id')?>
          <?php echo $html->hidden('note/submitter_id', $this->controller->Session->read('User.id'))?>
       </td>
    </tr>
    </table>

    <!-- And finally, the submit button-->
    <?php echo $html->submit()?>

    </form>

Most of the form tag generating functions (along with tagErrorMsg)
require you to supply a $fieldName. This $fieldName lets Cake know what
data you are passing so that it can save and validate the data
correclty. The string passed in the $fieldName parameter is in the form
"modelname/fieldname." If you were going to add a new title field to our
Note, you might add something to the view that looked like this:

::

    <?php echo $html->input('Note/title') ?><br />
    <?php echo $html->tagErrorMsg('Note/title', 'Please supply a title for this note.')?>

Error messages displayed by the tagErrorMsg() function are wrapped in
<div class="error\_message"></div> for easy CSS styling.

Here are the form tags the HTML helper can generate (most of them are
straightforward):

-  **submit**
-  string *$buttonCaption*
-  array *$htmlAttributes*
-  boolean *$return = false*

-  **password**
-  string *$fieldName*
-  array *$htmlAttributes*
-  boolean *$return = false*

-  **textarea**
-  string *$fieldName*
-  array *$htmlAttributes*
-  boolean *$return = false*

-  **checkbox**
-  string *$fieldName*
-  string *$title = null*
-  array *$htmlAttributes*
-  boolean *$return = false*

-  **file**
-  string *$fieldName*
-  array *$htmlAttributes*
-  boolean *$return = false*

-  **hidden**
-  string *$fieldName*
-  array *$htmlAttributes*
-  boolean *$return = false*

-  **input**
-  string *$fieldName*
-  array *$htmlAttributes*
-  boolean *$return = false*

-  **radio**
-  string *$fieldName*
-  array *$options*
-  array *$inbetween*
-  array *$htmlAttributes*
-  boolean *$return = false*

-  **tagErrorMsg**
-  string *$fieldName*
-  string *$message*

The HTML helper also includes a set of functions that aid in creating
date-related option tags. The $tagName parameter should be handled in
the same way as the $fieldName parameter. Just provide the name of the
field this date option tag is relevant to. Once the data is processed,
you'll see it in your controller with the part of the date it handles
concatenated to the end of the field name. For example, if my Note had a
deadline field that was a date, and my dayOptionTag $tagName parameter
was set to 'note/deadline', the day data would show up in the $params
variable once the form has been submitted to a controller action::

    <?php
    $this->data['Note']['deadline_day']

You can then use this information to concatenate the time data in a
format that is friendly to your current database configuration. This
code would be placed just before you attempt to save the data, and saved
in the $data array used to save the information to the model.

Pre-populating a form element is done by supplying a 'value' key-value
pair in the $htmlAttributes parameter. For text-based fields, the value
will be shown in the form element. For discrete form elements, supply
the id or key of the element you'd like to have be selected by default::

    <?php
    // Sets the radio element with
    // 'Complete' selected by default.<br />
    $html->radio('Note/status', array('1' => 'Complete', '2' => 'In Progress'), null, array('value' => '1'));

Concatenating time data before saving a model (excerpt from NotesController)
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

::

    <?php
    function edit($id)
       {
          //First, let's check to see if any form data has been submitted to the action.
          if (!empty($this->data['Note']))
          {

             //Concatenate time data for storage...
             $this->data['Note']['deadline'] =
                $this->data['Note']['deadline_year'] . "-" .
                $this->data['Note']['deadline_month'] . "-" .
                $this->data['Note']['deadline_day'];

             //Here's where we try to validate the form data (see Chap. 10) and save it
             if ($this->Note->save($this->data['Note']))
             {

             ...

#. dayOptionTag ($tagName, $value=null, $selected=null,
   $optionAttr=null)

#. yearOptionTag ($tagName, $value=null, $minYear=null, $maxYear=null,
   $selected=null, $optionAttr=null)

#. monthOptionTag ($tagName, $value=null, $selected=null,
   $optionAttr=null)

#. hourOptionTag ($tagName, $value=null, $format24Hours=false,
   $selected=null, $optionAttr=null)

#. minuteOptionTag ($tagName, $value=null, $selected=null,
   $optionAttr=null)

#. meridianOptionTag ($tagName, $value=null, $selected=null,
   $optionAttr=null)

#. dateTimeOptionTag ($tagName, $dateFormat= 'DMY', $timeFormat= '12',
   $selected=null, $optionAttr=null)

AJAX
====

The Cake Ajax helper utilizes the ever-popular Prototype and
script.aculo.us libraries for Ajax operations and client side effects.
In order to use this helper, you must have a current version of the
JavaScript libraries from http://script.aculo.us placed in
**/app/webroot/js/**. In addition, any views that plan to use the Ajax
Helper will need to include those libraries.

Most of the functions in this helper expect a special $options array as
a parameter. This array is used to specify different things about your
Ajax operation. Here are the different values you can specify:

AjaxHelper Options
------------------

General Options
~~~~~~~~~~~~~~~

+---------------+--------------------------------------------------------------------------------------------------+
| url           | The URL for the action you want to be called                                                     |
+---------------+--------------------------------------------------------------------------------------------------+
| 'frequency'   | The number of seconds between remoteTimer() or observeField() checks are made.                   |
+---------------+--------------------------------------------------------------------------------------------------+
| 'update'      | The DOM ID of the element you wish to update with the results of an Ajax operation.              |
+---------------+--------------------------------------------------------------------------------------------------+
| 'with'        | The DOM ID of the form element you wish to serialize and send with an Ajax form submission.      |
+---------------+--------------------------------------------------------------------------------------------------+
| 'type'        | Either 'asynchronous' (default), or 'synchronous'. Allows you to pick between operation types.   |
+---------------+--------------------------------------------------------------------------------------------------+

Callbacks
~~~~~~~~~

JavaScript code to be executed at certain times during the
XMLHttpRequest process.

+-----------------+------------------------------------------------------------------------------------------------------------------------+
| 'loading'       | JS code to be executed when the remote document is being loaded with data by the browser.                              |
+-----------------+------------------------------------------------------------------------------------------------------------------------+
| 'loaded'        | JS code to be executed when the browser has finished loading the remote document.                                      |
+-----------------+------------------------------------------------------------------------------------------------------------------------+
| 'interactive'   | JS code to be executed when the user can interact with the remote document, even though it has not finished loading.   |
+-----------------+------------------------------------------------------------------------------------------------------------------------+
| 'complete'      | JS code to be called when the XMLHttpRequest is complete.                                                              |
+-----------------+------------------------------------------------------------------------------------------------------------------------+
| 'confirm'       | Text to be displayed in a confirmation dialog before a XMLHttpRequest action begins.                                   |
+-----------------+------------------------------------------------------------------------------------------------------------------------+
| 'condition'     | JS condition to be met before the XMLHttpRequest is initiated.                                                         |
+-----------------+------------------------------------------------------------------------------------------------------------------------+
| 'before'        | JS code to be called before request is initiated.                                                                      |
+-----------------+------------------------------------------------------------------------------------------------------------------------+
| 'after'         | JS code to be called immediately after request was initiated and before 'loading'                                      |
+-----------------+------------------------------------------------------------------------------------------------------------------------+

Here are the helper's functions for making Ajax in Cake quick and easy:

-  **link**
-  string *$title*
-  string *$href*
-  array *$options*
-  boolean *$confirm*
-  boolean *$escapeTitle*

Displays linked text $title, which retrieves the remote document at
$options['url'] and updates the DOM element $options['update'].
Callbacks can be used with this function.

-  **remoteFunction**
-  array *$options*

This function creates the JavaScript needed to make a remote call. It is
primarily used as a helper for linkToRemote. This isn't often used
unless you need to generate some custom scripting.

-  **remoteTimer**
-  array *$options*

Periodically calls the specified action at $options['url'], every
$options['frequency'] seconds (default is 10). Usually used to update a
specified div (specified by $options['update']) with the results of the
remote call. Callbacks can be used with this function.

-  **form**
-  string *$action*
-  string *$type*
-  array *$options*

Returns a form tag that will submit to the action at $action using
XMLHttpRequest in the background instead of the regular reload-required
POST submission. The form data from this form will act just as a normal
form data would (i.e. it will be available in $this->params['form']).
The DOM element specified by $options['update'] will be updated with the
resulting remote document. Callbacks can be used with this function.

-  **observeField**
-  string *$field\_id*
-  array *$options*

Observes the field with the DOM ID specified by $field\_id (every
$options['frequency'] seconds) and calls the action at $options['url']
when its contents have changed. You can update a DOM element with ID
$options['update'] or specify a form element using $options['with'] as
well. Callbacks can be used with this function.

-  **observeForm**
-  string *$form\_id*
-  array *$options*

Works the same as observeField(), only this observes all the elements in
a given form.

-  **autoComplete**
-  string *$field*
-  string *$url*
-  array *$options*

Renders a text field with ID $field with autocomplete. The action at
$url should be able to return the autocomplete terms: basically, your
action needs to spit out an unordered list (<ul></ul>) with list items
that are the auto complete terms. If you wanted an autocomplete field
that retrieved the subjects of your blog posts, your controller action
might look something like::

    <?php
    function autocomplete ()
    {
        $this->set('posts',
            $this->Post->findAll(
                "subject LIKE '{$this->data['Post']['subject']}'")
            );
        $this->layout = "ajax";
    }

And your view for the autocomplete() action above would look something
like::

    <ul>
    <?php foreach($posts as $post): ?>
    <li><?php echo $post['Post']['subject']; ?></li>
    <?php endforeach; ?>
    </ul>

The actual auto-complete field as it would look in a view would look
like this::

    <form action="/users/index" method="POST">
        <?php echo $ajax->autoComplete('Post/subject', '/posts/autoComplete')?>
        <?php echo $html->submit('View Post')?>
    </form>

The autoComplete() function will use this information to render a text
field, and some divs that will be used to show the autocomplete terms
supplied by your action. You might also want to style the view with
something like the following::

    <style type="text/css">

    div.auto_complete {
        position         :absolute;
        width            :250px;
        background-color :white;
        border           :1px solid #888;
        margin           :0px;
        padding          :0px;
    }

    li.selected { background-color: #ffb; }

    </style>

-  **drag**
-  string *$id*
-  array *$options*

Makes the DOM element with ID $id draggable. There are some additional
things you can specify using $options (The version numbers refer to
script.aculo.us versions):

+----------------+-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------+
| 'handle'       | (v1.0) Sets whether the element should only be draggable by an embedded handle. The value must be an element reference or element id.                                                                             |
+----------------+-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------+
| 'handle'       | (V1.5) As above, except now the value may be a string referencing a CSS class value. The first child/grandchild/etc. element found within the element that has this CSS class value will be used as the handle.   |
+----------------+-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------+
| 'revert'       | (V1.0) If set to true, the element returns to its original position when the drags ends.                                                                                                                          |
+----------------+-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------+
| 'revert'       | (V1.5) Revert can also be an arbitrary function reference, called when the drag ends.                                                                                                                             |
+----------------+-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------+
| 'constraint'   | If set to horizontal or vertical, the drag will be constrained to take place only horizontally or vertically.                                                                                                     |
+----------------+-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------+

-  **drop**
-  string *$id*
-  array *$options*

Makes the DOM element with ID $id drop-able. There are some additional
things you can specify using $options:

+-----------------+------------------------------------------------------------------------------------------------------------------------------------------------------------------------------+
| 'accept'        | Set accept to a string or a JavaScript array of strings describing CSS classes. The Droppable will only accept Draggables that have one or more of these CSS classes.        |
+-----------------+------------------------------------------------------------------------------------------------------------------------------------------------------------------------------+
| 'containment'   | The droppable element will only accept the draggable element if it is contained in the given elements (or element ids). Can be a single element or a JS array of elements.   |
+-----------------+------------------------------------------------------------------------------------------------------------------------------------------------------------------------------+
| 'overlap'       | If set to horizontal or vertical, the droppable will only react to a draggable element if its overlapping by more than 50% in the given direction.                           |
+-----------------+------------------------------------------------------------------------------------------------------------------------------------------------------------------------------+

-  **dropRemote**
-  string *$id*
-  array *$options*
-  array *$ajaxOptions*

Used to create a drop target that initiates a XMLHttpRequest when a
draggable element is dropped on it. The $options are the same as in
drop(), and the $ajaxOptions are the same as in link().

-  **sortable**
-  string *$id*
-  array *$options*

Makes a list or group of floated objects (specified by DOM element ID
$id) sortable. The $options array can configure your sorting as follows:

+-----------------+---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------+
| 'tag'           | Sets the kind of tag (of the child elements of the container) that will be made sortable. For UL and OL containers, this is LI, you have to provide the tag kind for other sorts of child tags. Defaults to 'li'.   |
+-----------------+---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------+
| 'only'          | Further restricts the selection of child elements to only encompass elements with the given CSS class (or, if you provide an array of strings, on any of the classes).                                              |
+-----------------+---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------+
| 'overlap'       | Either vertical(default) or horizontal. For floating sortables or horizontal lists, choose horizontal. Vertical lists should use vertical.                                                                          |
+-----------------+---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------+
| 'constraint'    | Restricts the movement of draggable elements, 'vertical' or 'horizontal'.                                                                                                                                           |
+-----------------+---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------+
| 'containment'   | Enables dragging and dropping between Sortables. Takes an array of elements or element-ids (of the containers).                                                                                                     |
+-----------------+---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------+
| 'handle'        | Makes the created draggable elemetns use handles, see the handle option on drag().                                                                                                                                  |
+-----------------+---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------+

-  **editor**
-  string *$id*
-  string *$url*
-  array *$options*

Creates an in-place ajax editor using the element with the DOM id
supplied as the first parameter. When implemented, the element will
highlight on mouseOver, and will turn into a single text input field
when clicked. The second parameter is the URL that the edited data
should be sent to. The action should also return the updated contents of
the element. Additional options for the in-place editor can be found on
the Script.aculo.us wiki.

Javascript
==========

The JavaScript helper is used to aid the developer in outputting
well-formatted Javascript-related tags and data.

-  **codeBlock**
-  string *$string*

Used to return $script placed within JavaScript &lt;script&gt; tags.

-  **link**
-  string *$url*

Returns a JavaScript include tag pointing to the script referenced by
$url.

-  **linkOut**
-  string *$url*

Same as link(), only the include tag assumes that the script referenced
by $url is not hosted on the same domain.

-  **escapeScript**
-  string *$script*

Escapes carriage returns and single and double quotes for JavaScript
code segments.

-  **event**
-  string *$object*
-  string *$event*
-  string *$observer*
-  boolean *$useCapture*

Attaches an event to an element. Used with the Prototype library.

-  **cacheEvents**

Caches JavaScript events created with event().

-  **writeEvents**

Writes cached events cached with cacheEvents().

-  **includeScript**
-  string *$script*

Number
======

The Number helper includes a few nice functions for formatting numerical
data in your views.

-  **precision**
-  mixed *$number*
-  int *$precision = 3*

Returns $number formatted to the level of precision specified by
$precision.

-  **toReadableSize**
-  int *$sizeInBytes*

Returns a human readable size, given the $size supplied in bytes.
Basically, you pass a number of bytes in, and this function returns the
appropriate human-readable value in KB, MB, GB, or TB.

-  **toPercentage**
-  mixed *$number*
-  int *$precision = 2*

Returns the given number formatted as a percentage, limited to the
precision specified in $precision.

Text
====

The Text Helper provides methods that a developer may need for
outputting well formatted text to the browser.

-  **highlight**
-  string *$text*
-  string *$highlighter = '<span class="highlight">\\1</span>'*

Returns $text, with every occurance or $phrase wrapped with the tags
specified in $highlighter.

-  **stripLinks**
-  string *$text*

Returns $text, with all HTML links (&lt;a href= ...) removed.

-  **autoLinkUrls**
-  string *$text*
-  array *$htmlOptions*

Returns $text with URLs wrapped in corresponding &lt;a&gt; tags.

-  **autoLinkEmails**
-  string *$text*
-  array *$htmlOptions*

Returns $text with email addresses wrapped in corresponding &lt;a&gt;
tags.

-  **autoLink**
-  string *$text*
-  array *$htmlOptions*

Returns $text with URLs and emails wrapped in corresponding &lt;a&gt;
tags.

-  **truncate**
-  string *$text*
-  int *$length*
-  string *$ending = '...'*

Returns the first $length number of characters of $text followed by
$ending ('...' by default).

-  **excerpt**
-  string *$text*
-  string *$phrase*
-  int *$radius = 100*
-  string *$ending = '...'*

Extracts an excerpt from the $text, grabbing the $phrase with a number
of characters on each side determined by $radius.

-  **flay**
-  string *$text*
-  boolean *$allowHtml = false*

Text-to-html parser, similar to Textile or RedCloth, only with a little
different syntax.

Time
====

The Time Helper provides methods that a developer may need for
outputting Unix timestamps and/or datetime strings into more
understandable phrases to the browser.

Dates can be provided to all functions as either valid PHP datetime
strings or Unix timestamps.

-  **fromString**
-  string *$dateString*

Returns a UNIX timestamp, given either a UNIX timestamp or a valid
strtotime() date string.

-  **nice**
-  string *$dateString*
-  boolean *$return = false*

Returns a nicely formatted date string. Dates are formatted as "D, M jS
Y, H:i", or 'Mon, Jan 1st 2005, 12:00'.

-  **niceShort**
-  string *$dateString*
-  boolean *$return = false*

Formats date strings as specified in nice(), but ouputs "Today, 12:00"
if the date string is today, or "Yesterday, 12:00" if the date string
was yesterday.

-  **isToday**
-  string *$dateString*

Returns true if given datetime string is today.

-  **daysAsSql**
-  string *$begin*
-  string *$end*
-  string *$fieldName*
-  boolean *$return = false*

Returns a partial SQL string to search for all records between two
dates.

-  **dayAsSql**
-  string *$dateString*
-  string *$fieldName*
-  boolean *$return = false*

Returns a partial SQL string to search for all records between two times
occurring on the same day.

-  **isThisYear**
-  string *$dateString*
-  boolean *$return = false*

Returns true if given datetime string is within current year.

-  **wasYesterday**
-  string *$dateString*
-  boolean *$return = false*

Returns true if given datetime string was yesterday.

-  **isTomorrow**
-  string *$dateString*
-  boolean *$return = false*

Returns true if given datetime string is tomorrow.

-  **toUnix**
-  string *$dateString*
-  boolean *$return = false*

Returns a UNIX timestamp from a textual datetime description. Wrapper
for PHP function strtotime().

-  **toAtom**
-  string *$dateString*
-  boolean *$return = false*

Returns a date formatted for Atom RSS feeds.

-  **toRSS**
-  string *$dateString*
-  boolean *$return = false*

Formats date for RSS feeds

-  **timeAgoInWords**
-  string *$dateString*
-  boolean *$return = false*

Returns either a relative date or a formatted date depending on the
difference between the current time and given datetime. $datetime should
be in a strtotime-parsable format like MySQL datetime.

-  **relativeTime**
-  string *$dateString*
-  boolean *$return = false*

Works much like timeAgoInWords(), but includes the ability to create
output for timestamps in the future as well (i.e. "Yesterday, 10:33",
"Today, 9:42", and also "Tomorrow, 4:34").

-  **wasWithinLast**
-  string *$timeInterval*
-  string *$dateString*
-  boolean *$return = false*

Returns true if specified datetime was within the interval specified,
else false. The time interval should be specifed with the number as well
as the units: '6 hours', '2 days', etc.

Creating Your Own Helpers
=========================

Have the need for some help with your view code? If you find yourself
needing a specific bit of view logic over and over, you can make your
own view helper.

Extending the Cake Helper Class
-------------------------------

Let's say we wanted to create a helper that could be used to output a
CSS styled link you needed in your application. In order to fit your
logic in to Cake's existing Helper structure, you'll need to create a
new class in /app/views/helpers. Let's call our helper LinkHelper. The
actual php class file would look something like this:

/app/views/helpers/link.php
~~~~~~~~~~~~~~~~~~~~~~~~~~~

::

    <?php
    class LinkHelper extends Helper
    {
        function makeEdit($title, $url)
        {
            // Logic to create specially formatted link goes here...
        }
    }

There are a few functions included in Cake's helper class you might want
to take advantage of:

-  **output**
-  string *$string*
-  boolean *$return = false*

Decides whether to output or return a string based on AUTO\_OUTPUT (see
**/app/config/core.php**) and $return's value. You should use this
function to hand any data back to your view.

-  **loadConfig**

Returns your application's current core configuration and tag
definitions.

Let's use output() to format our link title and URL and hand it back to
the view.

/app/views/helpers/link.php (logic added)
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

::

    <?php
    class LinkHelper extends Helper
    {
        function makeEdit($title, $url)
        {
            // Use the helper's output function to hand formatted
            // data back to the view:

            return $this->output("<div class=\"editOuter\"><a href=\"$url\" class=\"edit\">$title</a></div>");
        }
    }

Including other Helpers
-----------------------

You may wish to use some functionality already existing in another
helper. To take advantage of that, you can specify helpers you wish to
use with a $helpers array, formatted just as you would in a controller.

/app/views/helpers/link.php (using other helpers)
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

::

    <?php
    class LinkHelper extends Helper
    {

        var $helpers = array('Html');

        function makeEdit($title, $url)
        {
            // Use the HTML helper to output
            // formatted data:

            $link = $this->Html->link($title, $url, array('class' => 'edit'));

            return $this->output("<div class=\"editOuter\">$link</div>");
        }
    }

Using your Custom Helper
------------------------

Once you've created your helper and placed it in /app/views/helpers/,
you'll be able to include it in your controllers using the special
variable $helpers::

    <?php
    class ThingsController
    {
      var $helpers = array('Html', 'Link');
    }

Remember to include the HTML helper in the array if you plan to use it
elsewhere. The naming conventions are similar to that of models.

#. LinkHelper = class name

#. link = key in helpers array

#. link.php = name of php file in **/app/views/helpers**.

