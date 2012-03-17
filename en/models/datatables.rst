Datatables
##############

While CakePHP can have datasources that aren't database driven, most of the time, they are. CakePHP is designed to be agnostic and will work with MySQL, MSSQL, Oracle, PostgreSQL and others. You can create your database tables as you normally would. When you create your Model classes, they'll automatically map to the tables that you've created.
Table names are by convention lowercase and pluralized with multi-word table names separated by underscores. For example, a Model name of Ingredient expects the table name ingredients. A Model name of EventRegistration would expect a table name of event_registrations. CakePHP will inspect your tables to determine the data type of each field and uses this information to automate various features such as outputting form fields in the view.
Field names are by convention lowercase and separated by underscores.

Using created and modified
==========================

By defining a created or modified field in your database table as datetime fields, CakePHP will recognize those fields and populate them automatically whenever a record is created or saved to the database (unless the data being saved already contains a value for these fields).
The created and modified fields will be set to the current date and time when the record is initially added. The modified field will be updated with the current date and time whenever the existing record is saved.

If you have updated, created or modified data in your $this->data (e.g. from a Model::read or Model::set) before a Model::save() then the values will be taken from $this->data and not automagically updated.
Either use unset($this->data['Model']['modified']), etc. Alternatively you can override the Model::save() to always do it for you:-

::

	class AppModel extends Model {
		//
		// 
		function save($data = null, $validate = true, $fieldList = array()) {        
			//clear modified field value before each save        
			if (isset($this->data) && isset($this->data[$this->name]))            
				unset($this->data[$this->name]['modified']);        
			if (isset($data) && isset($data[$this->name]))            
				unset($data[$this->name]['modified']);       
			return parent::save($data, $validate, $fieldList);    
		}
		//
		//
	}