// ==UserScript==
// @name         SOE XWars Tool
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  
// @author       DartRevan
// @match        *original.xwars.net/index.php?id=&method*
// @match        *original.xwars.net/?id*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    //   _____________________________
    //  |                             |
    //  |           CONFIG            |
    //  |_____________________________|

    var notification_enabled = false
    const debug = false

    //--------------------------------------------------

    //   _____________________________
    //  |                             |
    //  |           START             |
    //  |_____________________________|

    setInterval(function () {runWhenReady(setClickListener)}, 1000);
    setInterval(timerIncrement, 1000)

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
        var elementText = clickedElement.srcElement.innerText
        if(clickedElement.srcElement.localName == "select" && clickedElement.button == -1){
            if(debug)console.log("Planentenwechsel")
            resetBuild()
        }
        switch(elementText){
            case "Übersicht":
                if(debug)console.log("Übersicht")
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
                break;
            case "Handel":
                if(debug)console.log("Handel")
                setTimeout(hideSaveTrades,300)
                break;
            case "Rohstoffe":
                if(debug)console.log("Rohstoffe")
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
            resetBuild()
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

                // Navigation/Spionage
            case "Galaxieansicht":
                if(debug)console.log("Galaxieansicht")
                break;
            case "Planeten suchen":
                if(debug)console.log("Planeten suchen")
                break;
            case "Planeten Observation":
                if(debug)console.log("Planeten Observation")
                break;

                //
        }
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
        if(debug)console.log("IdleTime: " + idleTime)
        checkForMessages()
        if (idleTime > 150 + Math.floor(Math.random() * 20) ){ // about 3 minutes
            updateUebersicht();
        }
    }

    function checkForMessages(){
        if(!notification_enabled)return
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
        try {
            hideSaveTrades_COUNTER ++
            var test = window[6].document.querySelector("body > table > tbody > tr:nth-child(2) > td > table > tbody > tr > td:nth-child(2) > table > tbody > tr:nth-child(1) > td > b")
            if (test == null){
                if(hideSaveTrades_COUNTER < 10)setTimeout(hideSaveTrades,200)
                return
            }
        }catch (error) {
        }

        try {
            hideSaveTrades_COUNTER = 0
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
        try {
            generateTradePage_COUNTER++
            var test = window[6].document.querySelector("body > table > tbody > tr:nth-child(2) > td > table > tbody > tr > td:nth-child(2) > form > table > tbody > tr:nth-child(4)")
            if (test == null){
                if(generateTradePage_COUNTER < 10)setTimeout(generateTradePage,200)
                return
            }
        }catch (error) {
        }
        generateTradePage_COUNTER = 0
        if(debug)console.log("Save Button einblenden")

        const now = new Date();
        window[6].document.getElementsByName("trade_comment")[0].value = ("0" + now.getHours() ).slice(-2) + ":" + ("0" + now.getMinutes()).slice(-2)

        var elementBeforeButtons = window[6].document.querySelector("body > table > tbody > tr:nth-child(2) > td > table > tbody > tr > td:nth-child(2) > form > table > tbody > tr:nth-child(4)")
        var all_save_buttons = parseHTML('<tr><td bgcolor="" class="first" colspan="4" align="center">[ <a id="save_button" href="#">sichern</a> ]</td></tr>')
        elementBeforeButtons.after(all_save_buttons)
        window[6].document.getElementById("save_button").addEventListener("click", tradeToSave)

        generateTradeToolPage()
        generateShipMarket()

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
        var planet_selector = window[5].document.querySelector("body > table > tbody > tr:nth-child(7) > td > table > tbody > tr > td:nth-child(2) > b > font > select")
        var save_planetNR = 0
        if (planet_selector.selectedIndex == 0) save_planetNR = 1
        window[6].document.getElementsByName("target")[0].value = planet_selector.options[save_planetNR].innerHTML
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
        try {
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
        if(!(user == "DarthRevan" || user == "Imperator" || user == "DarthVader" || user == "Saepus"))return
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
    //  |        Saveres Counter      |
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

        try {
            countSaveRes_COUNTER = 0
            if(debug)console.log("SaveRes Zähler")
            var tradesTable = window[6].document.querySelector("body > table > tbody > tr:nth-child(2) > td > table > tbody > tr > td:nth-child(2) > table")
            var tradesRows = tradesTable.getElementsByTagName("tr");
            var i = 1
            var resString = ""
            var ress = [0,0,0,0,0,0]
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
        generateSaveResTable(ress)
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

    getJSON("https://raw.githubusercontent.com/BenniBaerenstark/XWars-Tool/main/shipsValues.json",
            function(err, data) {
        if (err !== null) {
            console.log('Something went wrong: ' + err);
        } else {
            ships = data.ships
            symbol_true = data.symbol_true
            symbol_false = data.symbol_false
        }
    });


    function generateShipMarket(){

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
        for (const val of values) {
            var option = document.createElement("option");
            option.value = val;
            option.text = val.charAt(0).toUpperCase() + val.slice(1);
            ship_select.appendChild(option);
        }
        ship_select.addEventListener ("change", function () {
            updateShipTable()
        })

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
        firstRow.appendChild(name_Titel)
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

        var secondRow = document.createElement("tr")
        var name_String = document.createElement("td")
        name_String.id = "name_String"
        name_String.className = "first"
        secondRow.appendChild(name_String)
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
        secondRow.className = "second"
        secondRow.appendChild(tt_Value)

        table.appendChild(secondRow)

        return table
    }

    function updateShipTable(){
        var shipNr = ship_select.selectedIndex
        var temp

        window[6].document.getElementById("name_String").innerText = " " + ships[shipNr].name + " "
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
