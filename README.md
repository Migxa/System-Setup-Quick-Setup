# System-Setup-Quick-Setup
2. Extract files from the ZIP file
3. Open NetSuite
4. Set up Client Script first
    1. Customization → Scripting → Scripts → New
    2. Click the ➕ button
    3. In the new window, **********************Choose File********************** and select `system_setup_quick_setup_cli.js`
    4. Click ********Save********
    5. Click ****************Create Script Record****************
    6. Setup the script record
        1. Name: **************************************************CMMS System Setup Quick Setup CLI**************************************************
    7. Click ********Save********
5. Set up Suitelet Script
    1. Customization → Scripting → Scripts → New
    2. Click the ➕ button
    3. In the new window, **********************Choose File********************** and select `system_setup_quick_setup_sl.js`
    4. Click ********Save********
    5. Click ****************Create Script Record****************
    6. Setup the script record
        1. Name: **************************************************CMMS System Setup Quick Setup SL**************************************************
    7. Click ********Save********
    8. Click **************Deploy Script**************
        1. Title: ****************CMMS Quick Setup****************
        2. Status: **************Released**************
        3. Execute as Role: ****************************Administrator**************************** or ********************************************Shepherd Administrator********************************************
