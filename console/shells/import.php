<?php
class ImportShell extends Shell {

	protected $_urlStack = array('/');

	protected $_crawled = array();

	protected $_revisit = array();

	protected $_urlMap = array();


	public function main() {
		App::import('Core', 'HttpSocket');
		$this->Socket = new HttpSocket();

		while($this->_urlStack) {
			$url = array_shift($this->_urlStack);
			$this->_crawl($url);
		}

		foreach($this->_revisit as $reference) {
		}
	}

	protected function _crawl($url = '') {
		$this->_crawled[] = $url;
		$this->out('Crawling ' . $url);
		$cacheFile = TMP . '/stash/' . md5($url);
		if (file_exists($cacheFile)) {
			$fullContents = file_get_contents($cacheFile);
		} else {
			$fullContents = $this->Socket->get('http://book.cakephp.org' . $url);
			exec('mkdir -p ' . dirname($cacheFile));
			file_put_contents($cacheFile, $fullContents);
		}

		$this->_addNextPage($fullContents);

		$reference = $this->_reference($fullContents);
		$this->_urlMap[preg_replace('@/[^/]*$@', '', $url)] = $reference;

		$filename = 'source/' . $reference . '.rst';

		$this->out('Writing ' . $filename);
		$contents = $this->_fileContents($fullContents, $reference);
		exec('mkdir -p ' . dirname($filename));
		file_put_contents($filename, $contents);
	}

	protected function _addNextPage($contents) {
		preg_match('@<span class="next"><a href="(.*?)".*?>(.*?)</a></span>@s', $contents, $next);
		if ($next && !in_array($next[1], $this->_crawled)) {
			$this->_urlStack[] = $next[1];
		}
	}

	protected function _reference($contents) {
		preg_match('@<div class="crumbs">\s*<a href="/.*?">.*?</a>&raquo;(.*?)</div>@s', $contents, $crumbs);
		if (!$crumbs || !trim($crumbs[1])) {
			return 'index';
		}
		$input = strip_tags(str_replace(array('&raquo;', '&amp;'), array('/', 'and'), $crumbs[1]));

		$pattern = '\x00-\x1f\x26\x3c\x7f-\x9f\x{d800}-\x{dfff}\x{fffe}-\x{ffff}';
		$pattern .= preg_quote(' \'"?!<>\(\).$:;?@=+&%\#', '@');

		$return = preg_replace('@[' . $pattern . ']@Su', '-', $input);
		return trim(mb_strtolower(preg_replace('/-+/', '-', $return), 'UTF-8'), '-');
	}

	protected function _fileContents($contents, $reference) {
		$contents = preg_replace('@<div class="(options|comment)">.*?</div>@s', '', $contents);
		$contents = preg_replace('@<a href="#.*?">.*?</a>@s', '', $contents);
		$contents = preg_replace('@<ol class="code".*?>.*?</ol>@s', '', $contents);
		preg_match('@<div class="nodes view">(.*?)<div class="node-nav">@s', $contents, $node);
		if ($node) {
			$contents = $node[1];
		}

		preg_match_all('@<a href="(/view/\d+)/?.*?">(.*?)</a>@s', $contents, $links);
		if ($links[1]) {
			$this->_revisit[] = $reference;
		}

		return $this->_convertHtmlToReST($contents);
	}

	protected function _convertHtmlToReST($html) {
		$input = TMP . 'sample.html';
		$output = TMP . 'sample.rst';

		file_put_contents($input, $html);
		exec("pandoc -s --from=html --to=rst --output=$output $input");
		if (file_exists($output)) {
			return file_get_contents($output);
		}
		return $html;
	}
}