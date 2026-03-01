doSearch= function() {
    const val= $("#search-input").val().trim().replace(/ /g, "-");
    if (val!= "") {
        // alert(val);
        var base = (document.querySelector('base') && document.querySelector('base').href) || (location.origin + '/');
        window.location = new URL('search.html?q=' + val, base).href;
    }
}

$("#search-input").on('keyup', function (e) {
    if (e.key === 'Enter' || e.keyCode === 13) {        
        doSearch();
    }
});

$( "#search-button" ).on( "click", function() {  
    doSearch();
});

$( document ).ready(function() {
    $("#search-input").focus();
});