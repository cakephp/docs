<?php
$dir = getcwd();
$menu = array();
transformMenu($menu);
transformIndex($menu);
file_put_contents("$dir/_static/menu.json", json_encode($menu));


function transformIndex(&$menu) {
	$dir = getcwd();
	$html = explode('<table style="width: 100%" class="indextable genindextable">', file_get_contents("$dir/genindex.html"));
	array_shift($html);
	foreach ($html as $piece) {
		$piece = explode('</table>', $piece);
		$xml = new SimpleXMLElement($piece[0]);
		foreach ($xml->xpath('//a') as $node) {
			$tmp = $node->attributes();
			$text = $text = (string) $node; 
			if ($text && $text[0] === '(') {
				$url = (string)$tmp["href"][0];
				$text = str_replace('$', ' ', end(explode('::', $url))) . ' ' . $text;
			}
			$menu[] = array('text' => $text, 'link' => (string)$tmp["href"][0]);
		}
	}
}

function transformMenu(&$menu) {
	$dir = getcwd();
	$html = file_get_contents("$dir/contents.html");
	$html = preg_replace('/&(.+);/', '', $html);
	$html = str_replace('xmlns="http://www.w3.org/1999/xhtml"', '', $html);
	$xml = new SimpleXMLElement($html);
	$path = $xml->xpath('//div[@class="toctree-wrapper compound"]//li/a');
	foreach ($path as $node) {
			$tmp = $node->attributes();
			$menu[] = array('text' => (string) $node[0], 'link' => (string)$tmp["href"][0]);
	}
}

