// ==UserScript==
// @name         SOE XWars Tool
// @namespace    http://tampermonkey.net/
// @version      1.01
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

    var notification_enabled = true
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
        }
        switch(elementText){
            case "Übersicht":
                if(debug)console.log("Übersicht")
                break;
            case "Konstruktion":
                if(debug)console.log("Konstruktion")
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
        window[6].document.getElementsByName("trade_comment")[0].value = now.getHours() + ':' + now.getMinutes();

        var elementBeforeButtons = window[6].document.querySelector("body > table > tbody > tr:nth-child(2) > td > table > tbody > tr > td:nth-child(2) > form > table > tbody > tr:nth-child(4)")
        var all_save_buttons = parseHTML('<tr><td bgcolor="" class="first" colspan="4" align="center">[ <a id="save_button" href="#">sichern</a> ]</td></tr>')
        elementBeforeButtons.after(all_save_buttons)
        window[6].document.getElementById("save_button").addEventListener("click", tradeToSave)

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
        window[6].document.getElementsByName("tt_res[5]")[0].value = 999999
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
        if(debug)console.log("Handellog Button hinzufügen")
        const user = window[5].document.querySelector("body > table > tbody > tr:nth-child(3) > td > table > tbody > tr > td:nth-child(2) > b > font").innerText
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





})();
