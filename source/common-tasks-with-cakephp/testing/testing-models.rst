4.7.5 Testing models
--------------------

Creating a test case
~~~~~~~~~~~~~~~~~~~~

Let's say we already have our Article model defined on
app/models/article.php, which looks like this:

::

     <?php  
       class Article extends AppModel { 
              var $name = 'Article'; 
               
              function published($fields = null) { 
                  $params = array( 
                        'conditions' => array(
                              $this->name . '.published' => 1 
                        ),
                        'fields' => $fields
                  ); 
                   
                  return $this->find('all',$params); 
              } 
       
       } 
     ?> 

We now want to set up a test that will use this model definition,
but through fixtures, to test some functionality in the model.
CakePHP test suite loads a very minimum set of files (to keep tests
isolated), so we have to start by loading our parent model (in this
case the Article model which we already defined), and then inform
the test suite that we want to test this model by specifying which
DB configuration it should use. CakePHP test suite enables a DB
configuration named **test\_suite** that is used for all models
that rely on fixtures. Setting $useDbConfig to this configuration
will let CakePHP know that this model uses the test suite database
connection.

CakePHP Models will only use the test\_suite DB config if they rely
on fixtures in your testcase!

Since we also want to reuse all our existing model code we will
create a test model that will extend from Article, set $useDbConfig
and $name appropiately. Let's now create a file named
**article.test.php** in your **app/tests/cases/models** directory,
with the following contents:
::

     <?php  
       App::import('Model','Article'); 
    
       
       class ArticleTestCase extends CakeTestCase { 
              var $fixtures = array( 'app.article' ); 
       } 
     ?> 

We have created the ArticleTestCase. In variable **$fixtures** we
define the set of fixtures that we'll use.

If your model is associated with other models, you will need to
include ALL the fixtures for each associated model even if you
don't use them. For example: A hasMany B hasMany C hasMany D. In
ATestCase you will have to include fixtures for a, b, c and d.

Creating a test method
~~~~~~~~~~~~~~~~~~~~~~

Let's now add a method to test the function published() in the
Article model. Edit the file
**app/tests/cases/models/article.test.php** so it now looks like
this:

::

      <?php
        App::import('Model', 'Article');
        
        class ArticleTestCase extends CakeTestCase {
            var $fixtures = array( 'app.article' );
        
            function testPublished() {
                $this->Article =& ClassRegistry::init('Article');
        
                $result = $this->Article->published(array('id', 'title'));
                $expected = array(
                    array('Article' => array( 'id' => 1, 'title' => 'First Article' )),
                    array('Article' => array( 'id' => 2, 'title' => 'Second Article' )),
                    array('Article' => array( 'id' => 3, 'title' => 'Third Article' ))
                );
        
                $this->assertEqual($result, $expected);
            }
        }
        ?>    

You can see we have added a method called **testPublished()**. We
start by creating an instance of our fixture based **Article**
model, and then run our **published()** method. In **$expected** we
set what we expect should be the proper result (that we know since
we have defined which records are initally populated to the article
table.) We test that the result equals our expectation by using the
**assertEqual** method. See the section Creating Tests for
information on how to run the test.

4.7.5 Testing models
--------------------

Creating a test case
~~~~~~~~~~~~~~~~~~~~

Let's say we already have our Article model defined on
app/models/article.php, which looks like this:

::

     <?php  
       class Article extends AppModel { 
              var $name = 'Article'; 
               
              function published($fields = null) { 
                  $params = array( 
                        'conditions' => array(
                              $this->name . '.published' => 1 
                        ),
                        'fields' => $fields
                  ); 
                   
                  return $this->find('all',$params); 
              } 
       
       } 
     ?> 

We now want to set up a test that will use this model definition,
but through fixtures, to test some functionality in the model.
CakePHP test suite loads a very minimum set of files (to keep tests
isolated), so we have to start by loading our parent model (in this
case the Article model which we already defined), and then inform
the test suite that we want to test this model by specifying which
DB configuration it should use. CakePHP test suite enables a DB
configuration named **test\_suite** that is used for all models
that rely on fixtures. Setting $useDbConfig to this configuration
will let CakePHP know that this model uses the test suite database
connection.

CakePHP Models will only use the test\_suite DB config if they rely
on fixtures in your testcase!

Since we also want to reuse all our existing model code we will
create a test model that will extend from Article, set $useDbConfig
and $name appropiately. Let's now create a file named
**article.test.php** in your **app/tests/cases/models** directory,
with the following contents:
::

     <?php  
       App::import('Model','Article'); 
    
       
       class ArticleTestCase extends CakeTestCase { 
              var $fixtures = array( 'app.article' ); 
       } 
     ?> 

We have created the ArticleTestCase. In variable **$fixtures** we
define the set of fixtures that we'll use.

If your model is associated with other models, you will need to
include ALL the fixtures for each associated model even if you
don't use them. For example: A hasMany B hasMany C hasMany D. In
ATestCase you will have to include fixtures for a, b, c and d.

Creating a test method
~~~~~~~~~~~~~~~~~~~~~~

Let's now add a method to test the function published() in the
Article model. Edit the file
**app/tests/cases/models/article.test.php** so it now looks like
this:

::

      <?php
        App::import('Model', 'Article');
        
        class ArticleTestCase extends CakeTestCase {
            var $fixtures = array( 'app.article' );
        
            function testPublished() {
                $this->Article =& ClassRegistry::init('Article');
        
                $result = $this->Article->published(array('id', 'title'));
                $expected = array(
                    array('Article' => array( 'id' => 1, 'title' => 'First Article' )),
                    array('Article' => array( 'id' => 2, 'title' => 'Second Article' )),
                    array('Article' => array( 'id' => 3, 'title' => 'Third Article' ))
                );
        
                $this->assertEqual($result, $expected);
            }
        }
        ?>    

You can see we have added a method called **testPublished()**. We
start by creating an instance of our fixture based **Article**
model, and then run our **published()** method. In **$expected** we
set what we expect should be the proper result (that we know since
we have defined which records are initally populated to the article
table.) We test that the result equals our expectation by using the
**assertEqual** method. See the section Creating Tests for
information on how to run the test.
