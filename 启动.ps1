$ErrorActionPreference = 'Stop'
$cmsRoot = $PSScriptRoot
$cmsNode = $null
$cmsCandidates = @((Join-Path $cmsRoot '.local\node-v24.22.0-win-x64\node.exe'))
$cmsSystemNode = Get-Command node.exe -ErrorAction SilentlyContinue
if ($cmsSystemNode) { $cmsCandidates += $cmsSystemNode.Source }
foreach ($candidate in $cmsCandidates) {
 if (Test-Path -LiteralPath $candidate) {
  $version = & $candidate --version 2>$null
  if ($version -match '^v24\.(\d+)' -and [int]$Matches[1] -ge 22) { $cmsNode = $candidate; break }
 }
}
if (!$cmsNode) { throw '请安装 Node.js 24.22+ LTS（24.x）。' }
function Test-CmsPort([int]$Port) {
 $client = [Net.Sockets.TcpClient]::new()
 try { $client.Connect('127.0.0.1',$Port); return $true } catch { return $false } finally { $client.Dispose() }
}
New-Item -ItemType Directory -Path (Join-Path $cmsRoot '.local') -Force | Out-Null
$cmsMysql = 'C:\Program Files\MySQL\MySQL Server 8.0\bin\mysqld.exe'
$cmsData = Join-Path $cmsRoot '.local\mysql'
if ((Test-Path -LiteralPath $cmsData) -and !(Test-CmsPort 3307)) {
 if (!(Test-Path -LiteralPath $cmsMysql)) { throw '找不到 MySQL 服务程序，请按运行说明配置数据库。' }
 Start-Process -FilePath $cmsMysql -ArgumentList @('--no-defaults',"--datadir=`"$cmsData`"",'--port=3307','--bind-address=127.0.0.1','--mysqlx=0','--console') -WindowStyle Hidden -RedirectStandardOutput (Join-Path $cmsRoot '.local\mysql.stdout.log') -RedirectStandardError (Join-Path $cmsRoot '.local\mysql.stderr.log') | Out-Null
 for ($i=0; $i -lt 30 -and !(Test-CmsPort 3307); $i++) { Start-Sleep -Seconds 1 }
}
if (!(Test-CmsPort 3300)) {
 Start-Process -FilePath $cmsNode -ArgumentList 'index.js' -WorkingDirectory (Join-Path $cmsRoot 'cms-node') -WindowStyle Hidden -RedirectStandardOutput (Join-Path $cmsRoot '.local\app.stdout.log') -RedirectStandardError (Join-Path $cmsRoot '.local\app.stderr.log') | Out-Null
}
for ($i=0; $i -lt 20; $i++) {
 try {
  $health = Invoke-RestMethod 'http://127.0.0.1:3300/health'
  if ($health.status -eq 'ok') { Write-Host 'CMS 已启动：http://127.0.0.1:3300/cms-manage/'; Write-Host '登录账号与密码见 cms-node\.env 中 ADMIN_USER / ADMIN_PASSWORD。'; exit 0 }
 } catch { Start-Sleep -Seconds 1 }
}
throw '启动失败，请查看 .local\app.stderr.log 和 .local\mysql.stderr.log。'
