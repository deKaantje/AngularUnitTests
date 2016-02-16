@echo on
@title %cd%


:menu
cls
@echo off
@echo FrontStart Setup
@echo                                       ----
@echo                                       -Fs-
@echo                                       ----
@echo.
@echo ===============================================================================
@echo.
@echo 1 = Install global npm packages
@echo 2 = Install local npm packages
@echo ---------------------------------
@echo 3 = Install FrontStart components
@echo 4 = Update FrontStart components
@echo ---------------------------------
@echo 5 = Install bower components
@echo 6 = Update bower components
@echo ---------------------------------
@echo 0 = Exit
@echo.
@echo.
set /p menu="Choose number, then press ENTER: "
if %menu%==1 goto menu1
if %menu%==2 goto menu2
if %menu%==3 goto menu3
if %menu%==4 goto menu4
if %menu%==5 goto menu5
if %menu%==6 goto menu6
if %menu%==0 goto :eof
goto menu


:menu1
cls
@echo off
call npm install -g rimraf
@echo.
call npm install -g bower
@echo.
@echo.
@echo Done! Press any key to continue.
pause>nul
goto menu


:menu2
cls
@echo off
call npm install
@echo.
@echo.
@echo Done! Press any key to continue.
pause>nul
goto menu


:menu3
cls
@echo off
cd frontstart-develop
call bower install
cd..
@echo.
@echo.
@echo Done! Press any key to continue.
pause>nul
goto menu


:menu4
cls
@echo off
cd frontstart-develop
call bower update
cd..
@echo.
@echo.
@echo Done! Press any key to continue.
pause>nul
goto menu


:menu5
cls
@echo off
cd frontstart-data
call bower install
cd..
@echo.
@echo.
@echo Done! Press any key to continue.
pause>nul
goto menu


:menu6
cls
@echo off
cd frontstart-data
call bower update
cd..
@echo.
@echo.
@echo Done! Press any key to continue.
pause>nul
goto menu