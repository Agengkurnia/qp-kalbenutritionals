$html = Get-Content 'data dummy.txt' -Raw
$regexTr = '<tr[^>]*>([\s\S]*?)<\/tr>'
$regexTd = '<td[^>]*>([\s\S]*?)<\/td>'

$results = @()
$matchesTr = [regex]::Matches($html, $regexTr)
foreach ($match in $matchesTr) {
    if ($match.Success) {
        $trContent = $match.Groups[1].Value
        $tds = [regex]::Matches($trContent, $regexTd)
        if ($tds.Count -ge 8) {
            $interfaceId = "dummy_$([guid]::NewGuid().ToString().Substring(0,8))"
            # Try to grab ID from href
            if ($tds[2].Groups[1].Value -match 'id=([^"&\s]*)') {
                $interfaceId = $Matches[1]
            } elseif ($trContent -match "confirmDelete\('([^']+)'\)") {
                $interfaceId = $Matches[1]
            }

            $status = ($tds[0].Groups[1].Value -replace '<[^>]+>','').Trim()
            $itemCode = ($tds[2].Groups[1].Value -replace '<[^>]+>','').Trim()
            
            if ($itemCode -ne '') {
                $obj = [System.Collections.Generic.Dictionary[string,string]]::new()
                $obj.Add("interfaceId", $interfaceId)
                $obj.Add("status", $status)
                $obj.Add("template", ($tds[1].Groups[1].Value -replace '<[^>]+>','').Trim())
                $obj.Add("itemCode", $itemCode)
                $obj.Add("itemDesc", ($tds[3].Groups[1].Value -replace '<[^>]+>','').Trim().Replace("&amp;","&"))
                $obj.Add("uom", ($tds[4].Groups[1].Value -replace '<[^>]+>','').Trim())
                $obj.Add("createdBy", ($tds[5].Groups[1].Value -replace '<[^>]+>','').Trim())
                $obj.Add("createdDate", ($tds[6].Groups[1].Value -replace '<[^>]+>','').Trim())
                
                $nextApp = ($tds[7].Groups[1].Value -replace '<[^>]+>','').Trim()
                if ($nextApp -eq '') { $nextApp = '-' }
                $obj.Add("nextApprover", $nextApp)

                $results += $obj
            }
        }
    }
}
$results | ConvertTo-Json -Depth 5 -Compress | Out-File -FilePath 'item_production.json' -Encoding utf8
Write-Host "Processed $($results.Count) records."
