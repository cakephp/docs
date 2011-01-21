5.4.3 Sending A Message Using SMTP
----------------------------------

To send an email using an SMTP server, the steps are similar to
sending a basic message. Set the delivery method to ``smtp`` and
assign any options to the Email object's ``smtpOptions`` property.
You may also retrieve SMTP errors generated during the session by
reading the ``smtpError`` property of the component.

::

       /* SMTP Options */
       $this->Email->smtpOptions = array(
            'port'=>'25', 
            'timeout'=>'30',
            'host' => 'your.smtp.server',
            'username'=>'your_smtp_username',
            'password'=>'your_smtp_password',
            'client' => 'smtp_helo_hostname'
       );
    
        /* Set delivery method */
        $this->Email->delivery = 'smtp';
    
        /* Do not pass any args to send() */
        $this->Email->send();
    
        /* Check for SMTP errors. */
        $this->set('smtp_errors', $this->Email->smtpError);

If your SMTP server requires authentication, be sure to specify the
username and password parameters for ``smtpOptions`` as shown in
the example.

If you don't know what an SMTP HELO is, then you most likely will
not need to set the ``client`` parameter for the ``smtpOptions``.
This is only needed for compatibility with SMTP servers which do
not fully respect RFC 821 (SMTP HELO).

Here are example options for using Gmail's SMTP server.

::

       /* SMTP Options */
       $this->Email->smtpOptions = array(
            'port'=>'465', 
            'timeout'=>'30',
            'host' => 'ssl://smtp.gmail.com',
            'username'=>'your_username@gmail.com',
            'password'=>'your_gmail_password',
       );

5.4.3 Sending A Message Using SMTP
----------------------------------

To send an email using an SMTP server, the steps are similar to
sending a basic message. Set the delivery method to ``smtp`` and
assign any options to the Email object's ``smtpOptions`` property.
You may also retrieve SMTP errors generated during the session by
reading the ``smtpError`` property of the component.

::

       /* SMTP Options */
       $this->Email->smtpOptions = array(
            'port'=>'25', 
            'timeout'=>'30',
            'host' => 'your.smtp.server',
            'username'=>'your_smtp_username',
            'password'=>'your_smtp_password',
            'client' => 'smtp_helo_hostname'
       );
    
        /* Set delivery method */
        $this->Email->delivery = 'smtp';
    
        /* Do not pass any args to send() */
        $this->Email->send();
    
        /* Check for SMTP errors. */
        $this->set('smtp_errors', $this->Email->smtpError);

If your SMTP server requires authentication, be sure to specify the
username and password parameters for ``smtpOptions`` as shown in
the example.

If you don't know what an SMTP HELO is, then you most likely will
not need to set the ``client`` parameter for the ``smtpOptions``.
This is only needed for compatibility with SMTP servers which do
not fully respect RFC 821 (SMTP HELO).

Here are example options for using Gmail's SMTP server.

::

       /* SMTP Options */
       $this->Email->smtpOptions = array(
            'port'=>'465', 
            'timeout'=>'30',
            'host' => 'ssl://smtp.gmail.com',
            'username'=>'your_username@gmail.com',
            'password'=>'your_gmail_password',
       );
