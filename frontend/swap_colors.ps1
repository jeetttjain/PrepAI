$files = Get-ChildItem -Path 'f:\prepAI\frontend\src' -Recurse -Include '*.jsx','*.js','*.css','*.html'
$files += Get-Item 'f:\prepAI\frontend\index.html' -ErrorAction SilentlyContinue

foreach ($file in $files) {
    $c = [System.IO.File]::ReadAllText($file.FullName)

    # Hex color replacements: emerald -> indigo
    $c = $c.Replace('#10b981', '#6366f1')
    $c = $c.Replace('#059669', '#4f46e5')
    $c = $c.Replace('#d1fae5', '#e0e7ff')
    $c = $c.Replace('#a7f3d0', '#c7d2fe')
    $c = $c.Replace('#064e3b', '#312e81')
    $c = $c.Replace('#065f46', '#3730a3')

    # Tailwind class replacements
    $c = $c.Replace('hover:bg-emerald-500', 'hover:bg-indigo-500')
    $c = $c.Replace('hover:bg-emerald-400', 'hover:bg-indigo-400')
    $c = $c.Replace('hover:text-emerald-400', 'hover:text-indigo-400')
    $c = $c.Replace('bg-emerald-500', 'bg-indigo-500')
    $c = $c.Replace('text-emerald-400', 'text-indigo-400')
    $c = $c.Replace('bg-emerald-400', 'bg-indigo-400')
    $c = $c.Replace('fill-emerald-', 'fill-indigo-')
    $c = $c.Replace('ring-emerald-', 'ring-indigo-')
    $c = $c.Replace('border-emerald-', 'border-indigo-')

    [System.IO.File]::WriteAllText($file.FullName, $c)
    Write-Host ("Updated: " + $file.Name)
}
Write-Host "Color swap complete."
