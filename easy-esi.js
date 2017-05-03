/*
 * MIT License
 * 
 * Copyright (c) 2017 Paul Podgorsek
 * https://github.com/ppodgorsek/easy-esi
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

jQuery.fn.reverse = [].reverse;

// Disable the Browser-Side Includes processing by setting: processBsi = false
// Disable the Server-Side Includes processing by setting: processEsi = false

asynchronousTimeout = 10000;
processBsi = true;
processEsi = true;

$(document).ready(function() {
	parsePageFragmentTags($('head'));
	parsePageFragmentTags($('body'));
});

function parsePageFragmentTags(element) {

	if (processBsi) {
		// Browser-Side Includes
		parsePageFragmentTagsWithNamespace(element,"bsi",true);
	}

	if (processEsi) {
		// Edge-Side Includes
		parsePageFragmentTagsWithNamespace(element,"esi",false);
	}
}

function parsePageFragmentTagsWithNamespace(element,tagNamespace,useLocalStorage) {
	processPageFragmentsToRemove(element,tagNamespace);
	processPageFragmentsToInclude(element,tagNamespace,useLocalStorage);
}

function processPageFragmentsToRemove(element,tagNamespace) {
	var fragmentsToRemove = $(element).find(tagNamespace + '\\:remove');
	$(fragmentsToRemove).reverse().remove();
}

function processPageFragmentsToInclude(element,tagNamespace,useLocalStorage) {

	var fragmentsToInclude = $(element).find(tagNamespace + '\\:include');

	$.each(fragmentsToInclude, function(index,fragmentToInclude) {
		var fragmentUrl = $(fragmentToInclude).attr("src");
		var temporaryBlock = null;

		if (storeFragmentLocally(useLocalStorage)) {
			var storedContents = localStorage.getItem(getStorageKey(fragmentUrl));

			temporaryBlock = $(storedContents).insertBefore(fragmentToInclude);
		}

		$.ajax({
			url: fragmentUrl,
			cache: false,
			context: document.body,
			dataType: "html",
			timeout: asynchronousTimeout,
			success: function(data, textStatus, jqXHR) {

				var includedFragment = $(data).insertBefore(fragmentToInclude);
				$(fragmentToInclude).remove();

				if (storeFragmentLocally(useLocalStorage)) {
					if (temporaryBlock != null) {
						$(temporaryBlock).remove();
					}

					localStorage.setItem(getStorageKey(fragmentUrl),data);
				}

				parsePageFragmentTags($(data));
			}
		});
	});
}

function storeFragmentLocally(useLocalStorage) {
	return useLocalStorage && typeof(localStorage) !== "undefined";
}

function getStorageKey(url) {
	return "easyesi_" + url;
}
