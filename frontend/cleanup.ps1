$files = Get-ChildItem 'f:\prepAI\frontend\src' -Recurse -Include '*.jsx'
foreach ($f in $files) {
    $c = [System.IO.File]::ReadAllText($f.FullName)
    $before = $c
    $c = $c.Replace('hover:bg-emerald-500', 'hover:bg-indigo-500')
    $c = $c.Replace('hover:bg-emerald-400', 'hover:bg-indigo-400')
    $c = $c.Replace('bg-emerald-500', 'bg-indigo-500')
    $c = $c.Replace('text-emerald-500', 'text-indigo-500')
    $c = $c.Replace('hover:text-emerald-400', 'hover:text-indigo-400')
    if ($c -ne $before) {
        [System.IO.File]::WriteAllText($f.FullName, $c)
        Write-Host ("Fixed: " + $f.Name)
    }
}
Write-Host "Done"
