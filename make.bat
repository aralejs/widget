@ECHO OFF
set THEME=%HOMEDRIVE%%HOMEPATH%\.spm\themes\arale
set SITE=_site

if "%1" == "" goto help

if "%1" == "help" (
    :help
    echo.Please use `make ^<target^>` where ^<target^> is on of
    echo.  build-doc     to make documentation
    echo.  debug         to make a debug server
    echo.  server        to make a normal server
    echo.  watch         to make a watch server
    goto end
)

if "%1" == "clean" (
    for /d %%i in (%SITE%\*) do rmdir /q /s %%i
    del /q /s %SITE%\*
    goto end
)

if "%1" == "build-doc" (
    nico build -v -C %THEME%\nico.js
    goto end
)

if "%1" == "debug" (
    nico server -v -C %THEME%\nico.js --watch debug
    goto end
)

if "%1" == "watch" (
    nico server -v -C %THEME%\nico.js --watch
    goto end
)

if "%1" == "server" (
    nico server -v -C %THEME%\nico.js
    goto end
)

:end
