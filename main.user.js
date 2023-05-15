// ==UserScript==
// @name         XWars Tools
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description
// @author       DarthRevan
// @match        *original.xwars.net/index.php?id=&method*
// @grant        none
// @require      //cdn.jsdelivr.net/npm/sweetalert2@11
// @require      https://apis.google.com/js/api.js
// ==/UserScript==

(function() {
    'use strict';
    

    let nIntervId

    
    //   _____________________________
    //  |                             |
    //  |         Ress Saven          |
    //  |_____________________________|

    function afterPageLoad(){
        setTimeout(setClickListener,500)
        setTimeout(setClickListener,1000)
        setTimeout(setClickListener,2000)
    }
    afterPageLoad()


    function menu_clicked(clickedElement){
        //console.log(clickedElement.srcElement.innerText)
        setTimeout(setClickListener,400)
    }

    function setClickListener(){
        //console.log("setClickListener")
        window[5].document.querySelector("body > table > tbody > tr:nth-child(5) > td > table > tbody > tr > td:nth-child(2)").onclick = menu_clicked
        window[6].onclick = main_clicked
        window[5].document.querySelector("body > table > tbody > tr:nth-child(7) > td > table > tbody > tr > td:nth-child(2) > b > font > select").onclick = afterPageLoad
    }

    function main_clicked(clickedElement){
        setTimeout(setClickListener,400)
        var elementText = clickedElement.srcElement.innerText
        //console.log(elementText)
        switch(elementText){
            case "Handelsangebot stellen":
                neuerHandelClicked()
                break;
            case "anzeigen":
                setTimeout(acceptTradeWithDBTransfer, 400);
                break;
        }
    }
    function neuerHandelClicked(){
        if (!nIntervId) {
            nIntervId = setInterval(checkPageLoaded, 400);
        }
    }

    function checkPageLoaded(){
        try {
            window[6].document.querySelector("body > table > tbody > tr:nth-child(2) > td > table > tbody > tr > td:nth-child(2) > form > table > tbody > tr:nth-child(2) > td:nth-child(1)").onclick
        }
        catch (e) {
            return false
        }
        clearInterval(nIntervId);
        nIntervId = null;
        //generateShipMarket()
        generateTradePage()
        return true
    }

    function checkRes(indexRes){
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

    }

    function generateTradePage(){
        var elementBeforeButtons = window[6].document.querySelector("body > table > tbody > tr:nth-child(2) > td > table > tbody > tr > td:nth-child(2) > form > table > tbody > tr:nth-child(4)")
        var all_save_buttons = parseHTML('<tr><td bgcolor="" class="first" colspan="4" align="center"> [ <a id="all_Res" href="#">alle Res</a> ]   [ <a id="save_button" href="#">sichern</a> ]</td></tr>')
        elementBeforeButtons.after(all_save_buttons)
        window[6].document.getElementById("all_Res").addEventListener("click", fillAllRess)
        window[6].document.getElementById("save_button").addEventListener("click", tradeToSave)
        setTimeout(resChecker, 500);
    }

    function resChecker(){
        window[6].document.getElementsByName("tf_res[0]")[0].oninput = checkRes(0)
        window[6].document.getElementsByName("tf_res[0]")[0].oninput = checkRes(1)
        window[6].document.getElementsByName("tf_res[0]")[0].oninput = checkRes(2)
        window[6].document.getElementsByName("tf_res[0]")[0].oninput = checkRes(3)
        window[6].document.getElementsByName("tf_res[0]")[0].oninput = checkRes(4)
        window[6].document.getElementsByName("tf_res[0]")[0].oninput = checkRes(5)
        setTimeout(resChecker, 500);
    }

    function fillAllRess(){
        const heute = new Date();
        var fe = window[4].document.getElementById("res0").innerText.replace('.', '');
        var kr = window[4].document.getElementById("res1").innerText.replace('.', '');
        var fb = window[4].document.getElementById("res2").innerText.replace('.', '');
        var or = window[4].document.getElementById("res3").innerText.replace('.', '');
        var fr = window[4].document.getElementById("res4").innerText.replace('.', '');
        var au = window[4].document.getElementById("res5").innerText.replace('.', '');
        var tradeCost = window[6].document.querySelector("body > table > tbody > tr:nth-child(2) > td > table > tbody > tr > td:nth-child(2) > form > table > tbody > tr:nth-child(2) > td:nth-child(3)").innerText.match(/\d/g)
        if (tradeCost.length > 0) tradeCost = tradeCost.join(".")

        window[6].document.getElementsByName("tf_res[0]")[0].value = Math.floor((fe*((100-tradeCost)/100))/10)*10
        window[6].document.getElementsByName("tf_res[1]")[0].value = Math.floor((kr*((100-tradeCost)/100))/10)*10
        window[6].document.getElementsByName("tf_res[2]")[0].value = Math.floor((fb*((100-tradeCost)/100))/10)*10
        window[6].document.getElementsByName("tf_res[3]")[0].value = Math.floor((or*((100-tradeCost)/100))/10)*10
        window[6].document.getElementsByName("tf_res[4]")[0].value = Math.floor((fr*((100-tradeCost)/100))/10)*10
        window[6].document.getElementsByName("tf_res[5]")[0].value = Math.floor((au*((100-tradeCost)/100))/10)*10
        window[6].document.getElementsByName("tt_res[0]")[0].value = 1
        window[6].document.getElementsByName("tt_res[5]")[0].value = ""
        var h = (heute.getHours())%24+""
        var m = heute.getMinutes()+""
        window[6].document.getElementsByName("trade_comment")[0].value = h.padStart(2, '0')+":" + m.padStart(2, '0')
        
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



    ///--------------- DB Einträge



    function acceptTradeWithDBTransfer(){
        if (window[6].document.querySelector("body > table > tbody > tr:nth-child(2) > td > table > tbody > tr > td:nth-child(2) > table > tbody > tr:nth-child(1) > td > b") == null) return
        if (window[6].document.querySelector("body > table > tbody > tr:nth-child(2) > td > table > tbody > tr > td:nth-child(2) > table > tbody > tr:nth-child(1) > td > b").innerText != "Überprüfung") return
        var acceptDenyTradeButtonsHTML = window[6].document.querySelector("body > table > tbody > tr:nth-child(2) > td > table > tbody > tr > td:nth-child(2) > table > tbody > tr:nth-child(9) > td").innerHTML
        var acceptButtonTransferToDB = ' [ <a id="acceptButtonTransferToDB" href="#">Annehmen + Log</a> ]'
        //window[6].document.querySelector("body > table > tbody > tr:nth-child(2) > td > table > tbody > tr > td:nth-child(2) > table > tbody > tr:nth-child(9) > td").innerHTML = acceptDenyTradeButtonsHTML + acceptButtonTransferToDB
    }




})();
