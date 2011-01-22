4.2.2 html
----------

html(string $string, array $options = array())
This method prepares user-submitted data for display inside HTML.
This is especially useful if you don't want users to be able to
break your layouts or insert images or scripts inside of your HTML
pages. If the $remove option is set to true, HTML content detected
is removed rather than rendered as HTML entities.

::

    $badString = '<font size="99" color="#FF0000">HEY</font><script>...</script>';
    echo Sanitize::html($badString);
    // output: &lt;font size=&quot;99&quot; color=&quot;#FF0000&quot;&gt;HEY&lt;/font&gt;&lt;script&gt;...&lt;/script&gt;
    echo Sanitize::html($badString, array('remove' => true));
    // output: HEY...
