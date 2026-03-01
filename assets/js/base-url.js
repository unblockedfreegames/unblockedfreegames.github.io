/**
 * GitHub Pages base URL fix - must be first script in <head>
 * Uses document.write so base tag exists before link/script tags are parsed.
 * Detects project site (username.github.io/repo-name/) vs user site (username.github.io/)
 */
(function(){var p=location.pathname,s=p.split('/').filter(Boolean),b='/';if(s.length>0){var f=s[0],c=['game','category','terms','privacy','contact','search.html','index.html'];if(c.indexOf(f)===-1)b='/'+f+'/';}document.write('<base href="'+b+'">');})();
