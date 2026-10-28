param([string]$Manifest = 'research/pasig-2026-10-28/source-manifest.json')

# Research only. Downloads public pages using the Windows certificate store.
# HTTP success is retrieval evidence, not approval to publish a claim.
$ErrorActionPreference = 'Stop'
$manifestPath = (Resolve-Path -LiteralPath $Manifest).Path
$researchRoot = Split-Path -Parent $manifestPath
$config = Get-Content -LiteralPath $manifestPath -Raw -Encoding UTF8 | ConvertFrom-Json
$snapshotRoot = Join-Path $researchRoot 'snapshots'
[void](New-Item -ItemType Directory -Path $snapshotRoot -Force)
$utf8 = New-Object System.Text.UTF8Encoding($false)
$results = @()
$previousSources = @{}
$previousReportPath = Join-Path $researchRoot 'retrieval-report.json'
if (Test-Path -LiteralPath $previousReportPath) {
    $previousReport = Get-Content -LiteralPath $previousReportPath -Raw -Encoding UTF8 | ConvertFrom-Json
    foreach ($old in $previousReport.sources) { $previousSources[$old.id] = $old }
    $historyRoot = Join-Path $researchRoot ('history/' + [DateTimeOffset]::Now.ToString('yyyyMMdd-HHmmss'))
    [void](New-Item -ItemType Directory -Path $historyRoot -Force)
    Copy-Item -LiteralPath $previousReportPath -Destination (Join-Path $historyRoot 'retrieval-report.json')
    Copy-Item -LiteralPath $snapshotRoot -Destination (Join-Path $historyRoot 'snapshots') -Recurse
}
foreach ($item in $config.sources) {
    $url = if ($item.url) { $item.url } else { 'https://pasigcity.gov.ph/news-and-releases/' + $item.slug }
    $hostName = ([uri]$url).DnsSafeHost
    if ($hostName -notin @('pasigcity.gov.ph', 'pagasa.dost.gov.ph')) { throw "Unexpected source host: $hostName" }
    $result = [ordered]@{id=$item.id;url=$url;expected_published=$item.expected_published;observed_published=$null;publication_matches=$false;retrieved_at=[DateTimeOffset]::Now.ToString('o');http_status=$null;html_file=$null;text_file=$null;article_file=$null;article_images=@();sha256=$null;bytes=$null;error=$null;claim_review='pending'}
    $old = $previousSources[$item.id]
    $result.last_successful_retrieval = if ($old -and $old.http_status -eq 200) { $old.retrieved_at } elseif ($old) { $old.last_successful_retrieval } else { $null }
    try {
        $response = Invoke-WebRequest -UseBasicParsing -Uri $url -TimeoutSec 20 -MaximumRedirection 3
        $html = [string]$response.Content
        $htmlPath = Join-Path $snapshotRoot ($item.id + '.html')
        $textPath = Join-Path $snapshotRoot ($item.id + '.txt')
        [IO.File]::WriteAllText($htmlPath, $html, $utf8)
        $plain = [regex]::Replace($html, '(?s)<!--.*?-->', '')
        $plain = [regex]::Replace($plain, '(?is)<(script|style)\b[^>]*>.*?</\1>', '')
        $plain = [regex]::Replace($plain, '(?i)<br\s*/?>|</(?:p|div|h[1-6]|li|tr|section|article)>', "`n")
        $plain = [System.Net.WebUtility]::HtmlDecode([regex]::Replace($plain, '(?s)<[^>]+>', ' '))
        $plain = (($plain -split "`r?`n" | ForEach-Object { [regex]::Replace($_, '\s+', ' ').Trim() } | Where-Object { $_ }) -join "`n")
        [IO.File]::WriteAllText($textPath, $plain, $utf8)
        $articleMatch = [regex]::Match($html, '(?s)<h1 class="mt-0">(.*?)<h1 class="mb-5">Other News')
        if ($articleMatch.Success) {
            $articleHtml = $articleMatch.Groups[1].Value
            $articleText = [System.Net.WebUtility]::HtmlDecode([regex]::Replace([regex]::Replace($articleHtml, '(?i)<br\s*/?>|</(?:p|div|h[1-6]|li|tr)>', "`n"), '(?s)<[^>]+>', ' '))
            $articleText = (($articleText -split "`r?`n" | ForEach-Object { [regex]::Replace($_, '\s+', ' ').Trim() } | Where-Object { $_ }) -join "`n")
            [IO.File]::WriteAllText((Join-Path $snapshotRoot ($item.id + '.article.txt')), $articleText, $utf8)
            $result.article_file = 'snapshots/' + $item.id + '.article.txt'
            $dateMatch = [regex]::Match($articleText, '(?m)^(January|February|March|April|May|June|July|August|September|October|November|December) \d{1,2}, \d{4}$')
            if ($dateMatch.Success) {
                $result.observed_published = [datetime]::ParseExact($dateMatch.Value, 'MMMM d, yyyy', [Globalization.CultureInfo]::InvariantCulture).ToString('yyyy-MM-dd')
                $result.publication_matches = ($result.observed_published -eq $item.expected_published)
            }
            $result.article_images = @([regex]::Matches($articleHtml, '<img\b[^>]*src="([^"]+)"') | ForEach-Object { $_.Groups[1].Value })
        }
        $result.http_status = [int]$response.StatusCode
        $result.last_successful_retrieval = $result.retrieved_at
        $result.html_file = 'snapshots/' + $item.id + '.html'
        $result.text_file = 'snapshots/' + $item.id + '.txt'
        $result.sha256 = (Get-FileHash -LiteralPath $htmlPath -Algorithm SHA256).Hash.ToLowerInvariant()
        $result.bytes = (Get-Item -LiteralPath $htmlPath).Length
    } catch { $result.error = $_.Exception.Message }
    $results += [pscustomobject]$result
    Write-Output ($item.id + ': ' + $(if ($result.http_status) { $result.http_status } else { $result.error }))
}
$report = [ordered]@{as_of_date=$config.as_of_date;timezone=$config.timezone;window_start=$config.window_start;window_end=$config.window_end;note='Expected dates require manual confirmation in article text. Retrieval timestamps do not refresh publication dates. Saved HTML is evidence, never executable product content.';sources=$results}
[IO.File]::WriteAllText((Join-Path $researchRoot 'retrieval-report.json'), ($report | ConvertTo-Json -Depth 12), $utf8)
