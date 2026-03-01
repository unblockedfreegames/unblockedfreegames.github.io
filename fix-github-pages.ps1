# Fix GitHub Pages paths - run this to update all HTML files for project site deployment
$baseScript = '<script>(function(){var p=location.pathname,s=p.split(''/'').filter(Boolean),b=''/'';if(s.length>0){var f=s[0],c=[''game'',''category'',''terms'',''privacy'',''contact'',''search.html'',''index.html''];if(c.indexOf(f)===-1)b=''''+f+''/'';}document.write(''<base href=\"''+b+''\">'');})();</script>'
$files = Get-ChildItem -Path $PSScriptRoot -Recurse -Filter '*.html'
$count = 0
foreach ($f in $files) {
    $content = Get-Content $f.FullName -Raw -Encoding UTF8
    $orig = $content
    # Add base script if not present
    if (($content -notmatch "document.write.*base href") -and ($content -match "<head>")) {
        $content = $content -replace '(<head>\s*)', "`$1`n    $baseScript`n    "
    }
    # Fix absolute paths
    $content = $content -replace 'href="/', 'href="'
    $content = $content -replace 'src="/', 'src="'
    $content = $content -replace 'href="/"', 'href="./"'
    if ($content -ne $orig) {
        Set-Content $f.FullName -Value $content -Encoding UTF8 -NoNewline
        $count++
        Write-Host "Updated: $($f.FullName)"
    }
}
Write-Host "`nDone. Updated $count files."
