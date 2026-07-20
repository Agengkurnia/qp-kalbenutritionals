$content = Get-Content 'item_production.json' -Raw
$js = "const dummyItemProductionData = " + $content + ";"
$js | Out-File -FilePath 'item_production.js' -Encoding utf8
