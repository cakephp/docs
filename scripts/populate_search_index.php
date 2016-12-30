#!/usr/bin/env php
<?php
/**
 * Utility script to populate the elastic search indexes
 *
 */

// Elastic search config
define('ES_DEFAULT_HOST', 'http://ci.cakephp.org:9200');
define('ES_INDEX', 'documentation');
define('CAKEPHP_VERSION', '3-next');


function main($argv)
{
	if (empty($argv[1])) {
		echo "A language to scan is required.\n";
		exit(1);
	}
	$lang = $argv[1];
	if (!empty($argv[2])) {
		define('ES_HOST', $argv[2]);
	} else {
		define('ES_HOST', ES_DEFAULT_HOST);
	}
	
	$directory = new RecursiveDirectoryIterator($lang);
	$recurser = new RecursiveIteratorIterator($directory);
	$matcher = new RegexIterator($recurser, '/\.rst/');

	foreach ($matcher as $file) {
		updateIndex($lang, $file);
	}
	echo "\nIndex update complete\n";
}

function updateIndex($lang, $file)
{
	$fileData = readFileData($file);
	$filename = $file->getPathName();
	list($filename) = explode('.', $filename);

	$path = $filename . '.html';
	$id = str_replace($lang . '/', '', $filename);
	$id = str_replace('/', '-', $id);
	$id = trim($id, '-');

	$url = implode('/', array(ES_HOST, ES_INDEX, CAKEPHP_VERSION . '-' . $lang, $id));

	$data = array(
		'contents' => $fileData['contents'],
		'title' => $fileData['title'],
		'url' => $path,
	);

	$data = json_encode($data);
	$size = strlen($data);

	$fh = fopen('php://memory', 'rw');
	fwrite($fh, $data);
	rewind($fh);

	echo "Sending request:\n\tfile: $file\n\turl: $url\n";

	$ch = curl_init($url);
	curl_setopt($ch, CURLOPT_PUT, true);
	curl_setopt($ch, CURLOPT_INFILE, $fh);
	curl_setopt($ch, CURLOPT_INFILESIZE, $size);
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

	$response = curl_exec($ch);
	$metadata = curl_getinfo($ch);

	if ($metadata['http_code'] > 400 || !$metadata['http_code']) {
		echo "[ERROR] Failed to complete request.\n";
		var_dump($response);
		exit(2);
	}

	curl_close($ch);
	fclose($fh);

	echo "Sent $file\n";
}

function readFileData($file)
{
	$contents = file_get_contents($file);

	// extract the title and guess that things underlined with # or == and first in the file
	// are the title.
	preg_match('/^(.*)\n[=#]+\n/', $contents, $matches);
	$title = $matches[1];

	// Remove the title from the indexed text.
	$contents = str_replace($matches[0], '', $contents);

	// Remove title markers from the text.
	$contents = preg_replace('/\n[-=~]+\n/', '', $contents);

	return compact('contents', 'title');
}

main($argv);
