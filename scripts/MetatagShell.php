<?php

App::uses('HttpSocket', 'Network/Http');

/**
 * Reads all the documentation files in a folder, process them and create meta tags for each one
 * using the Yahoo terms extraction API
 *
 * Put this file in your app/Console/Command/ folder of any CakePHP 2.0 application and execute it as
 * `app/Console/cake metatag`
 *
 */
class MetatagShell extends Shell {

/**
 * Reads all the files in a directory and process them to extract the description terms
 *
 * @return void
 */
	public function main() {
		$url = 'http://search.yahooapis.com/ContentAnalysisService/V1/termExtraction';
		$dir = $this->in('Please input the full path to the documentation folder (including the language directory)');
		if (!is_dir($dir) && !is_file($dir . DS . 'index.rst')) {
			throw new Exception('Invalid directory, please input the full path to one of the language directories for the docs repo');
		}
		$files = new RegexIterator(new RecursiveIteratorIterator(new RecursiveDirectoryIterator($dir)), '/\.rst$/');

		foreach ($files as $item) {
			if ($item->isDir()) {
				continue;
			}
			$request = new HttpSocket;
			$content = file($item->getRealPath());
			$data = array(
				'appid' => 'rrLaMQjV34HtIOsgPxf597DEP9KFoUzWybkmb4USJMPA89aCMWjjPFlnF3lD5ys-',
				'query' => 'cakephp ' . $content[0],
				'output' => 'json',
				'context' => file_get_contents($item->getRealPath())
			);
			$result = $request->post('http://search.yahooapis.com/ContentAnalysisService/V1/termExtraction', $data);
			$keywords = json_decode($result->body);
			$keywords = $keywords->ResultSet->Result;
			$meta = $this->generateMeta($keywords, str_replace("\n", '', $content[0]));

			$fh = fopen($item->getRealPath(), 'a');
			fwrite($fh, "\n\n" . $meta);
			fclose($fh);
			$this->out('<success>Processed</success> ' . $item->getRealPath());
		}
	}

/**
 * Auxiliary function to generate the meta syntax in rst files
 *
 * @param array $keywords 
 * @param string $title 
 * @return string
 */
	private function generateMeta($keywords, $title) {
		$keywords = implode(',', $keywords);
		$meta = <<<eom
.. meta::
    :title lang=en: $title
    :keywords lang=en: $keywords
eom;
		return $meta;
	}
}