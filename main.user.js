// ==UserScript==
// @name         SOE XWars Tool
// @namespace    http://tampermonkey.net/
// @version      1.6.0
// @description  
// @author       DartRevan
// @match        *original.xwars.net/index.php?id=&method*
// @match        *original.xwars.net/?id*
// @grant        GM_getValue
// @grant        GM_setValue
// ==/UserScript==

(function() {
    'use strict';

    //   _____________________________
    //  |                             |
    //  |           CONFIG            |
    //  |_____________________________|

    const debug = false
    const configFile = "configfile_150"

    var saveFile = GM_getValue(configFile, {index_saveCoords:0, saveCoords:"", buildTool_enabled:true, shipTool_enabled:true, tradeLogTool_enabled:true, notification_enabled:false});

    function addConfigButton(){
        try{
            window[5].document.querySelector("body > table > tbody > tr:nth-child(5) > td > table > tbody > tr > td:nth-child(2) > a:nth-child(35)").innerText
        }
        catch{
            setTimeout(addConfigButton,200)
            return
        }

        const parent = window[5].document.querySelector("body > table > tbody > tr:nth-child(5) > td > table > tbody > tr > td:nth-child(2)")
        const btn = parseHTML('<a id="config_button" href="#">SOE Tool</a>')
        parent.appendChild(btn)
        window[5].document.getElementById("config_button").addEventListener("click", prepareConfigPage)
    }

    setTimeout(addConfigButton,1000)

    function prepareConfigPage(){

        try{
            window[6].document.querySelector("body > table > tbody > tr:nth-child(1) > td > table > tbody > tr > td:nth-child(3) > font > b > font").innerText = "SOE Tool"
            window[6].document.querySelector("body > table > tbody > tr:nth-child(2) > td > table > tbody > tr > td:nth-child(2)").innerHTML = ""
        }

        catch{
            setTimeout(prepareConfigPage,200)
            return
        }

        generateConfigPage()

    }


    function generateConfigPage(){
        const parent = window[6].document.querySelector("body > table > tbody > tr:nth-child(2) > td > table > tbody > tr > td:nth-child(2)")

        const table = document.createElement("table")
        table.border="0"
        table.cellSpacing="1"
        table.cellPadding="4"

        var tr = document.createElement("tr")
        var td = document.createElement("td")

        td.appendChild(parseHTML("<p></p>"))
        tr.appendChild(td)
        table.appendChild(tr)

        // Überschrift SOE Tool
        tr = document.createElement("tr")
        td = document.createElement("td")
        td.appendChild(parseHTML("<h1>Einstellungen SOE Tool</h1>"))
        td.colSpan = "3"
        tr.appendChild(td)
        tr.appendChild(td)
        //table.appendChild(tr)

        // Tabellentitel Einstellungen für Handel
        tr = document.createElement("tr")
        td = document.createElement("td")
        td.style.textAlign = "center"
        td.className = "first"
        td.colSpan = "3"
        td.appendChild(parseHTML('&nbsp;<b>Einstellungen für Handel</b>&nbsp;'))
        tr.appendChild(td)
        table.appendChild(tr)

        // Beschreibung SaveCoords
        tr = document.createElement("tr")
        td = document.createElement("td")
        td.className = "second"
        td.appendChild(parseHTML('&nbsp;<a>Koordinaten Savehandel:</a>&nbsp;'))
        tr.appendChild(td)

        // Input SaveCoords
        td = document.createElement("td")
        td.className = "second"
        var input = document.createElement("INPUT");
        input.setAttribute("style", "width: 100px;");
        input.name = "input_saveCoords"
        input.value = saveFile.saveCoords
        td.appendChild(input)

        // Switch SaveCoords
        const select = window[5].document.querySelector("body > table > tbody > tr:nth-child(7) > td > table > tbody > tr > td:nth-child(2) > b > font > select").cloneNode(true)
        select.name = "sel_saveCoords"
        select.onchange = null
        var option = document.createElement("option");
        option.text = "Planet auswählen";
        select.add(option,0)
        select.selectedIndex = 0
        select.addEventListener ("change", function () {
            if(select.options[select.selectedIndex].text != "Planet auswählen") window[6].document.getElementsByName("input_saveCoords")[0].value = select.options[select.selectedIndex].text
        })
        td.className = "second"
        td.appendChild(select)
        tr.appendChild(td)
        table.appendChild(tr)

        // Speicherbtn SaveCoords
        tr = document.createElement("tr")
        td = document.createElement("td")
        td.className = "first"
        const save_button = parseHTML('[&nbsp;<a href="#" name="saveBtn">speichern</a>&nbsp;]')
        td.appendChild(save_button)
        td.colSpan = "3"
        td.align = "center"
        tr.appendChild(td)
        table.appendChild(tr)

        //  Abstand
        tr = document.createElement("tr")
        td = document.createElement("td")
        td.appendChild(parseHTML("<br>"))
        tr.appendChild(td)
        table.appendChild(tr)

        // Tabellentitel Funktionen ein/ausschalten
        tr = document.createElement("tr")
        td = document.createElement("td")
        td.style.textAlign = "center"
        td.className = "first"
        td.colSpan = "2"
        td.appendChild(parseHTML('&nbsp;<b>Funktionen ein/ausschalten</b>&nbsp;'))
        tr.appendChild(td)
        table.appendChild(tr)

        // Options BuildTool
        table.appendChild(generateOnOFF_option("Gebäudekosten", "buildTool"))
        table.appendChild(generateOnOFF_option("Schiffsmarkt", "shipTool"))
        const user = getUserName()
        if((user == "DarthRevan" || user == "Imperator" || user == "DarthVader" || user == "Saepus" || user == "Macallen"))table.appendChild(generateOnOFF_option("Handel Log", "tradeLogTool"))
        if((user == "DarthRevan")) table.appendChild(generateOnOFF_option("Ereignis Benachrichtigung", "notification"))

        parent.setAttribute("align", "center");
        parent.appendChild(table)

        window[6].document.getElementsByName("saveBtn")[0].onclick = saveConfig

        try{
            if(!saveFile.buildTool_enabled)window[6].document.getElementById("on_buildTool").onclick = saveOnOFF_option
            if(saveFile.buildTool_enabled)window[6].document.getElementById("off_buildTool").onclick =saveOnOFF_option
            if(!saveFile.shipTool_enabled)window[6].document.getElementById("on_shipTool").onclick = saveOnOFF_option
            if(saveFile.shipTool_enabled)window[6].document.getElementById("off_shipTool").onclick = saveOnOFF_option
            if(!saveFile.tradeLogTool_enabled)window[6].document.getElementById("on_tradeLogTool").onclick = saveOnOFF_option
            if(saveFile.tradeLogTool_enabled)window[6].document.getElementById("off_tradeLogTool").onclick = saveOnOFF_option
            if(!saveFile.notification_enabled)window[6].document.getElementById("on_notification").onclick = saveOnOFF_option
            if(saveFile.notification_enabled)window[6].document.getElementById("off_notification").onclick = saveOnOFF_option
        }
        catch{}
    }

    function generateOnOFF_option(title, tag){
        var tr = document.createElement("tr")
        var td = document.createElement("td")
        td.className = "second"
        td.align = "right"
        td.appendChild(parseHTML('&nbsp;<a>' + title + ':</a>&nbsp;'))
        tr.appendChild(td)

        // Einbtn
        td = document.createElement("td")
        td.id = tag + "_Btns"
        td.className = "second"
        var on = parseHTML('&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<a href="#" name = "' + tag + '" id="on_' + tag + '">ein</a>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;')
        if(getOptionEnabled(tag))on = parseHTML('&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[&nbsp;<a>ein</a>&nbsp;]&nbsp;&nbsp;&nbsp;')
        td.appendChild(on)
        td.align = "left"
        tr.appendChild(td)

        // Ausbtn
        var off = parseHTML('&nbsp;&nbsp;&nbsp;[&nbsp;<a>aus</a>&nbsp;]&nbsp;&nbsp;&nbsp;')
        if(getOptionEnabled(tag))off = parseHTML('&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<a href="#" name = "' + tag + '" id="off_' + tag + '">aus</a>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;')
        td.appendChild(off)
        tr.appendChild(td)
        return tr
    }

    function getOptionEnabled(tag){
        switch(tag) {
            case "buildTool": return saveFile.buildTool_enabled
            case "shipTool": return saveFile.shipTool_enabled
            case "tradeLogTool": return saveFile.tradeLogTool_enabled
            case "notification": return saveFile.notification_enabled
        }
    }

    function changeOptionEnabled(tag){
        switch(tag) {
            case "buildTool": saveFile.buildTool_enabled = !saveFile.buildTool_enabled;break;
            case "shipTool": saveFile.shipTool_enabled = !saveFile.shipTool_enabled;break;
            case "tradeLogTool": saveFile.tradeLogTool_enabled = !saveFile.tradeLogTool_enabled;break;
            case "notification": saveFile.notification_enabled = !saveFile.notification_enabled;break;
        }
        GM_setValue(configFile, saveFile);
    }

    function saveConfig(){
        saveFile.saveCoords = window[6].document.getElementsByName("input_saveCoords")[0].value
        //saveFile.index_saveCoords = window[6].document.getElementsByName("sel_saveCoords")[0].selectedIndex
        GM_setValue(configFile, saveFile);
    }

    function saveOnOFF_option(element){
        const tag = element.srcElement.name
        changeOptionEnabled(tag)
        var tb = window[6].document.querySelector("#" + tag + "_Btns")
        tb.innerHTML = ""

        if(!getOptionEnabled(tag)){
            tb.appendChild(parseHTML('&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<a href="#" name = "' + tag + '" id="on_' + tag + '">ein</a>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'))
            tb.appendChild(parseHTML('&nbsp;&nbsp;&nbsp;[&nbsp;<a>aus</a>&nbsp;]&nbsp;&nbsp;&nbsp;'))
            window[6].document.getElementById("on_" + tag).onclick = saveOnOFF_option
        }
        else{
            tb.appendChild(parseHTML('&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[&nbsp;<a>ein</a>&nbsp;]&nbsp;&nbsp;&nbsp;'))
            tb.appendChild(parseHTML('&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<a href="#" name = "' + tag + '" id="off_' + tag + '">aus</a>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'))
            window[6].document.getElementById("off_"+ tag).onclick = saveOnOFF_option
        }
    }

     function shipTool_options(){
        console.log("shipTool_options")
        saveFile.shipTool_enabled = !saveFile.buildTool_enabled
        GM_setValue(configFile, saveFile);
        var tb = window[6].document.getElementById("ShipTool_Btns")
        tb.innerHTML = ""

        if(!saveFile.shipTool_enabled){

            tb.appendChild(parseHTML('&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<a href="#" name="on_shipTool">ein</a>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'))
            tb.appendChild(parseHTML('&nbsp;&nbsp;&nbsp;[&nbsp;<a>aus</a>&nbsp;]&nbsp;&nbsp;&nbsp;'))
            window[6].document.getElementsByName("on_shipTool")[0].onclick = shipTool_options
        }
        else{
            tb.appendChild(parseHTML('&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[&nbsp;<a>ein</a>&nbsp;]&nbsp;&nbsp;&nbsp;'))
            tb.appendChild(parseHTML('&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<a href="#" name="off_shipTool">aus</a>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'))
            window[6].document.getElementsByName("off_shipTool")[0].onclick = shipTool_options
        }
    }

    //--------------------------------------------------

    //   _____________________________
    //  |                             |
    //  |           START             |
    //  |_____________________________|

    setInterval(function () {runWhenReady(setClickListener)}, 1000);
    if(saveFile.notification_enabled)setInterval(timerIncrement, 1000)
    setTimeout(setAllObsLinkOverview,300)

    //--------------------------------------------------

    function runWhenReady(callback) {
        var numAttempts = 0;
        var tryNow = function() {
            if (window[8].document.querySelector("body > table > tbody > tr > td:nth-child(2) > table > tbody > tr > td:nth-child(3) > map > area")) {
                callback();
            } else {
                numAttempts++;
                if (numAttempts >= 34) {
                    console.warn('Giving up after 34 attempts.');
                } else {
                    setTimeout(tryNow, 250 * Math.pow(1.1, numAttempts));
                }
            }
        };
        tryNow();
    }



    function menu_clicked(clickedElement){
        ResetIdleTime()
        setCurrentStorageCapa()
        var elementText = clickedElement.srcElement.innerText
        if(clickedElement.srcElement.localName == "select" && clickedElement.button == -1){
            if(debug)console.log("Planentenwechsel")
            planetChange()
        }
        switch(elementText){
            case "Übersicht":
                if(debug)console.log("Übersicht")
                setTimeout(setAllObsLinkOverview,300)
                break;
            case "Konstruktion":
                if(debug)console.log("Konstruktion")
                setTimeout(getBuildLvl,500)
                break;
            case "Forschung":
                if(debug)console.log("Forschung")
                break;
            case "Verteidigung":
                if(debug)console.log("Verteidigung")
                break;
            case "Produktion":
                if(debug)console.log("Produktion")
                break;
            case "Flotten":
                if(debug)console.log("Flotten")
                setTimeout(setAllObsLink,200)
                break;
            case "Handel":
                if(debug)console.log("Handel")
                setTimeout(hideSaveTrades,300)
                break;
            case "Rohstoffe":
                if(debug)console.log("Rohstoffe")
                setTimeout(generateRPH,200)
                break;
            case "Planeten":
                if(debug)console.log("Planeten")
                break;
            case "Technik":
                if(debug)console.log("Technik")
                break;
            case "Highscore":
                if(debug)console.log("Highscore")
                break;
            case "Allianz":
                if(debug)console.log("Allianz")
                break;
            case "Nachrichten":
                if(debug)console.log("Nachrichten")
                break;
            case "Account":
                if(debug)console.log("Account")
                break;
            case "Discord":
                if(debug)console.log("Discord")
                break;
            case "Discussions":
                if(debug)console.log("Discussions")
                break;
            case "Logout":
                if(debug)console.log("Logout")
                break;
        }


    }

    function main_clicked(clickedElement){
        ResetIdleTime(clickedElement)
        setCurrentStorageCapa()

        if(clickedElement.srcElement.title == "Handel"){
            if(debug)console.log("Handel mit Koords")
            generateTradePage()
        }

        if(clickedElement.srcElement.title == "Galaxy" && clickedElement.srcElement.target == "inhalt"){
            if(debug)console.log("Navigation/Spionage")
        }

        if(clickedElement.srcElement.innerText.split("x").length == 3 && clickedElement.srcElement.localName == "b"){
            if(clickedElement.srcElement.innerText.includes(":")) return
            if(debug)console.log("Planentenwechsel")
            planetChange()
            
        }

        if(clickedElement.srcElement.innerText.includes("Flottenbasis")){
            if(debug)console.log("Flottenbasis")
            setTimeout(setAllObsLink,200)
        }

        var elementText = clickedElement.srcElement.innerText
        switch(elementText){
                // Handel
            case "Transaktionen":
                if(debug)console.log("Transaktionen")
                setTimeout(hideSaveTrades,300)
                break;
            case "Historie":
                if(debug)console.log("Historie")
                break;
            case "Handelsangebot stellen":
                if(debug)console.log("Handelsangebot stellen")
                setTimeout(generateTradePage,300)
                break;
            case "Kredit":
                if(debug)console.log("Kredit")
                break;
            case "Anfrage starten":
                if(debug)console.log("Anfrage starten")
                setTimeout(hideSaveTrades,300)
                break;
            case "anzeigen":
                if(debug)console.log("anzeigen")
                setTimeout(addLogButton,300)
                break;
            case "Annehmen + Log":
                if(debug)console.log("Annehmen + Log")
                logTrade()
                setTimeout(hideSaveTrades,300)
                break;
            case "Annehmen":
                if(debug)console.log("Annehmen")
                setTimeout(hideSaveTrades,300)
                break;
            case "abbrechen":
                if(debug)console.log("abbrechen")
                setTimeout(hideSaveTrades,300)
                break;
            case "Ablehnen":
                if(debug)console.log("Ablehnen")
                setTimeout(hideSaveTrades,300)
                break;
            case "Bank":
                if(debug)console.log("Bank")
                setTimeout(generateBankePage,300)
                break;
            case "weiter":
                if(debug)console.log("Bank")
                setTimeout(generateBankePage,300)
                break;


                // Navigation/Spionage
            case "Galaxieansicht":
                if(debug)console.log("Galaxieansicht")
                break;
            case "Planeten suchen":
                if(debug)console.log("Planeten suchen")
                break;
            case "Planeten Observation":
                if(debug)console.log("Planeten Observation")
                setTimeout(getallObservers,300)
                break;

                // Rohstoffe
            case "Rohstoffe":
                if(debug)console.log("Rohstoffe")
                setTimeout(generateRPH,500)
                break;

                // Flotten
            case "Alle Flottenbasen":
                if(debug)console.log("Alle Flottenbasen")
                setTimeout(setAllObsLink,200)
                break;
            case "Flottenbewegungen":
                if(debug)console.log("Flottenbewegungen")
                setTimeout(setAllObsLink,200)
                break;
            case "Befehl erteilen":
                if(debug)console.log("efehl erteilen")
                setTimeout(fillOutLastCommand,200)
                break;
            case "Raumdock":
                if(debug)console.log("Raumdock")
                setTimeout(generateSpaceDockTools,200)
                break;
            case "auflösen":
                if(debug)console.log("auflösen")
                setTimeout(generateSpaceDockTools,200)
                break;



        }
    }

    function planetChange(){
        resetBuild()
        setTimeout(addConfigButton,800)
        setTimeout(setAllObsLinkOverview,500)
    }

    function setClickListener(){
        window[5].document.querySelector("body > table > tbody > tr:nth-child(5) > td > table > tbody > tr > td:nth-child(2)").onclick = menu_clicked
        window[5].document.querySelector("body > table > tbody > tr:nth-child(7) > td > table > tbody > tr > td:nth-child(2) > b > font > select").onclick = menu_clicked
        window[6].onclick = main_clicked
        window[8].onclick = main_clicked
    }





    //   _____________________________
    //  |                             |
    //  |        Notification         |
    //  |_____________________________|



    /////---------------------------

    var bell = new Audio("https://www.tones7.com/media/sweet_text.mp3")
    var bell2 = new Audio("https://www.tones7.com/media/sweet_text.mp3")

    var idleTime = 0;
    var check_Intervall

    var bellTimeout = false

    function ResetIdleTime(){
        idleTime = 0
    }

    function updateUebersicht(){
        idleTime = 0
        if(debug)console.log("Update")
        window[5].document.querySelector("body > table > tbody > tr:nth-child(5) > td > table > tbody > tr > td:nth-child(2) > a:nth-child(3)").click()

    }

    function timerIncrement() {
        idleTime = idleTime + 1;
       // if(debug)console.log("IdleTime: " + idleTime)
        checkForMessages()
        if (idleTime > 150 + Math.floor(Math.random() * 20) ){ // about 3 minutes
            updateUebersicht();
        }
    }

    function checkForMessages(){
        if(!saveFile.notification_enabled)return
        var nachricht = false
        for (const a of window[6].document.querySelectorAll("a")) {
            if (a.textContent.includes("Nachricht")) {
                nachricht = true
            }
        }
        var ereignis = false
        for (const a of window[6].document.querySelectorAll("a")) {
            if (a.textContent.includes("Es liegt ein neues Ereignis vor.") || a.textContent.includes("neue Ereignisse vor.")) {
                ereignis = true
            }
        }
        if(nachricht || ereignis){ // Bedingung für Message Sound
            if(idleTime > 10 && !bellTimeout){
                bellTimeout = true
                playBell()
                setTimeout(playBell2,700)
                setTimeout(bellEnable,8000)
            }
        }
    }

    function bellEnable(){
        bellTimeout = false
    }

    function playBell(){
        bell.play()
    }
    function playBell2(){
        bell2.play()
    }




    //   _____________________________
    //  |                             |
    //  |         Ress Saven          |
    //  |_____________________________|

    var hideSaveTrades_COUNTER = 0

    function hideSaveTrades(){
        hideSaveTrades_COUNTER++
        if(hideSaveTrades_COUNTER > 15){
            hideSaveTrades_COUNTER = 0
            return
           }
        try {
             if(!window[6].document.querySelector("body").innerText.includes("Transaktionen für Planet")){
                 setTimeout(hideSaveTrades,200)
                 return
             }
            }catch{
                setTimeout(hideSaveTrades,200)
                return
            }

        hideSaveTrades_COUNTER = 0
        try {

            if(debug)console.log("Savehandel ausblenden")
            var tradesTable = window[6].document.querySelector("body > table > tbody > tr:nth-child(2) > td > table > tbody > tr > td:nth-child(2) > table")
            var tradesRows = tradesTable.getElementsByTagName("tr");
            var i = 1
            for (i in tradesRows) {
                if(tradesRows[i].innerHTML.includes("#SAVE#") && !tradesRows[i-1].innerHTML.includes("abbrechen")){
                    tradesRows[i].setAttribute("hidden", "hidden")
                    tradesRows[i-1].setAttribute("hidden", "hidden")
                }
            }
        }catch (error) {
        }
        countSaveRes()

    }


    function checkRes(indexRes){
        try {
            //console.log("checkRes")
            var tradeCost = window[6].document.querySelector("body > table > tbody > tr:nth-child(2) > td > table > tbody > tr > td:nth-child(2) > form > table > tbody > tr:nth-child(2) > td:nth-child(3)").innerText.match(/\d/g)
            if (tradeCost.length > 0) tradeCost = tradeCost.join(".")
            var resAvail = [0,0,0,0,0,0]
            resAvail[0] = window[4].document.getElementById("res0").innerText.replace('.', '');
            resAvail[1] = window[4].document.getElementById("res1").innerText.replace('.', '');
            resAvail[2] = window[4].document.getElementById("res2").innerText.replace('.', '');
            resAvail[3] = window[4].document.getElementById("res3").innerText.replace('.', '');
            resAvail[4] = window[4].document.getElementById("res4").innerText.replace('.', '');
            resAvail[5] = window[4].document.getElementById("res5").innerText.replace('.', '');
            var elementName = "tf_res["+indexRes+"]"
            var resInput = window[6].document.getElementsByName(elementName)[0].value
            //console.log(resInput)
            //console.log(resAvail[indexRes])
            if ( resInput > Math.floor((resAvail[indexRes]*((100-tradeCost)/100))/10)*10) window[6].document.getElementsByName(elementName)[0].value = Math.floor((resAvail[indexRes]*((100-tradeCost)/100))/10)*10
        }catch (error) {
        }
    }


    var generateTradePage_COUNTER = 0

    function generateTradePage(){
        generateTradePage_COUNTER++
        if(generateTradePage_COUNTER>15){
            generateTradePage_COUNTER = 0
            return
        }
        try {
            if(!window[6].document.querySelector("body").innerText.includes("Handelsauftrag")){
                setTimeout(generateTradePage,200)
                return
            }
        }
        catch{
            setTimeout(generateTradePage,200)
            return
        }
        generateTradePage_COUNTER = 0
        if(debug)console.log("Save Button einblenden")

        const now = new Date();
        window[6].document.getElementsByName("trade_comment")[0].value = ("0" + now.getHours() ).slice(-2) + ":" + ("0" + now.getMinutes()).slice(-2)

        var elementBeforeButtons = window[6].document.querySelector("body > table > tbody > tr:nth-child(2) > td > table > tbody > tr > td:nth-child(2) > form > table > tbody > tr:nth-child(4)")
        var all_save_buttons = parseHTML('<tr><td bgcolor="" class="first" colspan="4" align="center">[ <a id="save_button" href="#">sichern</a> ]</td></tr>')
        elementBeforeButtons.after(all_save_buttons)
        window[6].document.getElementById("save_button").addEventListener("click", tradeToSave)

        generateX()
        generateTradeToolPage()
        generateShipMarket()


    }

    function generateX(){
        const parent_FeA = window[6].document.querySelector("#tf_res0").parentElement
        const parent_KrA = window[6].document.querySelector("#tf_res1").parentElement
        const parent_FbA = window[6].document.querySelector("#tf_res2").parentElement
        const parent_OrA = window[6].document.querySelector("#tf_res3").parentElement
        const parent_FrA = window[6].document.querySelector("#tf_res4").parentElement
        const parent_AuA = window[6].document.querySelector("#tf_res5").parentElement
        const parent_FeF = window[6].document.querySelector("#tt_res0").parentElement
        const parent_KrF = window[6].document.querySelector("#tt_res1").parentElement
        const parent_FbF = window[6].document.querySelector("#tt_res2").parentElement
        const parent_OrF = window[6].document.querySelector("#tt_res3").parentElement
        const parent_FrF = window[6].document.querySelector("#tt_res4").parentElement
        const parent_AuF = window[6].document.querySelector("#tt_res5").parentElement
        const x_FeA = parseHTML('&nbsp;&nbsp;<a id = "x_FeA" href="#">X</a>')
        const x_KrA = parseHTML('&nbsp;&nbsp;<a id = "x_KrA" href="#">X</a>')
        const x_FbA = parseHTML('&nbsp;&nbsp;<a id = "x_FbA" href="#">X</a>')
        const x_OrA = parseHTML('&nbsp;&nbsp;<a id = "x_OrA" href="#">X</a>')
        const x_FrA = parseHTML('&nbsp;&nbsp;<a id = "x_FrA" href="#">X</a>')
        const x_AuA = parseHTML('&nbsp;&nbsp;<a id = "x_AuA" href="#">X</a>')
        const x_FeF = parseHTML('&nbsp;&nbsp;<a id = "x_FeF" href="#">X</a>')
        const x_KrF = parseHTML('&nbsp;&nbsp;<a id = "x_KrF" href="#">X</a>')
        const x_FbF = parseHTML('&nbsp;&nbsp;<a id = "x_FbF" href="#">X</a>')
        const x_OrF = parseHTML('&nbsp;&nbsp;<a id = "x_OrF" href="#">X</a>')
        const x_FrF = parseHTML('&nbsp;&nbsp;<a id = "x_FrF" href="#">X</a>')
        const x_AuF = parseHTML('&nbsp;&nbsp;<a id = "x_AuF" href="#">X</a>')
        parent_FeA.appendChild(x_FeA)
        parent_KrA.appendChild(x_KrA)
        parent_FbA.appendChild(x_FbA)
        parent_OrA.appendChild(x_OrA)
        parent_FrA.appendChild(x_FrA)
        parent_AuA.appendChild(x_AuA)
        parent_FeF.appendChild(x_FeF)
        parent_KrF.appendChild(x_KrF)
        parent_FbF.appendChild(x_FbF)
        parent_OrF.appendChild(x_OrF)
        parent_FrF.appendChild(x_FrF)
        parent_AuF.appendChild(x_AuF)
        window[6].document.getElementById("x_FeA").onclick = function() {window[6].document.querySelector("#tf_res0").value = ""}
        window[6].document.getElementById("x_KrA").onclick = function() {window[6].document.querySelector("#tf_res1").value = ""}
        window[6].document.getElementById("x_FbA").onclick = function() {window[6].document.querySelector("#tf_res2").value = ""}
        window[6].document.getElementById("x_OrA").onclick = function() {window[6].document.querySelector("#tf_res3").value = ""}
        window[6].document.getElementById("x_FrA").onclick = function() {window[6].document.querySelector("#tf_res4").value = ""}
        window[6].document.getElementById("x_AuA").onclick = function() {window[6].document.querySelector("#tf_res5").value = ""}
        window[6].document.getElementById("x_FeF").onclick = function() {window[6].document.querySelector("#tt_res0").value = ""}
        window[6].document.getElementById("x_KrF").onclick = function() {window[6].document.querySelector("#tt_res1").value = ""}
        window[6].document.getElementById("x_FbF").onclick = function() {window[6].document.querySelector("#tt_res2").value = ""}
        window[6].document.getElementById("x_OrF").onclick = function() {window[6].document.querySelector("#tt_res3").value = ""}
        window[6].document.getElementById("x_FrF").onclick = function() {window[6].document.querySelector("#tt_res4").value = ""}
        window[6].document.getElementById("x_AuF").onclick = function() {window[6].document.querySelector("#tt_res5").value = ""}
    }

    function resChecker(){
        try {
            window[6].document.getElementsByName("tf_res[0]")[0].oninput = checkRes(0)
            window[6].document.getElementsByName("tf_res[0]")[0].oninput = checkRes(1)
            window[6].document.getElementsByName("tf_res[0]")[0].oninput = checkRes(2)
            window[6].document.getElementsByName("tf_res[0]")[0].oninput = checkRes(3)
            window[6].document.getElementsByName("tf_res[0]")[0].oninput = checkRes(4)
            window[6].document.getElementsByName("tf_res[0]")[0].oninput = checkRes(5)
            setTimeout(resChecker, 500);
        }catch (error) {
        }
    }

    function tradeToSave(){
        const heute = new Date();
        var h = (heute.getHours()+8)%24+""
        var m = heute.getMinutes()+""
        window[6].document.getElementsByName("tt_res[0]")[0].value = ""
        window[6].document.getElementsByName("tt_res[5]")[0].value = 99999999
        window[6].document.getElementsByName("trade_comment")[0].value = "#SAVE# Ende " + h.padStart(2, '0')+":" + m.padStart(2, '0') + " #SAVE#"
        if(saveFile.saveCoords ==""){
            var planet_selector = window[5].document.querySelector("body > table > tbody > tr:nth-child(7) > td > table > tbody > tr > td:nth-child(2) > b > font > select")
            var save_planetNR = 0
            if (planet_selector.selectedIndex == 0) save_planetNR = 1
            window[6].document.getElementsByName("target")[0].value = planet_selector.options[save_planetNR].innerHTML
        }
        else window[6].document.getElementsByName("target")[0].value = saveFile.saveCoords
    }


    function parseHTML(html) {
        var t = document.createElement('template');
        t.innerHTML = html;
        return t.content;
    }


    //   _____________________________
    //  |                             |
    //  |         Log Trades          |
    //  |_____________________________|

    var addLogButton_COUNTER = 0

    function addLogButton(){
        if(!saveFile.tradeLogTool_enabled)return
        try {
            if(window[6].document.querySelector("body > table > tbody > tr:nth-child(1) > td > table > tbody > tr > td:nth-child(3) > font > b > font").innerText.match(/\b(\w+)\b/g) != "Handel") return
            addLogButton_COUNTER++
            var test = window[6].document.querySelector("body > table > tbody > tr:nth-child(3) > td > table > tbody > tr > td:nth-child(2)")
            if (test == null){
                if(addLogButton_COUNTER < 10)setTimeout(addLogButton,200)
                return
            }
        }catch (error) {
        }
        addLogButton_COUNTER = 0
        const user = window[5].document.querySelector("body > table > tbody > tr:nth-child(3) > td > table > tbody > tr > td:nth-child(2) > b > font").innerText
        
        if(debug)console.log("Handellog Button hinzufügen")
        const trader = window[6].document.querySelector("body > table > tbody > tr:nth-child(2) > td > table > tbody > tr > td:nth-child(2) > table > tbody > tr:nth-child(3) > td:nth-child(2)").innerText
        if(trader.includes(user)) return
        window[6].document.querySelector("body > table > tbody > tr:nth-child(2) > td > table > tbody > tr > td:nth-child(2) > table > tbody > tr:nth-child(9) > td").innerHTML += '[  <a href="#" id="logTrade">Annehmen + Log</a>  ]'
    }

    function logTrade(){
        if(debug)console.log("Log Trade")

        var date = new Date();
        window[6].onclick = ""
        var resString = window[6].document.querySelector("body > table > tbody > tr:nth-child(2) > td > table > tbody > tr > td:nth-child(2) > table > tbody > tr:nth-child(6) > td:nth-child(2)").innerText
        var ress = [0,0,0,0,0,0]
        if(resString.includes("Roheisen")) ress[0] = resString.match(/([\d.]+) *Roheisen/)[1];
        if(resString.includes("Kristalle")) ress[1] = resString.match(/([\d.]+) *Kristalle/)[1];
        if(resString.includes("Frubin")) ress[2] = resString.match(/([\d.]+) *Frubin/)[1];
        if(resString.includes("Orizin")) ress[3] = resString.match(/([\d.]+) *Orizin/)[1];
        if(resString.includes("Frurozin")) ress[4] = resString.match(/([\d.]+) *Frurozin/)[1];
        if(resString.includes("Gold")) ress[5] = resString.match(/([\d.]+) *Gold/)[1];

        fetch('https://sheetdb.io/api/v1/2vz28vdzqhslv?sheet=Datenbank', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                data: [
                    {
                        'Zeitstempel': date.getFullYear() + "-" + ("0" + (date.getMonth() + 1)).slice(-2) + "-" + ("0" + date.getDate()).slice(-2) + " " + ("0" + date.getHours() ).slice(-2) + ":" + ("0" + date.getMinutes()).slice(-2) + ":" + ("0" + date.getSeconds()).slice(-2),
                        'eingetragen von': window[5].document.querySelector("body > table > tbody > tr:nth-child(3) > td > table > tbody > tr > td:nth-child(2) > b > font").innerText,
                        'Ziel': window[6].document.querySelector("body > table > tbody > tr:nth-child(2) > td > table > tbody > tr > td:nth-child(2) > table > tbody > tr:nth-child(2) > td:nth-child(2)").innerText,
                        'Besitzer': window[6].document.querySelector("body > table > tbody > tr:nth-child(2) > td > table > tbody > tr > td:nth-child(2) > table > tbody > tr:nth-child(3) > td:nth-child(2)").innerText,
                        'Kommentar': window[6].document.querySelector("body > table > tbody > tr:nth-child(2) > td > table > tbody > tr > td:nth-child(2) > table > tbody > tr:nth-child(4) > td:nth-child(2)").innerText,
                        'Roheisen': ress[0],
                        'Kristall': ress[1],
                        'Frubin': ress[2],
                        'Orizin': ress[3],
                        'Frurozin': ress[4],
                        'Gold': ress[5]

                    }
                ]
            })
        })
            .then((response) => response.json())
        //.then((data) => console.log(data));;

        window[6].document.querySelector("body > table > tbody > tr:nth-child(2) > td > table > tbody > tr > td:nth-child(2) > table > tbody > tr:nth-child(9) > td > a:nth-child(2)").click()
        //window[6].document.querySelector("body > table > tbody > tr:nth-child(2) > td > table > tbody > tr > td:nth-child(2) > div > a:nth-child(1)").click()
    }


    //   _____________________________
    //  |                             |
    //  |     Save Trade Overview     |
    //  |_____________________________|

    var countSaveRes_COUNTER = 0

    function countSaveRes(){
        const expression_FE = /Roheisen: (\d+)/i;
        const expression_KR = /Kristalle: (\d+)/i;
        const expression_FB = /Frubin: (\d+)/i;
        const expression_OR = /Orizin: (\d+)/i;
        const expression_FR = /Frurozin: (\d+)/i;
        const expression_AU = /Gold: (\d+)/i;
        try {
            countSaveRes_COUNTER ++
            var test = window[6].document.querySelector("body > table > tbody > tr:nth-child(3) > td > table > tbody > tr > td:nth-child(2)")
            if (test == null){
                if(countSaveRes_COUNTER < 10)setTimeout(countSaveRes,200)
                return
            }
        }catch (error) {
        }
        var ress = [0,0,0,0,0,0]
        try {
            countSaveRes_COUNTER = 0
            if(debug)console.log("SaveRes Zähler")
            var tradesTable = window[6].document.querySelector("body > table > tbody > tr:nth-child(2) > td > table > tbody > tr > td:nth-child(2) > table")
            var tradesRows = tradesTable.getElementsByTagName("tr");
            var i = 1
            var resString = ""
            
            for (i in tradesRows) {
                if(tradesRows[i].innerHTML.includes("#SAVE#") && tradesRows[i-1].innerHTML.includes("abbrechen")){
                    resString = tradesRows[i-1].cells[1].innerText
                    ress[0] += findNumber(resString, expression_FE)
                    ress[1] += findNumber(resString, expression_KR)
                    ress[2] += findNumber(resString, expression_FB)
                    ress[3] += findNumber(resString, expression_OR)
                    ress[4] += findNumber(resString, expression_FR)
                    ress[5] += findNumber(resString, expression_AU)
                }
            }
        }catch (error) {
        }

        var ressSum = 0
        for(let i = 0; i < ress.length; i++){
            ressSum += ress[i]
        }
        if(ressSum > 0)generateSaveResTable(ress)
        else countRunningTrades()
    }

    function generateSaveResTable(ress){
        const tbl = document.createElement('table');
        tbl.border="0"
        tbl.cellSpacing="1"
        tbl.cellPadding="1"
        const titelTr = tbl.insertRow();
        const titelTd = titelTr.insertCell();
        const titel = document.createElement("b")
        titel.innerText = "Total Ressourcen in Savehandel"
        titelTd.className="first"
        titelTd.colSpan = "6"
        titelTd.style.textAlign = "center"
        titelTd.appendChild(titel);
        for (let i = 0; i < 2; i++) {
            const tr = tbl.insertRow();
            for (let j = 0; j < 6; j++) {
                const td = tr.insertCell();
                var content = document.createElement("b")
                if (i==0){
                    td.className="first"
                    td.style.width = '69px'
                    td.style.textAlign = "right"
                    switch(j) {
                        case 0:
                            content = parseHTML('&nbsp;<b>Roheisen</b>&nbsp;'); break;
                        case 1:
                            content = parseHTML('&nbsp;<b>Kristalle</b>&nbsp;'); break;
                        case 2:
                            content = parseHTML('&nbsp;<b>Frubin</b>&nbsp;'); break;
                        case 3:
                            content = parseHTML('&nbsp;<b>Orizin</b>&nbsp;'); break;
                        case 4:
                            content = parseHTML('&nbsp;<b>Frurozin</b>&nbsp;'); break;
                        case 5:
                            content = parseHTML('&nbsp;<b>Gold</b>&nbsp;'); break;
                    }
                }
                if (i==1){
                    td.className="second"
                    td.style.textAlign = "right"
                    content = document.createElement("a")
                    content.innerText = ress[j].toLocaleString("de-CH");
                }
                td.appendChild(content);
            }
        }
        const parentDiv = window[6].document.querySelector("body > table > tbody > tr:nth-child(2) > td > table > tbody > tr > td:nth-child(2)")
        const tradeTable = window[6].document.querySelector("body > table > tbody > tr:nth-child(2) > td > table > tbody > tr > td:nth-child(2) > table")
        parentDiv.insertBefore(tbl,tradeTable);
        parentDiv.insertBefore(document.createElement("p"),tradeTable);

        countRunningTrades()

    }

    function findNumber(text, expression){
        const match = expression.exec(text);
        if (match) {
            return Number(match[1]);
        }
        return 0;
    }


    //   ________________________________
    //  |                                |
    //  |     Running Trade Overview     |
    //  |________________________________|

    function generateRunningTradeResTable(ress){
        const tbl = document.createElement('table');
        tbl.border="0"
        tbl.cellSpacing="1"
        tbl.cellPadding="1"
        const titelTr = tbl.insertRow();
        const titelTd = titelTr.insertCell();
        const titel = document.createElement("b")
        titel.innerText = "Total Ressourcen in eingehenden Handel"
        titelTd.className="first"
        titelTd.colSpan = "6"
        titelTd.style.textAlign = "center"
        titelTd.appendChild(titel);
        for (let i = 0; i < 2; i++) {
            const tr = tbl.insertRow();
            for (let j = 0; j < 6; j++) {
                const td = tr.insertCell();
                var content = document.createElement("b")
                if (i==0){
                    td.className="first"
                    td.style.width = '69px'
                    td.style.textAlign = "right"
                    switch(j) {
                        case 0:
                            content = parseHTML('&nbsp;<b>Roheisen</b>&nbsp;'); break;
                        case 1:
                            content = parseHTML('&nbsp;<b>Kristalle</b>&nbsp;'); break;
                        case 2:
                            content = parseHTML('&nbsp;<b>Frubin</b>&nbsp;'); break;
                        case 3:
                            content = parseHTML('&nbsp;<b>Orizin</b>&nbsp;'); break;
                        case 4:
                            content = parseHTML('&nbsp;<b>Frurozin</b>&nbsp;'); break;
                        case 5:
                            content = parseHTML('&nbsp;<b>Gold</b>&nbsp;'); break;
                    }
                }
                if (i==1){
                    td.className="second"
                    if(ress[j] >= (currentStorageCapa[j]*0.9)) td.style ="background-color: #F46F22"
                    if(ress[j] >= currentStorageCapa[j])td.style ="background-color: #FF0000"
                    td.style.textAlign = "right"
                    content = document.createElement("a")
                    content.innerText = ress[j].toLocaleString("de-CH");
                }
                td.appendChild(content);
            }
        }
        const parentDiv = window[6].document.querySelector("body > table > tbody > tr:nth-child(2) > td > table > tbody > tr > td:nth-child(2)")
        const tradeTable = window[6].document.querySelector("body > table > tbody > tr:nth-child(2) > td > table > tbody > tr > td:nth-child(2) > table")
        parentDiv.insertBefore(tbl,tradeTable);
        parentDiv.insertBefore(document.createElement("p"),tradeTable);
    }

    var currentStorageCapa = new Array(0,0,0,0,0,0)

    function countRunningTrades(){

        var table = window[6].document.querySelector("body > table > tbody > tr:nth-child(2) > td > table > tbody > tr > td:nth-child(2) > table:nth-child(6) > tbody")
        if(table == null) table = window[6].document.querySelector("body > table > tbody > tr:nth-child(2) > td > table > tbody > tr > td:nth-child(2) > table > tbody")

        var tableRows = table.children
        var ress = [0,0,0,0,0,0]

        const expression_FE = /Roheisen: (\d+)/i;
        const expression_KR = /Kristalle: (\d+)/i;
        const expression_FB = /Frubin: (\d+)/i;
        const expression_OR = /Orizin: (\d+)/i;
        const expression_FR = /Frurozin: (\d+)/i;
        const expression_AU = /Gold: (\d+)/i;

        for (let i = 2; i < tableRows.length; i++) {
            if(tableRows[i].children.length == 6 ){
                var resString = ""
                if(tradeIsRunning(tableRows[i]) && !isOutgoingTrade(tableRows[i])){
                    resString = tableRows[i].children[1].innerText
                    }
                if(tradeIsRunning(tableRows[i]) && isOutgoingTrade(tableRows[i])){
                    resString = tableRows[i].children[3].innerText
                    }
                ress[0] += findNumber(resString, expression_FE)
                ress[1] += findNumber(resString, expression_KR)
                ress[2] += findNumber(resString, expression_FB)
                ress[3] += findNumber(resString, expression_OR)
                ress[4] += findNumber(resString, expression_FR)
                ress[5] += findNumber(resString, expression_AU)
            }
        }
        var ressSum = 0
        for(let i = 0; i < ress.length; i++){
            ressSum += ress[i]
        }
        if(ressSum > 0)generateRunningTradeResTable(ress)
    }

    function tradeIsRunning(tr){
        const str = tr.children[5].innerText
        return str.includes("00:")
    }

    function isOutgoingTrade(tr){
        const coords = tr.children[0].innerHTML.replace(/\&nbsp;/g, '')
        return coords == getCurrentCoords()
    }

    function setCurrentStorageCapa(){
        currentStorageCapa = window[4].rm
    }



    //   ________________________________
    //  |                                |
    //  |       Handel Tool Gebäude      |
    //  |________________________________|

    var select
    var input_lvl

    function generateSelector(){
        var values = getBuildNames();
        select = document.createElement("select");
        select.name = "buildSelect";
        select.id = "buildSelect"
        //if (window.innerWidth > 600) select.style.fontSize = "17px";
        //else select.style.fontSize = "12px";
        select.addEventListener ("change", function () {
            updateTable1()
        })

        var optionGroup_haupt = document.createElement('OPTGROUP')
        optionGroup_haupt.label = "Hauptgebäude"
        var optionGroup_res = document.createElement('OPTGROUP')
        optionGroup_res.label = "Rohstoffgebäude"
        var optionGroup_lager = document.createElement('OPTGROUP')
        optionGroup_lager.label = "Lagergebäude"
        var optionGroup_energie = document.createElement('OPTGROUP')
        optionGroup_energie.label = "Energiegebäude"
        var optionGroup_rsf = document.createElement('OPTGROUP')
        optionGroup_rsf.label = "Raumschiff- und Verteidigungsgebäude"
        var optionGroup_handel = document.createElement('OPTGROUP')
        optionGroup_handel.label = "Handelsgebäude"
        var optionGroup_special = document.createElement('OPTGROUP')
        optionGroup_special.label = "Special Building"

        for (var i= 0; i < 10; i++) {
            if(build[i]!=null){
                var option = document.createElement("option");
                option.value = i
                option.text = build[i][STRING]
                optionGroup_haupt.appendChild(option);
            }

        }
        select.appendChild(optionGroup_haupt)

        for ( i= 10; i < 20; i++) {
            if(build[i]!=null){
                option = document.createElement("option");
                option.value = i
                option.text = build[i][STRING]
                optionGroup_res.appendChild(option);
            }

        }
        select.appendChild(optionGroup_res)

        for ( i= 20; i < 30; i++) {
            if(build[i]!=null){
                option = document.createElement("option");
                option.value = i
                option.text = build[i][STRING]
                optionGroup_lager.appendChild(option);
            }

        }
        select.appendChild(optionGroup_lager)

        for ( i= 30; i < 40; i++) {
            if(build[i]!=null){
                option = document.createElement("option");
                option.value = i
                option.text = build[i][STRING]
                optionGroup_energie.appendChild(option);
            }

        }
        select.appendChild(optionGroup_energie)

        for ( i= 40; i < 50; i++) {
            if(build[i]!=null){
                option = document.createElement("option");
                option.value = i
                option.text = build[i][STRING]
                optionGroup_rsf.appendChild(option);
            }

        }
        select.appendChild(optionGroup_rsf)

        for ( i= 50; i < 60; i++) {
            if(build[i]!=null){
                option = document.createElement("option");
                option.value = i
                option.text = build[i][STRING]
                optionGroup_handel.appendChild(option);
            }

        }
        select.appendChild(optionGroup_handel)

        for ( i= 60; i < 70; i++) {
            if(build[i]!=null){
                option = document.createElement("option");
                option.value = i
                option.text = build[i][STRING]
                optionGroup_special.appendChild(option);
            }

        }
        select.appendChild(optionGroup_special)
        select.value = 1

    }

    function updateTable1(){
        updateLvl()
        var id = select.value
        var currentRes = build[id][RES](checkLvl(id))
        window[6].document.getElementById("input-lvl").value = checkLvl(id)+1
        window[6].document.getElementById("tab_res_fe").innerText = currentRes[RES_FE]
        window[6].document.getElementById("tab_res_kr").innerText = currentRes[RES_KR]
        window[6].document.getElementById("tab_res_fr").innerText = currentRes[RES_FR]
        window[6].document.getElementById("tab_res_or").innerText = currentRes[RES_OR]
        window[6].document.getElementById("tab_res_fu").innerText = currentRes[RES_FU]
        window[6].document.getElementById("tab_res_au").innerText = currentRes[RES_AU]
    }

    function updateTable2(){
        updateLvl()
        var id = select.value
        var lvl_input = window[6].document.getElementById("input-lvl").value
        if(lvl_input < 1) {
            window[6].document.getElementById("input-lvl").value = 1
            lvl_input = 1
        }
        var currentRes = build[id][RES](lvl_input-1)
        window[6].document.getElementById("tab_res_fe").innerText = currentRes[RES_FE]
        window[6].document.getElementById("tab_res_kr").innerText = currentRes[RES_KR]
        window[6].document.getElementById("tab_res_fr").innerText = currentRes[RES_FR]
        window[6].document.getElementById("tab_res_or").innerText = currentRes[RES_OR]
        window[6].document.getElementById("tab_res_fu").innerText = currentRes[RES_FU]
        window[6].document.getElementById("tab_res_au").innerText = currentRes[RES_AU]
    }

    var getBuildLvl_COUNTER = 0

    function resetBuild(){
        build[INDEX_HQ][LVL] = ""
        build[INDEX_BZ][LVL] = ""
        build[INDEX_FZ][LVL] = ""
        build[INDEX_SS][LVL] = ""
        build[INDEX_FE][LVL] = ""
        build[INDEX_KR][LVL] = ""
        build[INDEX_FR][LVL] = ""
        build[INDEX_OR][LVL] = ""
        build[INDEX_FU][LVL] = ""
        build[INDEX_AU][LVL] = ""
        build[INDEX_FEL][LVL] = ""
        build[INDEX_KRL][LVL] = ""
        build[INDEX_FRL][LVL] = ""
        build[INDEX_ORL][LVL] = ""
        build[INDEX_FUL][LVL] = ""
        build[INDEX_AUL][LVL] = ""
        build[INDEX_KKW][LVL] = ""
        build[INDEX_FKW][LVL] = ""
        build[INDEX_RSF][LVL] = ""
        build[INDEX_VTS][LVL] = ""
        build[INDEX_SPA][LVL] = ""
        build[INDEX_FWA][LVL] = ""
        build[INDEX_HP][LVL] = ""
        build[INDEX_HZ][LVL] = ""
        build[INDEX_BA][LVL] = ""
        build[INDEX_GDZ][LVL] = ""
        build[INDEX_KRE][LVL] = ""
        build[INDEX_WER][LVL] = ""
        build[INDEX_REC][LVL] = ""
    }

    function getBuildLvl(){
        getBuildLvl_COUNTER++
        var sringSplit = ""
        try {
            var string = window[6].document.querySelector("body > table > tbody > tr:nth-child(2) > td > table > tbody > tr > td:nth-child(2)").innerText
            if(!string.includes("Handelsgebäude"))setTimeout(getBuildLvl,200)
            sringSplit = string.split("\n")
        } catch (error) {
            getBuildLvl_COUNTER ++
            if(getBuildLvl_COUNTER>20){
                getBuildLvl_COUNTER = 0
                return
            }
            setTimeout(getBuildLvl,200)
        }

        getBuildLvl_COUNTER = 0

        build[INDEX_HQ][LVL] = ""
        build[INDEX_BZ][LVL] = ""
        build[INDEX_FZ][LVL] = ""
        build[INDEX_SS][LVL] = ""
        build[INDEX_FE][LVL] = ""
        build[INDEX_KR][LVL] = ""
        build[INDEX_FR][LVL] = ""
        build[INDEX_OR][LVL] = ""
        build[INDEX_FU][LVL] = ""
        build[INDEX_AU][LVL] = ""
        build[INDEX_FEL][LVL] = ""
        build[INDEX_KRL][LVL] = ""
        build[INDEX_FRL][LVL] = ""
        build[INDEX_ORL][LVL] = ""
        build[INDEX_FUL][LVL] = ""
        build[INDEX_AUL][LVL] = ""
        build[INDEX_KKW][LVL] = ""
        build[INDEX_FKW][LVL] = ""
        build[INDEX_RSF][LVL] = ""
        build[INDEX_VTS][LVL] = ""
        build[INDEX_SPA][LVL] = ""
        build[INDEX_FWA][LVL] = ""
        build[INDEX_HP][LVL] = ""
        build[INDEX_HZ][LVL] = ""
        build[INDEX_BA][LVL] = ""
        build[INDEX_GDZ][LVL] = ""
        build[INDEX_KRE][LVL] = ""
        build[INDEX_WER][LVL] = ""
        build[INDEX_REC][LVL] = ""

        for (let i = 0; i < sringSplit.length-1; i++) {

            //Hauptgebäude
            if(sringSplit[i].includes("Hauptquartier Stufe")){
                build[INDEX_HQ][LVL] = parseInt(sringSplit[i].match(/[0-9]+/)[0])
                if(sringSplit[i+1].includes("%")) build[INDEX_HQ][LVL]++
            }
            if(sringSplit[i].includes("Bauzentrale Stufe")){
                build[INDEX_BZ][LVL] = parseInt(sringSplit[i].match(/[0-9]+/)[0])
                if(sringSplit[i+1].includes("%")) build[INDEX_BZ][LVL]++
            }
            if(sringSplit[i].includes("Forschungszentrale Stufe")){
                build[INDEX_FZ][LVL] = parseInt(sringSplit[i].match(/[0-9]+/)[0])
                if(sringSplit[i+1].includes("%")) build[INDEX_FZ][LVL]++
            }
            if(sringSplit[i].includes("Spionagestation Stufe")){
                build[INDEX_SS][LVL] = parseInt(sringSplit[i].match(/[0-9]+/)[0])
                if(sringSplit[i+1].includes("%")) build[INDEX_SS][LVL]++
            }

            //Rohstoffgebäude
            if(sringSplit[i].includes("Roheisen Mine Stufe")){
                build[INDEX_FE][LVL] = parseInt(sringSplit[i].match(/[0-9]+/)[0])
                if(sringSplit[i+1].includes("%")) build[INDEX_FE][LVL]++
            }
            if(sringSplit[i].includes("Kristall Förderungsanlage Stufe")){
                build[INDEX_KR][LVL] = parseInt(sringSplit[i].match(/[0-9]+/)[0])
                if(sringSplit[i+1].includes("%")) build[INDEX_KR][LVL]++
            }
            if(sringSplit[i].includes("Frubin Sammler Stufe")){
                build[INDEX_FR][LVL] = parseInt(sringSplit[i].match(/[0-9]+/)[0])
                if(sringSplit[i+1].includes("%")) build[INDEX_FR][LVL]++
            }
            if(sringSplit[i].includes("Orizin Gewinnungsanlage Stufe")){
                build[INDEX_OR][LVL] = parseInt(sringSplit[i].match(/[0-9]+/)[0])
                if(sringSplit[i+1].includes("%")) build[INDEX_OR][LVL]++
            }
            if(sringSplit[i].includes("Frurozin Herstellung Stufe")){
                build[INDEX_FU][LVL] = parseInt(sringSplit[i].match(/[0-9]+/)[0])
                if(sringSplit[i+1].includes("%")) build[INDEX_FU][LVL]++
            }
            if(sringSplit[i].includes("Goldmine Stufe")){
                build[INDEX_AU][LVL] = parseInt(sringSplit[i].match(/[0-9]+/)[0])
                if(sringSplit[i+1].includes("%")) build[INDEX_AU][LVL]++
            }

            //Lagergebäude
            if(sringSplit[i].includes("Roheisen Lager Stufe")){
                build[INDEX_FEL][LVL] = parseInt(sringSplit[i].match(/[0-9]+/)[0])
                if(sringSplit[i+1].includes("%")) build[INDEX_FEL][LVL]++
            }
            if(sringSplit[i].includes("Kristall Lager Stufe")){
                build[INDEX_KRL][LVL] = parseInt(sringSplit[i].match(/[0-9]+/)[0])
                if(sringSplit[i+1].includes("%")) build[INDEX_KRL][LVL]++
            }
            if(sringSplit[i].includes("Frubin Lager Stufe")){
                build[INDEX_FRL][LVL] = parseInt(sringSplit[i].match(/[0-9]+/)[0])
                if(sringSplit[i+1].includes("%")) build[INDEX_FRL][LVL]++
            }
            if(sringSplit[i].includes("Orizin Lager Stufe")){
                build[INDEX_ORL][LVL] = parseInt(sringSplit[i].match(/[0-9]+/)[0])
                if(sringSplit[i+1].includes("%")) build[INDEX_ORL][LVL]++
            }
            if(sringSplit[i].includes("Frurozin Lager Stufe")){
                build[INDEX_FUL][LVL] = parseInt(sringSplit[i].match(/[0-9]+/)[0])
                if(sringSplit[i+1].includes("%")) build[INDEX_FUL][LVL]++
            }
            if(sringSplit[i].includes("Gold Lager Stufe")){
                build[INDEX_AUL][LVL] = parseInt(sringSplit[i].match(/[0-9]+/)[0])
                if(sringSplit[i+1].includes("%")) build[INDEX_AUL][LVL]++
            }

            //Energiegebäude
            if(sringSplit[i].includes("Kernkraftwerk Stufe")){
                build[INDEX_KKW][LVL] = parseInt(sringSplit[i].match(/[0-9]+/)[0])
                if(sringSplit[i+1].includes("%")) build[INDEX_KKW][LVL]++
            }
            if(sringSplit[i].includes("Fusionskraftwerk Stufe")){
                build[INDEX_FKW][LVL] = parseInt(sringSplit[i].match(/[0-9]+/)[0])
                if(sringSplit[i+1].includes("%")) build[INDEX_FKW][LVL]++
            }

            //Raumschiff- und Verteidigungs-Gebäude
            if(sringSplit[i].includes("Raumschiff Fabrik Stufe")){
                build[INDEX_RSF][LVL] = parseInt(sringSplit[i].match(/[0-9]+/)[0])
                if(sringSplit[i+1].includes("%")) build[INDEX_RSF][LVL]++
            }
            if(sringSplit[i].includes("Verteidigungsstation Stufe")){
                build[INDEX_VTS][LVL] = parseInt(sringSplit[i].match(/[0-9]+/)[0])
                if(sringSplit[i+1].includes("%")) build[INDEX_VTS][LVL]++
            }
            if(sringSplit[i].includes("Spionageabwehr Stufe")){
                build[INDEX_SPA][LVL] = parseInt(sringSplit[i].match(/[0-9]+/)[0])
                if(sringSplit[i+1].includes("%")) build[INDEX_SPA][LVL]++
            }
            if(sringSplit[i].includes("Frühwarnanlage Stufe")){
                build[INDEX_FWA][LVL] = parseInt(sringSplit[i].match(/[0-9]+/)[0])
                if(sringSplit[i+1].includes("%")) build[INDEX_FWA][LVL]++
            }

            //Handelsgebäude
            if(sringSplit[i].includes("Handelsposten Stufe")){
                build[INDEX_HP][LVL] = parseInt(sringSplit[i].match(/[0-9]+/)[0])
                if(sringSplit[i+1].includes("%")) build[INDEX_HP][LVL]++
            }
            if(sringSplit[i].includes("Handelszentrum Stufe")){
                build[INDEX_HZ][LVL] = parseInt(sringSplit[i].match(/[0-9]+/)[0])
                if(sringSplit[i+1].includes("%")) build[INDEX_HZ][LVL]++
            }
            if(sringSplit[i].includes("X-Wars Bank Stufe")){
                build[INDEX_BA][LVL] = parseInt(sringSplit[i].match(/[0-9]+/)[0])
                if(sringSplit[i+1].includes("%")) build[INDEX_BA][LVL]++
            }

            //Spezialgebäude
            if(sringSplit[i].includes("Geheimdienstzentrum Stufe")){
                build[INDEX_GDZ][LVL] = parseInt(sringSplit[i].match(/[0-9]+/)[0])
                if(sringSplit[i+1].includes("%")) build[INDEX_GDZ][LVL]++
            }
            if(sringSplit[i].includes("X-Wars Kreditinstitut Stufe")){
                build[INDEX_KRE][LVL] = parseInt(sringSplit[i].match(/[0-9]+/)[0])
                if(sringSplit[i+1].includes("%")) build[INDEX_KRE][LVL]++
            }
            if(sringSplit[i].includes("Werkstatt Stufe")){
                build[INDEX_WER][LVL] = parseInt(sringSplit[i].match(/[0-9]+/)[0])
                if(sringSplit[i+1].includes("%")) build[INDEX_WER][LVL]++
            }
            if(sringSplit[i].includes("Recycler Stufe")){
                build[INDEX_REC][LVL] = parseInt(sringSplit[i].match(/[0-9]+/)[0])
                if(sringSplit[i+1].includes("%")) build[INDEX_REC][LVL]++
            }


        }
    }

    function updateLvl(){

    }

    function checkLvl(id){
        //if (build[id][LW_ID] == window.BuildingNumber || build[id][LW_ID] == window.BuildingNumber2) return build[id][LVL] + 1
        return build[id][LVL]
    }

    function generateTradeToolPage(){
        if(!saveFile.buildTool_enabled) return

        const parent = window[6].document.querySelector("body > table > tbody > tr:nth-child(2) > td > table > tbody > tr > td:nth-child(2)")

        var div = document.createElement("div");
        div.id = "container"

        parent.appendChild(div)
        div.appendChild(document.createElement("p"))
        generateSelector()

        div.appendChild(generate_tableWide(1))

        window[6].document.getElementById("trade_build_request").addEventListener("click", setTrade)
        window[6].document.getElementById("trade_build_save").addEventListener("click", setSave)
        window[6].document.getElementById("trade_build_requestPlus").addEventListener("click", setTradePlus)


    }

    function generate_tableWide(id) {

        updateLvl()

        var tbl = document.createElement("table");
        var tblBody = document.createElement("tbody");
        tbl.border="0"
        tbl.cellSpacing="1"
        tbl.cellPadding="1"

        input_lvl = document.createElement("INPUT");
        input_lvl.setAttribute("style", "width: 50px;");
        input_lvl.type = "number"
        input_lvl.id = "input-lvl"
        input_lvl.value = checkLvl(id)+1
        input_lvl.addEventListener ("change", function () {
            updateTable2()
        })

        var currentRes = build[id][RES](input_lvl.value-1)

        for (var i = 0; i < 2; i++) {
            var row = document.createElement("tr");

            for (var j = 0; j < 8; j++) {
                var cell = document.createElement("td");
                var cellText = document.createTextNode("NA");
                if(j == 0 && i == 0){
                    cell = document.createElement("td");
                    cell.className = "first"
                    cellText = parseHTML("<b>&nbsp;Gebäude&nbsp;</b>");
                }
                if(j == 1 && i == 0){
                    cell = document.createElement("td");
                    cell.className = "first"
                    cellText = parseHTML("<b>&nbsp;Stufe&nbsp;</b>");
                }
                if(j == 2 && i == 0){
                    cell = document.createElement("td");
                    cell.className = "first"
                    cellText = parseHTML("<b>&nbsp;Roheisen&nbsp;</b>");
                }
                if(j == 3 && i == 0){
                    cell = document.createElement("td");
                    cell.className = "first"
                    cellText = parseHTML("<b>&nbsp;Kristall&nbsp;</b>");
                }
                if(j == 4 && i == 0){
                    cell = document.createElement("td");
                    cell.className = "first"
                    cellText = parseHTML("<b>&nbsp;Frubin&nbsp;</b>");
                }
                if(j == 5 && i == 0){
                    cell = document.createElement("td");
                    cell.className = "first"
                    cellText = parseHTML("<b>&nbsp;Orizin&nbsp;</b>");
                }
                if(j == 6 && i == 0){
                    cell = document.createElement("td");
                    cell.className = "first"
                    cellText = parseHTML("<b>&nbsp;Frurozin&nbsp;</b>");
                }
                if(j == 7 && i == 0){
                    cell = document.createElement("td");
                    cell.className = "first"
                    cellText = parseHTML("<b>&nbsp;Gold&nbsp;</b>");
                }
                if(j == 8 && i == 0){
                    cell = document.createElement("th");
                    cell.classList = ""
                    cellText = document.createTextNode("Dauer");
                }
                if(j == 0 && i == 1){
                    cell = document.createElement("td");
                    cell.appendChild(select)
                   // cell.classList = "constructionName"
                    cell.id = "tab_buildName"
                    cell.className = "second"
                    cellText = document.createTextNode("");
                }
                if(j == 1 && i == 1){
                    cell = document.createElement("td");
                    cell.className = "second"
                    cell.appendChild(input_lvl)
                    cellText = document.createTextNode("");
                }

                if(j == 2 && i == 1){
                    cell = document.createElement("td");
                    cell.className = "second"
                    cell.id = "tab_res_fe"
                    cellText = document.createTextNode( currentRes[RES_FE], 0, ',', '.');
                }
                if(j == 3 && i == 1){
                    cell = document.createElement("td");
                    cell.className = "second"
                    cell.id = "tab_res_kr"
                    cellText = document.createTextNode(currentRes[RES_KR], 0, ',', '.');
                }
                if(j == 4 && i == 1){
                    cell = document.createElement("td");
                    cell.className = "second"
                    cell.id = "tab_res_fr"
                    cellText = document.createTextNode( currentRes[RES_FR], 0, ',', '.');
                }
                if(j == 5 && i == 1){
                    cell = document.createElement("td");
                    cell.className = "second"
                    cell.id = "tab_res_or"
                    cellText = document.createTextNode(currentRes[RES_OR], 0, ',', '.');
                }
                if(j == 6 && i == 1){
                    cell = document.createElement("td");
                    cell.className = "second"
                    cell.id = "tab_res_fu"
                    cellText = document.createTextNode( currentRes[RES_FU], 0, ',', '.');
                }
                if(j == 7 && i == 1){
                    cell = document.createElement("td");
                    cell.className = "second"
                    cell.id = "tab_res_au"
                    cellText = document.createTextNode(currentRes[RES_AU], 0, ',', '.');
                }

                cell.appendChild(cellText);
                row.appendChild(cell);
            }
            tblBody.appendChild(row);
        }
        const setTrade_tr = tblBody.insertRow();
        const setTrade_td = setTrade_tr.insertCell();
        const setTrade_content = document.createElement("div");

        var btn = parseHTML(' [  <a href="#" id="trade_build_request">fordern</a>  ] ')
        setTrade_content.appendChild(btn)

        var btn2 = parseHTML(' [  <a href="#" id="trade_build_save">saven</a>  ] ')
        setTrade_content.appendChild(btn2)

        var btn3 = parseHTML(' [  <a href="#" id="trade_build_requestPlus">fordern +</a>  ] ')
        setTrade_content.appendChild(btn3)

        setTrade_td.className="first"
        setTrade_td.colSpan = "8"
        setTrade_td.style.textAlign = "center"
        setTrade_td.appendChild(setTrade_content);

        tbl.appendChild(tblBody);
        return tbl
    }

    function getCurrentRes(resID){
        switch(resID) {
            case RES_FE: return parseInt(window[4].document.getElementById("res0").innerText.replace('.', ''))
            case RES_KR: return parseInt(window[4].document.getElementById("res1").innerText.replace('.', ''))
            case RES_FR: return parseInt(window[4].document.getElementById("res2").innerText.replace('.', ''))
            case RES_OR: return parseInt(window[4].document.getElementById("res3").innerText.replace('.', ''))
            case RES_FU: return parseInt(window[4].document.getElementById("res4").innerText.replace('.', ''))
            case RES_AU: return parseInt(window[4].document.getElementById("res5").innerText.replace('.', ''))
        }
    }

    function setTrade(){
        var id = select.value
        var lvl = window[6].document.getElementById("input-lvl").value-1
        var currentRes = build[id][RES](window[6].document.getElementById("input-lvl").value-1)
        if(currentRes[RES_FE] > 0) {window[6].document.getElementById("tt_res0").value = currentRes[RES_FE]} else window[6].document.getElementById("tt_res0").value = ""
        if(currentRes[RES_KR] > 0) {window[6].document.getElementById("tt_res1").value = currentRes[RES_KR]} else window[6].document.getElementById("tt_res1").value = ""
        if(currentRes[RES_FR] > 0) {window[6].document.getElementById("tt_res2").value = currentRes[RES_FR]} else window[6].document.getElementById("tt_res2").value = ""
        if(currentRes[RES_OR] > 0) {window[6].document.getElementById("tt_res3").value = currentRes[RES_OR]} else window[6].document.getElementById("tt_res3").value = ""
        if(currentRes[RES_FU] > 0) {window[6].document.getElementById("tt_res4").value = currentRes[RES_FU]} else window[6].document.getElementById("tt_res4").value = ""
        if(currentRes[RES_AU] > 0) {window[6].document.getElementById("tt_res5").value = currentRes[RES_AU]} else window[6].document.getElementById("tt_res5").value = ""
        window[6].document.getElementById("tf_res0").value = 1
        window[6].document.getElementById("tf_res1").value = ""
        window[6].document.getElementById("tf_res2").value = ""
        window[6].document.getElementById("tf_res3").value = ""
        window[6].document.getElementById("tf_res4").value = ""
        window[6].document.getElementById("tf_res5").value = ""

        const heute = new Date();
        var h = (heute.getHours())%24+""
        var m = heute.getMinutes()+""
        window[6].document.getElementsByName("trade_comment")[0].value = h.padStart(2, '0')+":" + m.padStart(2, '0') + " // " + build[id][STRING] + " Stufe "+(lvl+1)
    }

    function setTradePlus(){
        var id = select.value
        var reserve = 10
        var lvl = window[6].document.getElementById("input-lvl").value-1
        var currentRes = build[id][RES](window[6].document.getElementById("input-lvl").value-1)
        const lose = getLose()
        var trade_FE = Math.ceil(currentRes[RES_FE]*(1+lose/100))
        var trade_KR = Math.ceil(currentRes[RES_KR]*(1+lose/100))
        var trade_FR = Math.ceil(currentRes[RES_FR]*(1+lose/100))
        var trade_OR = Math.ceil(currentRes[RES_OR]*(1+lose/100))
        var trade_FU = Math.ceil(currentRes[RES_FU]*(1+lose/100))
        var trade_AU = Math.ceil(currentRes[RES_AU]*(1+lose/100))
        if(trade_FE > 0) {window[6].document.getElementById("tt_res0").value = trade_FE + reserve} else window[6].document.getElementById("tt_res0").value = ""
        if(trade_KR > 0) {window[6].document.getElementById("tt_res1").value = trade_KR + reserve} else window[6].document.getElementById("tt_res1").value = ""
        if(trade_FR > 0) {window[6].document.getElementById("tt_res2").value = trade_FR + reserve} else window[6].document.getElementById("tt_res2").value = ""
        if(trade_OR > 0) {window[6].document.getElementById("tt_res3").value = trade_OR + reserve} else window[6].document.getElementById("tt_res3").value = ""
        if(trade_FU > 0) {window[6].document.getElementById("tt_res4").value = trade_FU + reserve} else window[6].document.getElementById("tt_res4").value = ""
        if(trade_AU > 0) {window[6].document.getElementById("tt_res5").value = trade_AU + reserve} else window[6].document.getElementById("tt_res5").value = ""
        window[6].document.getElementById("tf_res0").value = 1
        window[6].document.getElementById("tf_res1").value = ""
        window[6].document.getElementById("tf_res2").value = ""
        window[6].document.getElementById("tf_res3").value = ""
        window[6].document.getElementById("tf_res4").value = ""
        window[6].document.getElementById("tf_res5").value = ""

        const heute = new Date();
        var h = (heute.getHours())%24+""
        var m = heute.getMinutes()+""
        window[6].document.getElementsByName("trade_comment")[0].value = h.padStart(2, '0')+":" + m.padStart(2, '0') + " // " + build[id][STRING] + " Stufe "+(lvl+1)
    }

    function setSave(){
        var id = select.value
        var lvl = window[6].document.getElementById("input-lvl").value-1
        var currentRes = build[id][RES](lvl)
        if(currentRes[RES_FE] > 0) {window[6].document.getElementById("tf_res0").value = currentRes[RES_FE]}else window[6].document.getElementById("tt_res0").value = ""
        if(currentRes[RES_KR] > 0) {window[6].document.getElementById("tf_res1").value = currentRes[RES_KR]}else window[6].document.getElementById("tt_res1").value = ""
        if(currentRes[RES_FR] > 0) {window[6].document.getElementById("tf_res2").value = currentRes[RES_FR]}else window[6].document.getElementById("tt_res2").value = ""
        if(currentRes[RES_OR] > 0) {window[6].document.getElementById("tf_res3").value = currentRes[RES_OR]}else window[6].document.getElementById("tt_res3").value = ""
        if(currentRes[RES_FU] > 0) {window[6].document.getElementById("tf_res4").value = currentRes[RES_FU]}else window[6].document.getElementById("tt_res4").value = ""
        if(currentRes[RES_AU] > 0) {window[6].document.getElementById("tf_res5").value = currentRes[RES_AU]}else window[6].document.getElementById("tt_res5").value = ""
        window[6].document.getElementById("tt_res0").value = ""
        window[6].document.getElementById("tt_res1").value = ""
        window[6].document.getElementById("tt_res2").value = ""
        window[6].document.getElementById("tt_res3").value = ""
        window[6].document.getElementById("tt_res4").value = ""
        window[6].document.getElementById("tt_res5").value = 99999999

        const heute = new Date();
        var h = (heute.getHours()+8)%24+""
        var m = heute.getMinutes()+""
        window[6].document.getElementsByName("trade_comment")[0].value = "#SAVE# Ende " + h.padStart(2, '0')+":" + m.padStart(2, '0') + " #SAVE# // " + build[id][STRING] + " Stufe "+(lvl+1)
        var planet_selector = window[5].document.querySelector("body > table > tbody > tr:nth-child(7) > td > table > tbody > tr > td:nth-child(2) > b > font > select")
        var save_planetNR = 0
        if (planet_selector.selectedIndex == 0) save_planetNR = 1
        window[6].document.getElementsByName("target")[0].value = planet_selector.options[save_planetNR].innerHTML
    }

    function getLose() {
        const paragraph = window[6].document.querySelector("body > table > tbody > tr:nth-child(2) > td > table > tbody > tr > td:nth-child(2) > form > table > tbody > tr:nth-child(2) > td:nth-child(3)").innerText
        const regex = /([+-]?(?=\.\d|\d)(?:\d+)?(?:\.?\d*))(?:[Ee]([+-]?\d+))?/i;
        return paragraph.match(regex)[0];
    }

    //   ________________________________
    //  |                                |
    //  |         Schiff Markt           |
    //  |________________________________|

    var ship_input
    var ship_select
    var ship_table

    var ships;
    var symbol_true
    var symbol_false
    var indexFavShip

    getJSON("https://raw.githubusercontent.com/BenniBaerenstark/XWars-Tool/main/shipsValues.json",
            function(err, data) {
        if (err !== null) {
            console.log('Something went wrong: ' + err);
        } else {
            ships = data.ships
            symbol_true = data.symbol_true
            symbol_false = data.symbol_false
            indexFavShip = data.indexFavShip
        }
    });


    function generateShipMarket(){
        if(!saveFile.shipTool_enabled)return

        var div = document.createElement("div");
        div.id = "container"

        var parent = window[6].document.querySelector("body > table > tbody > tr:nth-child(2) > td > table > tbody > tr > td:nth-child(2)")
        parent.append(document.createElement("p"))
        ship_table = infoShipTable()
        parent.appendChild(ship_table)
        updateShipTable()
        window[6].document.getElementById("trade_ship_set").addEventListener("click", setShipTrade)
    }

    function infoShipTable(){

        ship_input = document.createElement("INPUT");
        ship_input.setAttribute("style", "width: 50px;");
        ship_input.type = "number"
        ship_input.value = 1

        var max = document.createElement("span");
        max.setAttribute("style", "cursor: pointer");
        max.innerHTML = "Max"
        max.addEventListener("click", maxShip, false);

        var btn = document.createElement("a");
        btn.innerHTML = ' [  <a href="#" id="trade_ship_set">stellen</a>  ] '
        btn.addEventListener("click", setShipTrade, false);

        var values = getShipNames();
        ship_select = document.createElement("select");
        ship_select.name = "shipSelect";
        ship_select.id = "shipSelect"

        var optionGroup_drones = document.createElement('OPTGROUP')
        optionGroup_drones.label = "Flugkörper"
        var optionGroup_tactical = document.createElement('OPTGROUP')
        optionGroup_tactical.label = "Taktische Waffen"
        var optionGroup_light = document.createElement('OPTGROUP')
        optionGroup_light.label = "Leichte Schiffe"
        var optionGroup_middle = document.createElement('OPTGROUP')
        optionGroup_middle.label = "Mittlere Schiffe"
        var optionGroup_heavy = document.createElement('OPTGROUP')
        optionGroup_heavy.label = "Schwere Schiffe"

        ship_select.appendChild(optionGroup_drones)

        var t_set = false
        var l_set = false
        var m_set = false
        var h_set = false

        for (let i = 0; i < ships.length; i++) {
            var option = document.createElement("option");
            option.value = i
            option.text = ships[i].name.charAt(0).toUpperCase() + ships[i].name.slice(1);

            if(ships[i].shipClass == "Drohne") optionGroup_drones.appendChild(option)
            if(ships[i].shipClass == "Taktisch"){
                if(!t_set){
                    ship_select.appendChild(optionGroup_tactical)
                    t_set = true
                }
                optionGroup_tactical.appendChild(option)
            }
            if(ships[i].shipClass == "Leicht"){
                if(!l_set){
                    ship_select.appendChild(optionGroup_light)
                    l_set = true
                }
                optionGroup_light.appendChild(option)
            }
            if(ships[i].shipClass == "Mittel"){
                if(!m_set){
                    ship_select.appendChild(optionGroup_middle)
                    m_set = true
                }
                optionGroup_middle.appendChild(option)
            }
            if(ships[i].shipClass == "Schwer"){
                if(!h_set){
                    ship_select.appendChild(optionGroup_heavy)
                    h_set = true
                }
                optionGroup_heavy.appendChild(option)
            }
        }

        ship_select.addEventListener ("change", function () {
            updateShipTable()
        })

        ship_select.value = indexFavShip

        var table = document.createElement("table")
        table.border="0"
        table.cellSpacing="1"
        table.cellPadding="1"

        var input_tr = document.createElement("tr")
        var input_td = document.createElement("td")
        input_td.className="first"
        input_td.colSpan = "7"
        input_td.style.textAlign = "center"

        input_td.appendChild(ship_select)
        input_td.appendChild(ship_input)
        input_td.appendChild(btn)
        input_tr.appendChild(input_td)
        table.appendChild(input_tr)

        var firstRow = document.createElement("tr")
        var name_Titel = document.createElement("td")
        name_Titel.innerHTML = "<a></a> "
        name_Titel.className = "first"
        //firstRow.appendChild(name_Titel)
        var sClass = document.createElement("td")
        sClass.innerHTML = "<b>&nbsp;Klasse&nbsp;</b>"
        sClass.className = "first"
        firstRow.appendChild(sClass)
        var attDef = document.createElement("td")
        attDef.innerHTML = "<b>&nbsp;Att / Def&nbsp;</b>"
        attDef.className = "first"
        firstRow.appendChild(attDef)
        var drive_Titel = document.createElement("td")
        drive_Titel.innerHTML = "<b>&nbsp;Antrieb&nbsp;</b>"
        drive_Titel.className = "first"
        firstRow.appendChild(drive_Titel)
        var freight_Titel = document.createElement("td")
        freight_Titel.innerHTML = "<b>&nbsp;Fracht&nbsp;</b>"
        freight_Titel.className = "first"
        firstRow.appendChild(freight_Titel)
        var lKom_Titel = document.createElement("td")
        lKom_Titel.innerHTML = "<b>&nbsp;L-Kom&nbsp;</b>"
        lKom_Titel.className = "first"
        firstRow.appendChild(lKom_Titel)
        var tt_Titel = document.createElement("td")
        tt_Titel.innerHTML = "<b>&nbsp;TT&nbsp;</b>"
        tt_Titel.className = "first"
        firstRow.appendChild(tt_Titel)
        table.appendChild(firstRow)
        var carrier_Titel = document.createElement("td")
        carrier_Titel.innerHTML = "<b>&nbsp;Träger&nbsp;</b>"
        carrier_Titel.className = "first"
        firstRow.appendChild(carrier_Titel)
        table.appendChild(firstRow)

        var secondRow = document.createElement("tr")
        var name_String = document.createElement("td")
        name_String.id = "name_String"
        name_String.className = "first"
        //secondRow.appendChild(name_String)
        var sClass_String = document.createElement("td")
        sClass_String.id = "sClass_String"
        sClass_String.className = "second"
        secondRow.appendChild(sClass_String)
        var attDef_Value = document.createElement("td")
        attDef_Value.id = "attDef_Value"
        attDef_Value.className = "second"
        secondRow.appendChild(attDef_Value)
        var drive_Value = document.createElement("td")
        drive_Value.id = "drive_Value"
        drive_Value.className = "second"
        secondRow.appendChild(drive_Value)
        var freight_Value = document.createElement("td")
        freight_Value.id = "freight_Value"
        freight_Value.className = "second"
        secondRow.appendChild(freight_Value)
        var lKom_Value = document.createElement("td")
        lKom_Value.id = "lKom_Value"
        lKom_Value.className = "second"
        lKom_Value.style.textAlign = "center"
        secondRow.appendChild(lKom_Value)
        var tt_Value = document.createElement("td")
        tt_Value.id = "tt_Value"
        tt_Value.className = "second"
        tt_Value.style.textAlign = "center"
        secondRow.appendChild(tt_Value)
        var carrier_Value = document.createElement("td")
        carrier_Value.id = "carrier_Value"
        carrier_Value.className = "second"
        carrier_Value.style.textAlign = "center"
        secondRow.appendChild(carrier_Value)

        table.appendChild(secondRow)

        return table
    }

    function updateShipTable(){
        var shipNr = ship_select.selectedIndex
        var temp

        //window[6].document.getElementById("name_String").innerText = " " + ships[shipNr].name + " "
        window[6].document.getElementById("sClass_String").innerText = " " + ships[shipNr].shipClass + " "
        window[6].document.getElementById("attDef_Value").innerText = " " + ships[shipNr].att + " / " + ships[shipNr].def + " "
        window[6].document.getElementById("drive_Value").innerText = " " + ships[shipNr].drive + " " + ships[shipNr].drive_s + "% "
        window[6].document.getElementById("freight_Value").innerText = " " + ships[shipNr].freight + " "

        if(ships[shipNr].lkom) temp = symbol_true
        else temp = symbol_false
        window[6].document.getElementById("lKom_Value").innerText = temp
        if(ships[shipNr].tt) temp = symbol_true
        else temp = symbol_false
        window[6].document.getElementById("tt_Value").innerText = temp
        if(ships[shipNr].carrier) temp = symbol_true
        else temp = symbol_false
        window[6].document.getElementById("carrier_Value").innerText = temp

    }

    function maxShip(){
        var percentTrade = 1+(window.lose/100)
        var shipNr = ship_select.selectedIndex
        var max = Math.floor(window.Roheisen/(ships[shipNr].fe*percentTrade))
        var maxKr = Math.floor(window.Kristall/(ships[shipNr].kr*percentTrade))
        if(maxKr < max) max = maxKr
        var maxFb = Math.floor(window.Frubin/(ships[shipNr].fb*percentTrade))
        if(maxFb < max) max = maxFb
        var maxOr = Math.floor(window.Orizin/(ships[shipNr].or*percentTrade))
        if(maxOr < max) max = maxOr
        var maxFz = Math.floor(window.Frurozin/(ships[shipNr].fz*percentTrade))
        if(maxFz < max) max = maxFz
        var maxGo = Math.floor(window.Gold/(ships[shipNr].au*percentTrade))
        if(maxGo < max) max = maxGo
        ship_input.value = max

    }

    function getShipNames(){
        var names = new Array();
        for (var i = 0; i < ships.length; i++) {
            names[i] = ships[i].name
        }
        return names
    }

    function setShipTrade(){
        var ship = ship_select.selectedIndex
        var quantity = ship_input.value
        window[6].document.getElementById("tf_res0").value = quantity * ships[ship].fe
        window[6].document.getElementById("tf_res1").value = quantity * ships[ship].kr
        window[6].document.getElementById("tf_res2").value = quantity * ships[ship].fr
        window[6].document.getElementById("tf_res3").value = quantity * ships[ship].or
        window[6].document.getElementById("tf_res4").value = quantity * ships[ship].fz
        window[6].document.getElementById("tf_res5").value = quantity * ships[ship].au
        if (parseInt(quantity) >= 1){
            const heute = new Date();
            var h = (heute.getHours())%24+""
            var m = heute.getMinutes()+""
            window[6].document.getElementsByName("trade_comment")[0].value = h.padStart(2, '0')+":" + m.padStart(2, '0') + " // " + quantity + " x " + ships[ship].name
            window[6].document.getElementById("tt_res0").value = 1
        }
        else{
            window[6].document.getElementsByName("trade_comment")[0].value = ""
            window[6].document.document.getElementById("tt_res0").value = ""
        }
    }

    function getJSON (url, callback) {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', url, true);
        xhr.responseType = 'json';
        xhr.onload = function() {
            var status = xhr.status;
            if (status === 200) {
                callback(null, xhr.response);
            } else {
                callback(status, xhr.response);
            }
        };
        xhr.send();
    };

    //   ________________________________
    //  |                                |
    //  |        Total Res Prod          |
    //  |________________________________|

    var totalRes = new Array()


    function getAllCoords(){
        var coords = new Array()
        const select = window[5].document.querySelector("body > table > tbody > tr:nth-child(7) > td > table > tbody > tr > td:nth-child(2) > b > font > select")
        for (let i = 0; i < totalRes.length; i++) {
            coords[i] = select.options[i].text;
        }
        return coords
    }

    function getCurrentCoords(){
        const sel = window[5].document.querySelector("body > table > tbody > tr:nth-child(7) > td > table > tbody > tr > td:nth-child(2) > b > font > select")
        return sel.options[sel.selectedIndex].text
    }

    function getUserName(){
        return window[5].document.querySelector("body > table > tbody > tr:nth-child(3) > td > table > tbody > tr > td:nth-child(2) > b > font").innerText
    }

    function getHourProduction(){
        const coords = getAllCoords()
        var ResPerHour = new Array()
        ResPerHour[0] = parseInt(window[6].document.querySelector("body > table > tbody > tr:nth-child(2) > td > table > tbody > tr > td:nth-child(2) > table > tbody > tr:nth-child(1) > td:nth-child(1) > table > tbody > tr:nth-child(2) > td > table > tbody > tr:nth-child(2) > td:nth-child(1)").innerText.match(/\d+/)[0])
        ResPerHour[1] = parseInt(window[6].document.querySelector("body > table > tbody > tr:nth-child(2) > td > table > tbody > tr > td:nth-child(2) > table > tbody > tr:nth-child(1) > td:nth-child(2) > table > tbody > tr:nth-child(2) > td > table > tbody > tr:nth-child(2) > td:nth-child(1)").innerText.match(/\d+/)[0])
        ResPerHour[2] = parseInt(window[6].document.querySelector("body > table > tbody > tr:nth-child(2) > td > table > tbody > tr > td:nth-child(2) > table > tbody > tr:nth-child(2) > td:nth-child(1) > table > tbody > tr:nth-child(2) > td > table > tbody > tr:nth-child(2) > td:nth-child(1)").innerText.match(/\d+/)[0])
        ResPerHour[3] = parseInt(window[6].document.querySelector("body > table > tbody > tr:nth-child(2) > td > table > tbody > tr > td:nth-child(2) > table > tbody > tr:nth-child(2) > td:nth-child(2) > table > tbody > tr:nth-child(2) > td > table > tbody > tr:nth-child(2) > td:nth-child(1)").innerText.match(/\d+/)[0])
        ResPerHour[4] = parseInt(window[6].document.querySelector("body > table > tbody > tr:nth-child(2) > td > table > tbody > tr > td:nth-child(2) > table > tbody > tr:nth-child(3) > td:nth-child(1) > table > tbody > tr:nth-child(2) > td > table > tbody > tr:nth-child(2) > td:nth-child(1)").innerText.match(/\d+/)[0])
        ResPerHour[5] = parseInt(window[6].document.querySelector("body > table > tbody > tr:nth-child(2) > td > table > tbody > tr > td:nth-child(2) > table > tbody > tr:nth-child(3) > td:nth-child(2) > table > tbody > tr:nth-child(2) > td > table > tbody > tr:nth-child(2) > td:nth-child(1)").innerText.match(/\d+/)[0])

        return ResPerHour
    }

    function storeHourProduction(rph){
        var entryFound = false
        for (let i = 0; i < totalRes.length; i++) {
            if(totalRes[i].planet == getCurrentCoords()){
                entryFound = true
                totalRes[i].user = getUserName()
                totalRes[i].rph = rph
            }
        }
        if(!entryFound){
            const newEntry = {user:getUserName(), planet:getCurrentCoords(), rph:rph};
            totalRes.push(newEntry)
        }
    }

    var generateRPH_COUNTER = 0

    function generateRPH(){
        try {
            const test = window[6].document.querySelector("body > table > tbody > tr:nth-child(2) > td > table > tbody > tr > td:nth-child(2) > table > tbody > tr:nth-child(3) > td:nth-child(2) > table > tbody > tr:nth-child(2) > td > table > tbody > tr:nth-child(2) > td:nth-child(1)").innerText
        } catch (error) {
            if(generateRPH_COUNTER > 30) return
            generateRPH_COUNTER++
            setTimeout(generateRPH,200)
            return
        }

        generateRPH_COUNTER = 0

        storeHourProduction(getHourProduction())

        var table = document.createElement("table")
        table.border="0"
        table.cellSpacing="1"
        table.cellPadding="1"

        var input_tr = document.createElement("tr")
        var input_td = document.createElement("td")
        input_td.className="fourth"
        input_td.colSpan = "7"
        input_td.style.textAlign = "center"

        input_td.appendChild(parseHTML("<b>Rohstoffproduktion</b>"))
        input_tr.appendChild(input_td)
        table.appendChild(input_tr)

        var total = new Array(0,0,0,0,0,0)

        for (let i = 0; i < totalRes.length; i++) {
            if (totalRes[i].user == getUserName()){
                var row = document.createElement("tr")
                var td_planet = document.createElement("td")
                td_planet.innerHTML = "<a>&nbsp;" + totalRes[i].planet + "&nbsp;</a>"
                td_planet.className = "fourth"
                td_planet.style.textAlign = "center"
                row.appendChild(td_planet)
                var td_Fe = document.createElement("td")
                td_Fe.innerHTML = "<a>&nbsp;" + totalRes[i].rph[0].toLocaleString("de-CH") + "&nbsp;</a>"
                td_Fe.className = "first"
                td_planet.style.textAlign = "right"
                total[0] += totalRes[i].rph[0]
                row.appendChild(td_Fe)
                var td_Kr = document.createElement("td")
                td_Kr.innerHTML = "<a>&nbsp;" + totalRes[i].rph[1].toLocaleString("de-CH") + "&nbsp;</a>"
                td_Kr.className = "second"
                td_planet.style.textAlign = "right"
                total[1] += totalRes[i].rph[1]
                row.appendChild(td_Kr)
                var td_Fb = document.createElement("td")
                td_Fb.innerHTML = "<a>&nbsp;" + totalRes[i].rph[2].toLocaleString("de-CH") + "&nbsp;</a>"
                td_Fb.className = "first"
                td_planet.style.textAlign = "right"
                total[2] += totalRes[i].rph[2]
                row.appendChild(td_Fb)
                var td_Or = document.createElement("td")
                td_Or.innerHTML = "<a>&nbsp;" + totalRes[i].rph[3].toLocaleString("de-CH") + "&nbsp;</a>"
                td_Or.className = "second"
                td_planet.style.textAlign = "right"
                total[3] += totalRes[i].rph[3]
                row.appendChild(td_Or)
                var td_Fr = document.createElement("td")
                td_Fr.innerHTML = "<a>&nbsp;" + totalRes[i].rph[4].toLocaleString("de-CH") + "&nbsp;</a>"
                td_Fr.className = "first"
                td_planet.style.textAlign = "right"
                total[4] += totalRes[i].rph[4]
                row.appendChild(td_Fr)
                var td_Au = document.createElement("td")
                td_Au.innerHTML = "<a>&nbsp;" + totalRes[i].rph[5].toLocaleString("de-CH") + "&nbsp;</a>"
                td_Au.className = "second"
                td_planet.style.textAlign = "right"
                total[5] += totalRes[i].rph[5]
                row.appendChild(td_Au)
                table.appendChild(row)
            }
        }

        row = document.createElement("tr")
        var td_tot_h = document.createElement("td")
        td_tot_h.innerHTML = "<a>&nbsp;Total pro Stunde&nbsp;</a>"
        td_tot_h.className = "fourth"
        td_tot_h.style.textAlign = "center"
        row.appendChild(td_tot_h)
        for (let i = 0; i < total.length; i++){
            var td = document.createElement("td")
            td.innerHTML = "<b>&nbsp;" + total[i].toLocaleString("de-CH") + "&nbsp;</b>"
            td.className = "first"
            if (i % 2 !== 0) td.className = "second"
            row.appendChild(td)
        }
        table.appendChild(row)

        row = document.createElement("tr")
        var td_tot_d = document.createElement("td")
        td_tot_d.innerHTML = "<a>&nbsp;Total pro Tag&nbsp;</a>"
        td_tot_d.className = "fourth"
        td_tot_d.style.textAlign = "center"
        row.appendChild(td_tot_d)
        for (let i = 0; i < total.length; i++){
            td = document.createElement("td")
            td.innerHTML = "<b>&nbsp;" + (total[i]*24).toLocaleString("de-CH") + "&nbsp;</b>"
            td.className = "first"
            if (i % 2 !== 0) td.className = "second"
            row.appendChild(td)
        }
        table.appendChild(row)

        const parentDiv = window[6].document.querySelector("body > table > tbody > tr:nth-child(2) > td > table > tbody > tr > td:nth-child(2)")
        const referece = window[6].document.querySelector("body > table > tbody > tr:nth-child(2) > td > table > tbody > tr > td:nth-child(2) > table")
        parentDiv.insertBefore(table, referece)
        parentDiv.insertBefore(parseHTML("<p></p>"), referece)

    }

    //   ________________________________
    //  |                                |
    //  |         Auto Observer          |
    //  |________________________________|

    var allObservers = new Array()
    var getallObservers_COUNTER = 0

    function getallObservers(){
        getallObservers_COUNTER++
        var rows = null
        var table = window[6].document.querySelector("body > table > tbody > tr:nth-child(2) > td > table > tbody > tr > td:nth-child(2) > center > table:nth-child(8) > tbody")
        if(table != null) rows = table.children
        else {
            if(getallObservers_COUNTER > 30)return
            getallObservers_COUNTER
            setTimeout(getallObservers,200)
            return
        }
        getallObservers_COUNTER = 0
        for(let i=2; i < rows.length; i++){
            var fromCoords = getCoords(rows[i].children[0].innerText)
            var toCoords = getCoords(rows[i].children[1].innerText)
            var userName = getObsUserName(rows[i].children[1].innerText)
            var timeStamp = getDate(rows[i].children[2].innerText)
            var link = getObsLinkString(rows[i].children[3].children[0].onclick.toString())
            storeObs(fromCoords,toCoords,userName,timeStamp,link)
        }
    }

    function getObsLinkString(string){
        const start = string.indexOf("index")-1
        const stop = string.indexOf("dependent")-17
        return string.substring(start,stop)
    }

    function getCoords(string){
        var numbers = string.match(/\d+/g)
        if(numbers.length < 3) return null
        return numbers[0] + "x" + numbers[1] + "x" + numbers[2]
    }

    function getObsUserName(string){
        const start = string.indexOf("(")+1
        const stop = string.length -2
        return string.substring(start, stop)
    }

    function getDate(string){
        var date = string.split(" ")[0].split(".")
        var time = string.split(" ")[1].split(":")
        var day = parseInt(date[0].match(/\d+/g))
        var month = parseInt(date[1])-1
        var year = parseInt(date[2])
        var hours = parseInt(time[0])
        var minutes = parseInt(time[1])
        var seconds = parseInt(time[2])
        return new Date(year, month, day, hours, minutes, seconds);
    }

    function storeObs(fromCoords,toCoords,userName,timeStamp,link){
        var entryFound = false
        for(let i=0; i<allObservers.length; i++){
            if(allObservers[i].toCoords == toCoords){
                entryFound = true
                allObservers[i].fromCoords = fromCoords
                allObservers[i].userName = userName
                allObservers[i].timeStamp = timeStamp
                allObservers[i].link = link
            }
        }
        if(!entryFound){
            const newEntry = {fromCoords:fromCoords,toCoords:toCoords,userName:userName,timeStamp:timeStamp,link:link};
            allObservers.push(newEntry)
        }
    }

    function getObsLink(coords){
        var link = null
        for(let i=0; i<allObservers.length; i++){
            if(allObservers[i].toCoords == coords) link = allObservers[i].link
        }
        return link
    }

     function getObsTarget(coords){
        var target = null
        for(let i=0; i<allObservers.length; i++){
            if(allObservers[i].toCoords == coords) target = allObservers[i].userName
        }
        return target
    }

    var setAllObsLink_COUNTER = 0


    function setAllObsLink(){
        if(setAllObsLink_COUNTER>30){
            setAllObsLink_COUNTER = 0
            return
        }
        setAllObsLink_COUNTER++
        try{
            if(!window[6].document.querySelector("body").innerText.includes("Flottenbewegungen")){
                setTimeout(setAllObsLink,200)
                return
            }
        }
        catch{
            setTimeout(setAllObsLink,200)
            return
        }
        const table = window[6].document.getElementsByTagName("table")
        setAllObsLink_COUNTER = 0
        for(let i=3; i<table.length-1; i++){
            addObsLink(table[i].children[0])
        }
    }

    var setAllObsLinkOverview_COUNTER = 0

    function setAllObsLinkOverview(){
        if(setAllObsLinkOverview_COUNTER>30){
            setAllObsLinkOverview_COUNTER = 0
            return
        }
        setAllObsLinkOverview_COUNTER++
        try{
            if(!window[6].document.querySelector("body").innerText.includes("Gesamtpunkte:")){
                setTimeout(setAllObsLinkOverview,200)
                return}
            if(!window[6].document.querySelector("body").innerText.includes("lotte")){
                return
            }
        }
        catch{
            setTimeout(setAllObsLinkOverview,200)
            return
        }
        setAllObsLinkOverview_COUNTER = 0
        const tr = window[6].document.getElementsByTagName("tr")
        for(let i=5; i<tr.length-1; i++){
            addObsLinkOverview(tr[i].children[0])
            if(tr[i].children[0].innerText.includes("Planetenübersicht"))return
        }
    }

    function addObsLink(table){

        const colorTransfer = 'rgb(' + 0 + ',' + 136 + ',' + 255 + ')';
        const colorDefOnWay = 'rgb(' + 35 + ',' + 146 + ',' + 0 + ')';
        const colorDef = 'rgb(' + 35 + ',' + 146 + ',' + 0 + ')';
        const colorRet = 'rgb(' + 120 + ',' + 123 + ',' + 129 + ')';
        const colorTransport = 'rgb(' + 30 + ',' + 30 + ',' + 30 + ')';
        const colorBaseChange = 'rgb(' + 0 + ',' + 0 + ',' + 200 + ')';
        const atts = table.children
        if(atts.length < 2) return
        for(let i=2; i<atts.length-1; i++){
            if(atts[i].innerText.includes("Eigene Angriffsflotte")){
                setOwnAttObsLink(atts[i].children[0].children[0])
            }
            if(atts[i].innerText.includes("Angriffsflotte von")){
                setEnemyAttObsLink(atts[i].children[0].children[0])
            }
            if(atts[i].innerText.includes("kehrt zurück zur Basis")){
                //changeBGColor(atts[i])
                //changeBGColor(atts[i+1])
            }
            if(atts[i].innerText.includes("wird überstellt auf")){
                changeBGColor(atts[i], atts[i+1], colorTransfer)
            }
            if(atts[i].innerText.includes("Verteidigungsflotte") && (atts[i].innerText.includes("ist unterwegs zu Planet") || atts[i].innerText.includes("ist unterwegs zu deinem Planet"))){
                changeBGColor(atts[i], atts[i+1], colorDefOnWay)
            }
            if(atts[i].innerText.includes("verteidigt Planet")){
                changeBGColor(atts[i], atts[i+1], colorDef)
            }
            if(atts[i].innerText.includes("kehrt zurück zur Basis")){
                changeBGColor(atts[i], atts[i+1], colorRet)
            }
            if(atts[i].innerText.includes("transportiert Rohstoffe")){
                changeBGColor(atts[i], atts[i+1], colorTransport)
            }
            if(atts[i].innerText.includes(" fliegt als neue Basis deinen")){
                changeBGColor(atts[i], atts[i+1], colorBaseChange)
            }

        }

    }

    function addObsLinkOverview(tr){
        const colorTransfer = 'rgb(' + 0 + ',' + 136 + ',' + 255 + ')';
        const colorDefOnWay = 'rgba(' + 0 + ',' + 136 + ',' + 0 + ',' + 255 + ')';
        const colorDef = 'rgb(' + 35 + ',' + 146 + ',' + 0 + ')';
        const colorRet = 'rgb(' + 120 + ',' + 123 + ',' + 129 + ')';
        const colorTransport = 'rgb(' + 62 + ',' + 66 + ',' + 72 + ')';
        if(tr.innerText.includes("Eigene Angriffsflotte")){
            //setOwnAttObsLink(tr.children[0].children[0])
        }
        if(tr.innerText.includes("Angriffsflotte von")){
            setEnemyAttObsLinkOverview(tr)
        }
        if(tr.innerText.includes("kehrt zurück zur Basis")){
            //changeBGColor(atts[i])
            //changeBGColor(atts[i+1])
        }
        if(tr.innerText.includes("wird überstellt auf")){
            changeBGColorOverview(tr, colorTransfer)
        }
        if(tr.innerText.includes("Eigene Verteidigungsflotte") && tr.innerText.includes("ist unterwegs zu Planet")){
            changeBGColorOverview(tr, colorDefOnWay)
        }
        if(tr.innerText.includes("verteidigt Planet")){
            changeBGColorOverview(tr, colorDef)
        }
        if(tr.innerText.includes("kehrt zurück zur Basis")){
            changeBGColorOverview(tr, colorRet)
        }
        if(tr.innerText.includes("transportiert Rohstoffe")){
            changeBGColorOverview(tr, colorTransport)
        }


    }

    function setOwnAttObsLink(element){
        var html = element.innerHTML
        const startCoords = html.indexOf("Planet")+7
        const endCoords = html.indexOf(" an")
        const htmlPart1 = html.substring(0,startCoords)
        const htmlPart2 = html.substring(endCoords,html.length)
        const coords = html.substring(startCoords,endCoords)
        const name = getObsTarget(coords)
        if(name == null) return
        var obsLink = getObsLink(coords)
        const id = getRandomInt(1000)
        var clickableCoords = '<a href="#" id= '+ id+ ' >'+coords+' ('+name+')</a>'
        element.innerHTML = htmlPart1 + clickableCoords + htmlPart2
        window[6].document.getElementById(id).addEventListener('click', function(){
            let obsWindow = window.open(obsLink, 'obsWindow', 'dependent=yes,location=no,menubar=no,resizable=yes,scrollbars=yes,status=yes,toolbar=no')
            obsWindow.focus();

        });
    }

    function setEnemyAttObsLinkOverview(element){
        var html = element.innerHTML
        const startCoords = html.indexOf("von")+4
        const endCoords = html.indexOf(" greift")
        const htmlPart1 = html.substring(0,startCoords)
        const htmlPart2 = html.substring(endCoords,html.length)
        const coords = html.substring(startCoords,endCoords)
        const name = getObsTarget(coords)
        if(name == null) return
        var obsLink = getObsLink(coords)
        const id = getRandomInt(1000)
        var clickableCoords = '<a href="#" id= '+ id+ ' >'+coords+' ('+name+')</a>'
        element.innerHTML = htmlPart1 + clickableCoords + htmlPart2
        window[6].document.getElementById(id).addEventListener('click', function(){
            let obsWindow = window.open(obsLink, 'obsWindow', 'dependent=yes,location=no,menubar=no,resizable=yes,scrollbars=yes,status=yes,toolbar=no')
            obsWindow.focus();

        });
    }

    function changeBGColor(tr1,tr2,color){
        const td1 = tr1.children
        const td2 = tr2.children
        for(let i=0; i<td1.length; i++){
            td1[i].style.backgroundColor = color
            td1[i].classList.remove("second");
            td1[i].classList.remove("first");
        }
        for(let i=0; i<td2.length; i++){
            td2[i].style.backgroundColor = color
            td2[i].classList.remove("second");
            //td1[i].classList.remove("first");
        }
    }

    function changeBGColorOverview(tr,color){
        tr.style.backgroundColor = color
        tr.classList.remove("second");
        tr.classList.remove("first");
    }

    function setEnemyAttObsLink(element){
        var html = element.innerHTML
        const startCoords = html.indexOf("von")+4
        const endCoords = html.indexOf(" greift")
        const htmlPart1 = html.substring(0,startCoords)
        const htmlPart2 = html.substring(endCoords,html.length)
        const coords = html.substring(startCoords,endCoords)
        const name = getObsTarget(coords)
        if(name == null) return
        var obsLink = getObsLink(coords)
        const id = getRandomInt(1000)
        var clickableCoords = '<a href="#" id= '+ id+ ' >'+coords+' ('+name+')</a>'
        element.innerHTML = htmlPart1 + clickableCoords + htmlPart2
        window[6].document.getElementById(id).addEventListener('click', function(){
            let obsWindow = window.open(obsLink, 'obsWindow', 'dependent=yes,location=no,menubar=no,resizable=yes,scrollbars=yes,status=yes,toolbar=no')
            obsWindow.focus();

        });
    }

    function getRandomInt(max) {
        return Math.floor(Math.random() * max);
    }

    var fillOutLastCommand_COUNTER = 0

    function fillOutLastCommand(){
        var txtFullLastCommand
        fillOutLastCommand_COUNTER++
        if(fillOutLastCommand_COUNTER>10){
            fillOutLastCommand_COUNTER = 0
            return
        }
        try{
            txtFullLastCommand = window[6].document.querySelector("body > table > tbody > tr:nth-child(2) > td > table > tbody > tr > td:nth-child(2) > table:nth-child(9) > tbody > tr:nth-child(2) > td:nth-child(1) > table:nth-child(2) > tbody > tr:nth-child(2) > td").innerText
            if(window[6].document.querySelector("body > table > tbody > tr:nth-child(2) > td > table > tbody > tr > td:nth-child(2) > table:nth-child(9) > tbody > tr:nth-child(2) > td:nth-child(1) > table:nth-child(2) > tbody > tr:nth-child(1) > td.second").innerText != "Basis verteidigen")return
        }
        catch{
            setTimeout(fillOutLastCommand,200)
            return
        }
        fillOutLastCommand_COUNTER = 0
        var txtLastCommand = getLastCommand(txtFullLastCommand)
        switch (txtLastCommand) {
            case "Angriff":fillOutAttack(txtFullLastCommand);break;
            case "Überstellung":break

        }
    }

    function getLastCommand(string){
        const start = string.indexOf("Letzte Operation ")+17
        var stop = string.indexOf(" auf")
        if(stop == -1) stop = string.indexOf(" nach")
        return string.substring(start,stop)
    }

    function fillOutAttack(string){
        window[6].document.querySelector("body > table > tbody > tr:nth-child(2) > td > table > tbody > tr > td:nth-child(2) > table:nth-child(9) > tbody > tr:nth-child(2) > td:nth-child(1) > form > table > tbody > tr > td:nth-child(2) > input[type=radio]:nth-child(1)").click()
        const start = string.indexOf("auf ")+4
        const stop = string.indexOf(" (")
        window[6].document.querySelector("body > table > tbody > tr:nth-child(2) > td > table > tbody > tr > td:nth-child(2) > table:nth-child(9) > tbody > tr:nth-child(2) > td:nth-child(1) > form > table > tbody > tr > td:nth-child(3) > input[type=text]").value = string.substring(start,stop)
    }

    //   ________________________________
    //  |                                |
    //  |           Raumdock             |
    //  |________________________________|


    var generateSpaceDockTools_COUNTER = 0

    function generateSpaceDockTools(){
        if(generateSpaceDockTools_COUNTER > 15){
            generateSpaceDockTools_COUNTER = 0
            return
        }
        generateSpaceDockTools_COUNTER++
        try{
            if(!window[6].document.querySelector("body > table > tbody").innerText.includes("Flotte gründen")){
                setTimeout(generateSpaceDockTools,200)
                return
            }
        }
        catch{
            setTimeout(generateSpaceDockTools,200)
            return
        }
        generateSpaceDockTools_COUNTER = 0

        const tbodys = window[6].document.getElementsByTagName("tbody")
        const tr = tbodys[tbodys.length-2].children[0]
        var td = document.createElement("td")
        var allShip = parseHTML('&nbsp;&nbsp; [&nbsp;<a href="#">alle Schiffe</a>&nbsp;]')
        td.appendChild(allShip)
        tr.appendChild(td)

        const inputs = window[6].document.querySelectorAll('input')

        if(inputs.length<2)return

        for( let i=0; i<inputs.length-1; i++){
            inputs[i].type = "number"
            inputs[i].style.width = '50px'
            inputs[i].min = 0
        }

        const ships = window[6].document.querySelector("body > table > tbody > tr:nth-child(2) > td > table > tbody > tr > td:nth-child(2) > form > table:nth-child(1) > tbody").children
        if(ships.length < 3)return

        var numberOfShips = new Array()
        var id = 0
        for( let i=3; i<ships.length-1; i++){
            const tds = ships[i].children
            if(tds.length > 6 && !tds[0].innerText.includes("Typ") && tds[tds.length-1].children.length != 0){
                numberOfShips[id] = parseInt(ships[i].children[ships[i].children.length-2].innerText)
                window[6].document.querySelectorAll('input')[id].max = numberOfShips[id]
                ships[i].children[ships[i].children.length-2].innerHTML = '<a href="#" id=' + id + '>' + numberOfShips[id] + '</a>&nbsp;'
                ships[i].children[ships[i].children.length-2].children[0].onclick = function (clickedElement){
                    const id = clickedElement.srcElement.id
                    const input = window[6].document.querySelectorAll('input')[id]
                    const max = numberOfShips[id]
                    input.value = max
                }
                id++
            }
        }
        td.onclick = function (){
            for( let i=0; i<inputs.length-1; i++){
                inputs[i].value = numberOfShips[i]
            }
        }
    }

    //   ________________________________
    //  |                                |
    //  |              Bank              |
    //  |________________________________|

    var generateBankePage_COUNTER = 0

    function generateBankePage(){
        generateBankePage_COUNTER++
        if(generateBankePage_COUNTER >15){
            generateBankePage_COUNTER = 0
            return
        }
        try{
            if(!window[6].document.querySelector("body").innerText.includes("Nächste Berechnung")){
                setTimeout(generateBankePage,200)
                return
            }
        }
        catch{
            setTimeout(generateBankePage,200)
            return
        }

        if(!window[6].document.querySelector("body").innerText.includes("Neue Banktransaktionen für"))return

        const electTransactionType = window[6].document.getElementsByName("transaction_type")[0]
        electTransactionType.selectedIndex = 1
        electTransactionType.onchange = function(){
            window[6].document.getElementById('res0').value = ""
            window[6].document.getElementById('res1').value = ""
            window[6].document.getElementById('res2').value = ""
            window[6].document.getElementById('res3').value = ""
            window[6].document.getElementById('res4').value = ""
            window[6].document.getElementById('res5').value = ""
        }

        var maxCapaElement = window[6].document.querySelector("body > table > tbody > tr:nth-child(2) > td > table > tbody > tr > td:nth-child(2) > table:nth-child(3) > tbody > tr:nth-child(3) > td:nth-child(2)")
        var maxCapaString = maxCapaElement.innerText
        maxCapaElement.innerText = maxCapaString + "(" + parseInt(getMaxCapa()/(1+(getInterest()/100))).toLocaleString("de-DE")+ ")"



        var feBtn = window[6].document.querySelector("body > table > tbody > tr:nth-child(2) > td > table > tbody > tr > td:nth-child(2) > table:nth-child(3) > tbody > tr:nth-child(5) > td:nth-child(1) > a")

        feBtn.onclick = function(){
            var freeCapa = getFreeCapacity(0)
            var availRess = getCurrentRes(0)
            var ress = getAccountStatus(0)
            var maxCapaMinusInterest = getMaxCapaMinusInterest()
            window[6].document.getElementById('res0').value = 0
            if(isDeposit()){
                if(freeCapa > availRess) window[6].document.getElementById('res0').value = availRess
                else window[6].document.getElementById('res0').value = freeCapa
            }
            else if(ress>maxCapaMinusInterest)window[6].document.getElementById('res0').value = parseInt(Math.ceil(ress-maxCapaMinusInterest))
        }

        var krBtn = window[6].document.querySelector("body > table > tbody > tr:nth-child(2) > td > table > tbody > tr > td:nth-child(2) > table:nth-child(3) > tbody > tr:nth-child(6) > td:nth-child(1) > a")
        krBtn.onclick = function(){
            var freeCapa = getFreeCapacity(1)
            var availRess = getCurrentRes(1)
            var ress = getAccountStatus(1)
            var maxCapaMinusInterest = getMaxCapaMinusInterest()
            window[6].document.getElementById('res1').value = 0
            if(isDeposit()){
                if(freeCapa > availRess) window[6].document.getElementById('res1').value = availRess
                else window[6].document.getElementById('res1').value = freeCapa
            }
            else if(ress>maxCapaMinusInterest)window[6].document.getElementById('res1').value = parseInt(Math.ceil(ress-maxCapaMinusInterest))
        }

        var fbBtn = window[6].document.querySelector("body > table > tbody > tr:nth-child(2) > td > table > tbody > tr > td:nth-child(2) > table:nth-child(3) > tbody > tr:nth-child(7) > td:nth-child(1) > a")
        fbBtn.onclick = function(){
            var freeCapa = getFreeCapacity(2)
            var availRess = getCurrentRes(2)
            var ress = getAccountStatus(2)
            var maxCapaMinusInterest = getMaxCapaMinusInterest()
            window[6].document.getElementById('res2').value = 0
            if(isDeposit()){
                if(freeCapa > availRess) window[6].document.getElementById('res2').value = availRess
                else window[6].document.getElementById('res2').value = freeCapa
            }
            else if(ress>maxCapaMinusInterest)window[6].document.getElementById('res2').value = parseInt(Math.ceil(ress-maxCapaMinusInterest))
        }

        var orBtn = window[6].document.querySelector("body > table > tbody > tr:nth-child(2) > td > table > tbody > tr > td:nth-child(2) > table:nth-child(3) > tbody > tr:nth-child(8) > td:nth-child(1) > a")
        orBtn.onclick = function(){
            var freeCapa = getFreeCapacity(3)
            var availRess = getCurrentRes(3)
            var ress = getAccountStatus(3)
            var maxCapaMinusInterest = getMaxCapaMinusInterest()
            window[6].document.getElementById('res3').value = 0
            if(isDeposit()){
                if(freeCapa > availRess) window[6].document.getElementById('res3').value = availRess
                else window[6].document.getElementById('res3').value = freeCapa
            }
            else if(ress>maxCapaMinusInterest)window[6].document.getElementById('res3').value = parseInt(Math.ceil(ress-maxCapaMinusInterest))
        }

        var frBtn = window[6].document.querySelector("body > table > tbody > tr:nth-child(2) > td > table > tbody > tr > td:nth-child(2) > table:nth-child(3) > tbody > tr:nth-child(9) > td:nth-child(1) > a")
        frBtn.onclick = function(){
            var freeCapa = getFreeCapacity(4)
            var availRess = getCurrentRes(4)
            var ress = getAccountStatus(4)
            var maxCapaMinusInterest = getMaxCapaMinusInterest()
            window[6].document.getElementById('res4').value = 0
            if(isDeposit()){
                if(freeCapa > availRess) window[6].document.getElementById('res4').value = availRess
                else window[6].document.getElementById('res4').value = freeCapa
            }
            else if(ress>maxCapaMinusInterest)window[6].document.getElementById('res4').value = parseInt(Math.ceil(ress-maxCapaMinusInterest))
        }

        var AuBtn = window[6].document.querySelector("body > table > tbody > tr:nth-child(2) > td > table > tbody > tr > td:nth-child(2) > table:nth-child(3) > tbody > tr:nth-child(10) > td:nth-child(1) > a")
        AuBtn.onclick = function(){
            var freeCapa = getFreeCapacity(5)
            var availRess = getCurrentRes(5)
            var ress = getAccountStatus(5)
            var maxCapaMinusInterest = getMaxCapaMinusInterest()
            window[6].document.getElementById('res5').value = 0
            if(isDeposit()){
                if(freeCapa > availRess) window[6].document.getElementById('res5').value = availRess
                else window[6].document.getElementById('res5').value = freeCapa
            }
            else if(ress>maxCapaMinusInterest)window[6].document.getElementById('res5').value = parseInt(Math.ceil(ress-maxCapaMinusInterest))
        }



    }

    function isDeposit(){
        var select = window[6].document.getElementsByName("transaction_type")[0]
        return select.selectedIndex == 1
    }

    function getMaxCapaMinusInterest(){
        var interest = getInterest()
        var maxCapa = getMaxCapa()
        return maxCapa/(1+(interest/100))
    }

    function getFreeCapacity(ressNumber){
        var trans = getAllTransactions()
        var interest = getInterest()
        var maxCapa = getMaxCapa()
        var maxCapaMinusInterest = maxCapa/(1+(interest/100))
        var sumTrans = getSumTrans(trans)

        var freeCapacity =0
        freeCapacity = parseInt(maxCapaMinusInterest-getAccountStatus(ressNumber)-sumTrans[ressNumber])
        return freeCapacity
    }

    function getAllTransactions(){

        const tbody = window[6].document.querySelector("body > table > tbody > tr:nth-child(2) > td > table > tbody > tr > td:nth-child(2) > table:nth-child(5) > tbody")
        const trs = tbody.children
        var transactions = new Array
        var transaction = {date:null, deposits:new Array(0,0,0,0,0,0), debits:new Array(0,0,0,0,0,0)};

        for(let i=8; i<trs.length; i++){
            var tds = trs[i].children
            for(let j=0; j<tds.length; j++){
                var ressString = null
                var ressValue = 0
                var isDeposit = false
                if(tds[j].innerText.includes("Transaktion") && j==0){
                    if(i>8){
                        transactions.push(transaction)
                        transaction = {date:null, deposits:new Array(0,0,0,0,0,0), debits:new Array(0,0,0,0,0,0)};
                    }
                    var dateString = tds[j].innerText.replace("Transaktion ")
                    transaction.date = getDate(dateString)
                }
                if((trs[i].children.length == 2 && j == 0)){
                    ressString = tds[j].innerHTML.replaceAll("&nbsp;","")
                    ressString = ressString.replaceAll(" ","")
                    ressString = ressString.replaceAll("\n","")
                    ressValue = parseInt(tds[j+1].innerText.replaceAll(".",""))
                    isDeposit = tds[j+1].bgColor == "#006600"
                }
                if((trs[i].children.length == 3 && j == 1)){
                    ressString = tds[j].innerHTML.replaceAll("&nbsp;","")
                    ressString = ressString.replaceAll(" ","")
                    ressString = ressString.replaceAll("\n","")
                    ressValue = parseInt(tds[j+1].innerText.replaceAll(".",""))
                    isDeposit = tds[j+1].bgColor == "#006600"
                }
                if(ressString != null && isDeposit){
                    switch (ressString) {
                        case "Roheisen":transaction.deposits[0] = ressValue;break;
                        case "Kristalle":transaction.deposits[1] = ressValue;break;
                        case "Frubin":transaction.deposits[2] = ressValue;break;
                        case "Orizin":transaction.deposits[3] = ressValue;break;
                        case "Frurozin":transaction.deposits[4] = ressValue;break;
                        case "Gold":transaction.deposits[5] = ressValue;break;
                    }
                }
                if(ressString != null && !isDeposit){
                    switch (ressString) {
                        case "Roheisen":transaction.debits[0] = ressValue;break;
                        case "Kristalle":transaction.debits[1] = ressValue;break;
                        case "Frubin":transaction.debits[2] = ressValue;break;
                        case "Orizin":transaction.debits[3] = ressValue;break;
                        case "Frurozin":transaction.debits[4] = ressValue;break;
                        case "Gold":transaction.debits[5] = ressValue;break;
                    }
                }
            }
        }
        transactions.push(transaction)
        return transactions
    }

    function getInterest(){
        var interestString = window[6].document.querySelector("body > table > tbody > tr:nth-child(2) > td > table > tbody > tr > td:nth-child(2) > table:nth-child(3) > tbody > tr:nth-child(2) > td:nth-child(2)").innerText
        let regex = /([+-]?(?=\.\d|\d)(?:\d+)?(?:\.?\d*))(?:[Ee]([+-]?\d+))?/i
        return parseFloat(interestString.match(regex)[0])
    }

    function getMaxCapa(){
        var maxCapaElement = window[6].document.querySelector("body > table > tbody > tr:nth-child(2) > td > table > tbody > tr > td:nth-child(2) > table:nth-child(3) > tbody > tr:nth-child(3) > td:nth-child(2)")
        var maxCapaString = maxCapaElement.innerText
        var maxCapa = parseInt(maxCapaString.replaceAll(".",""))
        //maxCapaElement.innerText = maxCapaString + "(" + parseInt(maxCapa/(1+(getInterest()/100))).toLocaleString("de-DE")+ ")"
        return maxCapa
    }

    function getSumTrans(trans){
        var sum = Array(0,0,0,0,0,0)
        for(let i=0;i<trans.length;i++){
            for(let j=0;j<6;j++){
                sum[j] += trans[i].deposits[j]
                //sum[j] -= trans[i].debits[j]
            }
        }
        return sum
    }

    function getAccountStatus(ressNumber){
        var fe = parseInt(window[6].document.querySelector("body > table > tbody > tr:nth-child(2) > td > table > tbody > tr > td:nth-child(2) > table:nth-child(5) > tbody > tr:nth-child(2) > td:nth-child(3)").innerText.replaceAll(".",""))
        var kr = parseInt(window[6].document.querySelector("body > table > tbody > tr:nth-child(2) > td > table > tbody > tr > td:nth-child(2) > table:nth-child(5) > tbody > tr:nth-child(3) > td:nth-child(2)").innerText.replaceAll(".",""))
        var fb = parseInt(window[6].document.querySelector("body > table > tbody > tr:nth-child(2) > td > table > tbody > tr > td:nth-child(2) > table:nth-child(5) > tbody > tr:nth-child(4) > td:nth-child(2)").innerText.replaceAll(".",""))
        var or = parseInt(window[6].document.querySelector("body > table > tbody > tr:nth-child(2) > td > table > tbody > tr > td:nth-child(2) > table:nth-child(5) > tbody > tr:nth-child(5) > td:nth-child(2)").innerText.replaceAll(".",""))
        var fr = parseInt(window[6].document.querySelector("body > table > tbody > tr:nth-child(2) > td > table > tbody > tr > td:nth-child(2) > table:nth-child(5) > tbody > tr:nth-child(6) > td:nth-child(2)").innerText.replaceAll(".",""))
        var au = parseInt(window[6].document.querySelector("body > table > tbody > tr:nth-child(2) > td > table > tbody > tr > td:nth-child(2) > table:nth-child(5) > tbody > tr:nth-child(7) > td:nth-child(2)").innerText.replaceAll(".",""))
        var ress = new Array(fe,kr,fb,or,fr,au)
        return ress[ressNumber]
    }


    //   ________________________________
    //  |                                |
    //  |           Database             |
    //  |________________________________|


    var build = new Array()
    const LW_ID = 0
    const STRING = 1
    const LVL = 2
    const RES = 3

    const HAUPTQUARTIER = 5
    const BAUZENTRALE = 6
    const FORSCHUNG = 7
    const SPIOSTATION = 8
    const ROHEISEN = 9
    const KRISTALL = 10
    const FRUBIN = 11
    const ORIZIN = 12
    const FUROZIN = 13
    const GOLD = 1
    const EISENLAGER = 14
    const KRISLAGER = 15
    const FRUBLAGER = 16
    const ORILAGER = 17
    const FUROLAGER = 18
    const GOLDLAGER = 19
    const KERNKRAFTWERK = 20
    const FUSIONSKRAFTWERK = 21
    const WERFT = 22
    const VERTEIDIGUNG = 23
    const SPIOABWEHR = 24
    const FRUHWARN = 25
    const AKADEMIE = 26
    const HANGAR = 27
    const HANDELSPOSTEN = 28
    const HANDELSZENTRUM = 29
    const BANKK = 30
    const GEHEIMDIENST = 31
    const KREDIT = 32
    const WERKSTATT = 33
    const RECYCLING = 34

    const INDEX_HQ = 0
    const INDEX_BZ = 1
    const INDEX_FZ = 2
    const INDEX_SS = 3
    const INDEX_FE = 10
    const INDEX_KR = 11
    const INDEX_FR = 12
    const INDEX_OR = 13
    const INDEX_FU = 14
    const INDEX_AU = 15
    const INDEX_FEL = 20
    const INDEX_KRL = 22
    const INDEX_FRL = 23
    const INDEX_ORL = 24
    const INDEX_FUL = 25
    const INDEX_AUL = 26
    const INDEX_KKW = 30
    const INDEX_FKW = 31
    const INDEX_RSF = 40
    const INDEX_VTS = 41
    const INDEX_SPA = 42
    const INDEX_FWA = 43
    const INDEX_HP = 50
    const INDEX_HZ = 51
    const INDEX_BA = 52
    const INDEX_GDZ = 60
    const INDEX_KRE = 61
    const INDEX_WER = 62
    const INDEX_REC = 63


    const RES_FE = 0
    const RES_KR = 1
    const RES_FR = 2
    const RES_OR = 3
    const RES_FU = 4
    const RES_AU = 5

    build[INDEX_HQ] = new Array()
    build[INDEX_BZ] = new Array()
    build[INDEX_FZ] = new Array()
    build[INDEX_SS] = new Array()
    build[INDEX_FE] = new Array()
    build[INDEX_KR] = new Array()
    build[INDEX_FR] = new Array()
    build[INDEX_OR] = new Array()
    build[INDEX_FU] = new Array()
    build[INDEX_AU] = new Array()
    build[INDEX_FEL] = new Array()
    build[INDEX_KRL] = new Array()
    build[INDEX_FRL] = new Array()
    build[INDEX_ORL] = new Array()
    build[INDEX_FUL] = new Array()
    build[INDEX_AUL] = new Array()
    build[INDEX_KKW] = new Array()
    build[INDEX_FKW] = new Array()
    build[INDEX_RSF] = new Array()
    build[INDEX_VTS] = new Array()
    build[INDEX_SPA] = new Array()
    build[INDEX_FWA] = new Array()
    build[INDEX_HP] = new Array()
    build[INDEX_HZ] = new Array()
    build[INDEX_BA] = new Array()
    build[INDEX_GDZ] = new Array()
    build[INDEX_KRE] = new Array()
    build[INDEX_WER] = new Array()
    build[INDEX_REC] = new Array()

    build[INDEX_HQ][LW_ID] = HAUPTQUARTIER
    build[INDEX_BZ][LW_ID] = BAUZENTRALE
    build[INDEX_FZ][LW_ID] = FORSCHUNG
    build[INDEX_SS][LW_ID] = SPIOSTATION
    build[INDEX_FE][LW_ID] = ROHEISEN
    build[INDEX_KR][LW_ID] = KRISTALL
    build[INDEX_FR][LW_ID] = FRUBIN
    build[INDEX_OR][LW_ID] = ORIZIN
    build[INDEX_FU][LW_ID] = FUROZIN
    build[INDEX_AU][LW_ID] = GOLD
    build[INDEX_FEL][LW_ID] = EISENLAGER
    build[INDEX_KRL][LW_ID] = KRISLAGER
    build[INDEX_FRL][LW_ID] = FRUBLAGER
    build[INDEX_ORL][LW_ID] = ORILAGER
    build[INDEX_FUL][LW_ID] = FUROLAGER
    build[INDEX_AUL][LW_ID] = GOLDLAGER
    build[INDEX_KKW][LW_ID] = KERNKRAFTWERK
    build[INDEX_FKW][LW_ID] = FUSIONSKRAFTWERK
    build[INDEX_RSF][LW_ID] = WERFT
    build[INDEX_VTS][LW_ID] = VERTEIDIGUNG
    build[INDEX_SPA][LW_ID] = SPIOABWEHR
    build[INDEX_FWA][LW_ID] = FRUHWARN
    build[INDEX_HP][LW_ID] = HANDELSPOSTEN
    build[INDEX_HZ][LW_ID] = HANDELSZENTRUM
    build[INDEX_BA][LW_ID] = BANKK
    build[INDEX_GDZ][LW_ID] = GEHEIMDIENST
    build[INDEX_KRE][LW_ID] = KREDIT
    build[INDEX_WER][LW_ID] = WERKSTATT
    build[INDEX_REC][LW_ID] = RECYCLING


    build[INDEX_HQ][STRING] = "Hauptquartier"
    build[INDEX_BZ][STRING] = "Bauzentrale"
    build[INDEX_FZ][STRING] = "Forschungszentrale"
    build[INDEX_SS][STRING] = "Spionagestation"
    build[INDEX_FE][STRING] = "Roheisen Mine"
    build[INDEX_KR][STRING] = "Kristall Förderungsanlage"
    build[INDEX_FR][STRING] = "Frubin Sammler"
    build[INDEX_OR][STRING] = "Orizin Gewinnungsanlage"
    build[INDEX_FU][STRING] = "Frurozin Herstellung"
    build[INDEX_AU][STRING] = "Gold Mine"
    build[INDEX_FEL][STRING] = "Roheisen Lager"
    build[INDEX_KRL][STRING] = "Kristall Lager"
    build[INDEX_FRL][STRING] = "Frubin Lager"
    build[INDEX_ORL][STRING] = "Orizin Lager"
    build[INDEX_FUL][STRING] = "Frurozin Lager"
    build[INDEX_AUL][STRING] = "Gold Lager"
    build[INDEX_KKW][STRING] = "Kernkraftwerk"
    build[INDEX_FKW][STRING] = "Fusionskraftwerk"
    build[INDEX_RSF][STRING] = "Raumschiff Fabrik"
    build[INDEX_VTS][STRING] = "Verteidigungsstation"
    build[INDEX_SPA][STRING] = "Spionageabwehr"
    build[INDEX_FWA][STRING] = "Frühwarnanlage"
    build[INDEX_HP][STRING] = "Handelsposten"
    build[INDEX_HZ][STRING] = "Handelszentrum"
    build[INDEX_BA][STRING] = "X-Wars Bank"
    build[INDEX_GDZ][STRING] = "Geheimdienstzentrum"
    build[INDEX_KRE][STRING] = "Kreditinstitut"
    build[INDEX_WER][STRING] = "Werkstatt"
    build[INDEX_REC][STRING] = "Recycler"

    build[INDEX_HQ][RES] = ress_HQ
    build[INDEX_BZ][RES] = ress_BZ
    build[INDEX_FZ][RES] = ress_FZ
    build[INDEX_SS][RES] = ress_SS
    build[INDEX_FE][RES] = ress_FE
    build[INDEX_KR][RES] = ress_KR
    build[INDEX_FR][RES] = ress_FR
    build[INDEX_OR][RES] = ress_OR
    build[INDEX_FU][RES] = ress_FU
    build[INDEX_AU][RES] = ress_AU
    build[INDEX_FEL][RES] = ress_FEL
    build[INDEX_KRL][RES] = ress_KRL
    build[INDEX_FRL][RES] = ress_FRL
    build[INDEX_ORL][RES] = ress_ORL
    build[INDEX_FUL][RES] = ress_FUL
    build[INDEX_AUL][RES] = ress_AUL
    build[INDEX_KKW][RES] = ress_KKW
    build[INDEX_FKW][RES] = ress_FKW
    build[INDEX_RSF][RES] = ress_RSF
    build[INDEX_VTS][RES] = ress_VTS
    build[INDEX_SPA][RES] = ress_SPA
    build[INDEX_FWA][RES] = ress_FWA
    build[INDEX_HP][RES] = ress_HP
    build[INDEX_HZ][RES] = ress_HZ
    build[INDEX_BA][RES] = ress_BA
    build[INDEX_GDZ][RES] = ress_GDZ
    build[INDEX_KRE][RES] = ress_KRE
    build[INDEX_WER][RES] = ress_WER
    build[INDEX_REC][RES] = ress_REC

    var $ = document.getElementById;

    function getBuildNames(){
        var names = new Array();
        var index = 0
        for (var i = 0; i < build.length; i++) {
            if (build[i] != null){
                names[index] = build[i][STRING]
                index++
            }
        }
        return names
    }

    function ress_HQ(lvl){
        var res = new Array()
        res[RES_FE] = 320*(parseInt(lvl)+1)+80
        res[RES_KR] = 120*(parseInt(lvl)+1)+30
        res[RES_FR] = 0
        res[RES_OR] = 0
        res[RES_FU] = 0
        res[RES_AU] = 0
        return res
    }

    function ress_BZ(lvl){
        var res = new Array()
        res[RES_FE] = (240*(parseInt(lvl)+1)+60)
        res[RES_KR] = (120*(parseInt(lvl)+1)+30)
        res[RES_FR] = 0
        res[RES_OR] = 0
        res[RES_FU] = 0
        res[RES_AU] = 0
        return res
    }

        function ress_FZ(lvl){
        var res = new Array()
        res[RES_FE] = Math.round(400*(1+(parseInt(lvl)+1)*0.8))
        res[RES_KR] = 0
        res[RES_FR] = Math.round(100*(1+(parseInt(lvl)+1)*0.8))
        res[RES_OR] = Math.round(100*(1+(parseInt(lvl)+1)*0.8))
        res[RES_FU] = 0
        res[RES_AU] = 0
        return res
    }

        function ress_SS(lvl){
        var res = new Array()
        res[RES_FE] = Math.round(750*(1+(parseInt(lvl)+1)*0.8))
        res[RES_KR] = 0
        res[RES_FR] = Math.round(500*(1+(parseInt(lvl)+1)*0.8))
        res[RES_OR] = 0
        res[RES_FU] = 0
        res[RES_AU] = 0
        return res
    }

    function ress_FE(lvl){
        var res = new Array()
        res[RES_FE] = (Math.round(Math.pow(parseInt(lvl)*100/25, 2)+100))
        res[RES_KR] = (Math.round(Math.pow(parseInt(lvl)*64/25, 2)+64))
        res[RES_FR] = 0
        res[RES_OR] = (Math.round(Math.pow(parseInt(lvl)*30/25, 2)+30))
        res[RES_FU] = 0
        res[RES_AU] = 0
        return res
    }

     function ress_KR(lvl){
        var res = new Array()
        res[RES_FE] = (Math.round(Math.pow(parseInt(lvl)*80/25, 2)+80))
        res[RES_KR] = (Math.round(Math.pow(parseInt(lvl)*80/25, 2)+80))
        res[RES_FR] = 0
        res[RES_OR] = 0
        res[RES_FU] = 0
        res[RES_AU] = 0
        return res
    }

    function ress_FR(lvl){
        var res = new Array()
        res[RES_FE] = (Math.round(Math.pow(parseInt(lvl)*80/25, 2)+80))
        res[RES_KR] = (Math.round(Math.pow(parseInt(lvl)*64/25, 2)+64))
        res[RES_FR] = 0
        res[RES_OR] = 0
        res[RES_FU] = 0
        res[RES_AU] = 0
        return res
    }

    function ress_OR(lvl){
        var res = new Array()
        res[RES_FE] = (Math.round(Math.pow(parseInt(lvl)*80/25, 2)+80))
        res[RES_KR] = (Math.round(Math.pow(parseInt(lvl)*64/25, 2)+64))
        res[RES_FR] = 0
        res[RES_OR] = 0
        res[RES_FU] = 0
        res[RES_AU] = 0
        return res
    }

    function ress_FU(lvl){
        var res = new Array()
        res[RES_FE] = (Math.round(Math.pow((parseInt(lvl)+1)*75/25, 2)+70))
        res[RES_KR] = (Math.round(Math.pow((parseInt(lvl)+1)*48/25, 2)+48))
        res[RES_FR] = (Math.round(Math.pow((parseInt(lvl)+1)*60/25, 2)+60))
        res[RES_OR] = 0
        res[RES_FU] = 0
        res[RES_AU] = 0
        return res
    }

    function ress_AU(lvl){
        var res = new Array()
        res[RES_FE] = (Math.round(Math.pow((parseInt(lvl)+1)*200/25, 2)+200))
        res[RES_KR] = (Math.round(Math.pow((parseInt(lvl)+1)*125/25, 2)+125))
        res[RES_FR] = 0
        res[RES_OR] = (Math.round(Math.pow((parseInt(lvl)+1)*140/25, 2)+140))
        res[RES_FU] = 0
        res[RES_AU] = 0
        return res
    }

    function ress_FEL(lvl){
        var res = new Array()
        res[RES_FE] = Math.round(Math.pow((parseInt(lvl)+1)*400/20, 2)+400)
        res[RES_KR] = 0
        res[RES_FR] = Math.round(Math.pow((parseInt(lvl)+1)*300/20, 2)+300)
        res[RES_OR] = 0
        res[RES_FU] = Math.round(Math.pow((parseInt(lvl)+1)*140/20, 2)+140)
        res[RES_AU] = 0
        return res
    }

    function ress_KRL(lvl){
        var res = new Array()
        res[RES_FE] = Math.round(Math.pow((parseInt(lvl)+1)*350/20, 2)+350)
        res[RES_KR] = Math.round(Math.pow((parseInt(lvl)+1)*150/20, 2)+150)
        res[RES_FR] = Math.round(Math.pow((parseInt(lvl)+1)*300/20, 2)+300)
        res[RES_OR] = 0
        res[RES_FU] = Math.round(Math.pow((parseInt(lvl)+1)*80/20, 2)+80)
        res[RES_AU] = 0
        return res
    }

    function ress_FRL(lvl){
        var res = new Array()
        res[RES_FE] = Math.round(Math.pow((parseInt(lvl)+1)*350/20, 2)+350)
        res[RES_KR] = 0
        res[RES_FR] = Math.round(Math.pow((parseInt(lvl)+1)*350/20, 2)+350)
        res[RES_OR] = 0
        res[RES_FU] = 0
        res[RES_AU] = 0
        return res
    }

    function ress_ORL(lvl){
        var res = new Array()
        res[RES_FE] = Math.round(Math.pow((parseInt(lvl)+1)*400/20, 2)+400)
        res[RES_KR] = 0
        res[RES_FR] = Math.round(Math.pow((parseInt(lvl)+1)*300/20, 2)+300)
        res[RES_OR] = 0
        res[RES_FU] = 0
        res[RES_AU] = 0
        return res
    }

    function ress_FUL(lvl){
        var res = new Array()
        res[RES_FE] = Math.round(Math.pow((parseInt(lvl)+1)*350/20, 2)+350)
        res[RES_KR] = 0
        res[RES_FR] = Math.round(Math.pow((parseInt(lvl)+1)*350/20, 2)+350)
        res[RES_OR] = 0
        res[RES_FU] = 0
        res[RES_AU] = 0
        return res
    }

    function ress_AUL(lvl){
        var res = new Array()
        res[RES_FE] = Math.round(Math.pow((parseInt(lvl)+1)*25/1, 2)+500)
        res[RES_KR] = 0
        res[RES_FR] = Math.round(Math.pow((parseInt(lvl)+1)*17.5/1, 2)+350)
        res[RES_OR] = 0
        res[RES_FU] = Math.round(Math.pow((parseInt(lvl)+1)*7.5/1, 2)+150)
        res[RES_AU] = 0
        return res
    }

    function ress_KKW(lvl){
        var res = new Array()
        res[RES_FE] = Math.round(150*(1+parseInt(lvl)*0.8))
        res[RES_KR] = Math.round(500*(1+parseInt(lvl)*0.8))
        res[RES_FR] = 0
        res[RES_OR] = 0
        res[RES_FU] = 0
        res[RES_AU] = 0
        return res
    }

    function ress_FKW(lvl){
        var res = new Array()
        if(lvl == 0){
            res[RES_FE] = 25000
            res[RES_KR] = 40000
            res[RES_FR] = 20000
        }
        else{
            res[RES_FE] = (parseInt(lvl) + 1)*20000+25000
            res[RES_KR] = (parseInt(lvl) + 1)*32000+40000
            res[RES_FR] = (parseInt(lvl) + 1)*16000+20000
        }
        res[RES_OR] = 0
        res[RES_FU] = 0
        res[RES_AU] = 0
        return res
    }

    function ress_RSF(lvl){
        var res = new Array()
        res[RES_FE] = Math.round(4000*(1+(parseInt(lvl)+1)*0.8))
        res[RES_KR] = Math.round(350*(1+(parseInt(lvl)+1)*0.8))
        res[RES_FR] = 0
        res[RES_OR] = 0
        res[RES_FU] = Math.round(3000*(1+(parseInt(lvl)+1)*0.8))
        res[RES_AU] = 0
        return res
    }

    function ress_VTS(lvl){
        var res = new Array()
        res[RES_FE] = Math.round(3250*(1+(parseInt(lvl)+1)*0.8))
        res[RES_KR] = Math.round(250*(1+(parseInt(lvl)+1)*0.8))
        res[RES_FR] = 0
        res[RES_OR] = 0
        res[RES_FU] = Math.round(2000*(1+(parseInt(lvl)+1)*0.8))
        res[RES_AU] = 0
        return res
    }

    function ress_SPA(lvl){
        var res = new Array()
        res[RES_FE] = Math.round(750*(1+(parseInt(lvl)+1)*0.8))
        res[RES_KR] = 0
        res[RES_FR] = Math.round(500*(1+(parseInt(lvl)+1)*0.8))
        res[RES_OR] = 0
        res[RES_FU] = 0
        res[RES_AU] = 0
        return res
    }

    function ress_FWA(lvl){
        var res = new Array()
        res[RES_FE] = Math.round(502*(parseInt(lvl)+1)*(parseInt(lvl)+1)+560)
        res[RES_KR] = Math.round(1024*(parseInt(lvl)+1)*(parseInt(lvl)+1)+800)
        res[RES_FR] = Math.round(1296*(parseInt(lvl)+1)*(parseInt(lvl)+1)+900)
        res[RES_OR] = 0
        res[RES_FU] = 0
        res[RES_AU] = 0
        return res
    }

    function ress_HP(lvl){
        var res = new Array()
        res[RES_FE] = Math.round(7200*(1+parseInt(lvl)*0.8))
        res[RES_KR] = Math.round(1000*(1+parseInt(lvl)*0.8))
        res[RES_FR] = 0
        res[RES_OR] = 0
        res[RES_FU] = Math.round(5400*(1+parseInt(lvl)*0.8))
        res[RES_AU] = 0
        return res
    }

    function ress_HZ(lvl){
        var res = new Array()
        res[RES_FE] = Math.round(6000*Math.pow(2,parseInt(lvl)/2))
        res[RES_KR] = Math.round(2250*Math.pow(2,parseInt(lvl)/2))
        res[RES_FR] = 0
        res[RES_OR] = 0
        res[RES_FU] = Math.round(3250*Math.pow(2,parseInt(lvl)/2))
        res[RES_AU] = 0
        return res
    }

    function ress_BA(lvl){
        var res = new Array()
        if(lvl == 0){
            res[RES_FE] = 4500
            res[RES_KR] = 2000
            res[RES_FU] = 3500
        }
        else{
            res[RES_FE] = Math.round(12656.25*Math.pow((parseInt(lvl) + 1), 2) + 4500)
            res[RES_KR] = Math.round(2500*Math.pow((parseInt(lvl) + 1), 2) + 2000)
            res[RES_FU] = Math.round(7656.25*Math.pow((parseInt(lvl) + 1), 2) + 3500)
        }
        res[RES_FR] = 0
        res[RES_OR] = 0
        res[RES_AU] = 0
        return res
    }

    function ress_GDZ(lvl){
        var res = new Array()
        if(lvl == 0){
            res[RES_FE] = 8000
            res[RES_KR] = 4000
            res[RES_FR] = 12000
            res[RES_OR] = 4000
        }
        else{
            res[RES_FE] = (parseInt(lvl) + 1)*6400+8000
            res[RES_KR] = (parseInt(lvl) + 1)*3200+4000
            res[RES_FR] = (parseInt(lvl) + 1)*9600+12000
            res[RES_OR] = (parseInt(lvl) + 1)*3200+4000
        }
        res[RES_FU] = 0
        res[RES_AU] = 0
        return res
    }

    function ress_KRE(lvl){
        var res = new Array()
        if(lvl == 0){
            res[RES_FE] = 30000
            res[RES_KR] = 25000
            res[RES_OR] = 7000
        }
        else{
            res[RES_FE] = (parseInt(lvl) + 1)*24000+30000
            res[RES_KR] = (parseInt(lvl) + 1)*20000+25000
            res[RES_OR] = (parseInt(lvl) + 1)*5600+7000
        }
        res[RES_FR] = 0
        res[RES_FU] = 0
        res[RES_AU] = 0
        return res
    }

    function ress_WER(lvl){
        var res = new Array()
        if(lvl == 0){
            res[RES_FE] = 12000
            res[RES_KR] = 4000
            res[RES_FU] = 5000
        }
        else{
            res[RES_FE] = (parseInt(lvl) + 1)*9600+12000
            res[RES_KR] = (parseInt(lvl) + 1)*3200+4000
            res[RES_FU] = (parseInt(lvl) + 1)*4000+5000
        }
        res[RES_FR] = 0
        res[RES_OR] = 0
        res[RES_AU] = 0
        return res
    }

    function ress_REC(lvl){
        var res = new Array()
        if(lvl == 0){
            res[RES_FE] = 8000
            res[RES_KR] = 2500
            res[RES_FU] = 4000
        }
        else{
            res[RES_FE] = (parseInt(lvl) + 1)*6400+8000
            res[RES_KR] = (parseInt(lvl) + 1)*2000+2500
            res[RES_FU] = (parseInt(lvl) + 1)*3200+4000
        }
        res[RES_FR] = 0
        res[RES_OR] = 0
        res[RES_AU] = 0
        return res
    }





})();
