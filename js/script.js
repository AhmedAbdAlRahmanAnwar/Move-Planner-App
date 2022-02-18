function loadData() {

    var $wikiElem = $('#wikipedia-links');
    var $nytHeaderElem = $('#nytimes-header');
    var $nytElem = $('#nytimes-articles');
    var $greeting = $('#greeting');

    // clear out old data before new request
    $wikiElem.text("");
    $nytElem.text("");

    var cityStr = $('#city').val();

    $greeting.text('So, you want to live at ' + cityStr + '?');


    // load nytimes
    var nytimesURL = `https://api.nytimes.com/svc/search/v2/articlesearch.json?q=${cityStr}&sort=newest&api-key=KEpGhLEpWBVQjX5hnK09XQlQoCH3nqX3`;
    $.getJSON(nytimesURL, function (data) {
        $nytHeaderElem.text("New York Times articles about " + cityStr);
        var articles = data.response.docs;
        for (let i = 0; i < articles.length; i++) {
            var article = articles[i];
            var element = `<li class="article"><a href="${article.web_url}">${article.headline.main}</a><p>${article.snippet}</p></li>`;
            $nytElem.append(element);
        }
    }).error(function (err) {
        $nytHeaderElem.text("New York Times articles couldn't be loaded");
    });

    
    //load wiki articles
    var endPoint = "https://en.wikipedia.org/w/api.php";
    var parameters = "?action=opensearch&search=" + cityStr + "&format=json&callback=callback";
    var url = endPoint + parameters;
    
    var wikiRequestTimeout = setTimeout(() => {
        $wikiElem.text("failed to get wikipedia resources");
    }, 8000);

    $.ajax(url,{
        dataType: 'jsonp',
        success: function(data) {
            data[1].forEach(element => {
                var wiki = `<li><a href="https://en.wikipedia.org/wiki/${element}">${element}</a></li>`;
                $wikiElem.append(wiki);
            });
            clearTimeout(wikiRequestTimeout);
        }
    });
    return false;
};

$('#form-container').submit(loadData);