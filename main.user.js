// ==UserScript==
// @name         XWars Tools
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description
// @author       DarthRevan
// @match        *original.xwars.net/index.php?id=&method*
// @grant        none
// @require      //cdn.jsdelivr.net/npm/sweetalert2@11
// ==/UserScript==

(function() {
    'use strict';
    
    setTimeout(setClickListener,1000)
    let nIntervId

    
    //   _____________________________
    //  |                             |
    //  |         Ress Saven          |
    //  |_____________________________|




    function menu_clicked(clickedElement){
        //console.log(clickedElement.srcElement.innerText)
        setTimeout(setClickListener,400)
    }

    function setClickListener(){
        //console.log("setClickListener")
        window[5].document.querySelector("body > table > tbody > tr:nth-child(5) > td > table > tbody > tr > td:nth-child(2)").onclick = menu_clicked
        window[6].onclick = main_clicked
    }

    function main_clicked(clickedElement){
        setTimeout(setClickListener,400)
        var elementText = clickedElement.srcElement.innerText
        //console.log(elementText)
        switch(elementText){
            case "Handelsangebot stellen":
                neuerHandelClicked()
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

    function generateTradePage(){
        var save_button = parseHTML('<td bgcolor="" class="first" colspan="2" align="center">[ <a name="save_button" href="#">sichern</a> ]</td>')
        window[6].document.querySelector("body > table > tbody > tr:nth-child(2) > td > table > tbody > tr > td:nth-child(2) > form > table > tbody > tr:nth-child(5) > td:nth-child(1)").colSpan = 2
        window[6].document.querySelector("body > table > tbody > tr:nth-child(2) > td > table > tbody > tr > td:nth-child(2) > form > table > tbody > tr:nth-child(5)").appendChild(save_button)
        window[6].document.getElementsByName("save_button")[0].addEventListener("click", fillRessToSave)
    }

    function fillRessToSave(){
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
        window[6].document.getElementsByName("tt_res[5]")[0].value = 999999
        var h = (heute.getHours()+8)%24+""
        var m = heute.getMinutes()+""
        window[6].document.getElementsByName("trade_comment")[0].value = "#SAVE# Ende " + h.padStart(2, '0')+":" + m.padStart(2, '0') + " #SAVE#"
    }


    function parseHTML(html) {
        var t = document.createElement('template');
        t.innerHTML = html;
        return t.content;
}




})();
