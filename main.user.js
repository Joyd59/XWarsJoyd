// ==UserScript==
// @name         XWars Alarm
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        *original.xwars.net/index.php?id=&method*
// @grant        none
// @require      //cdn.jsdelivr.net/npm/sweetalert2@11
// ==/UserScript==

(function() {
    'use strict';
    //   _____________________________
    //  |                             |
    //  |        Notification         |
    //  |_____________________________|



    /////---------------------------

    var beep = new Audio ("https://soundbible.com//mp3/Fuzzy Beep-SoundBible.com-1580329899.mp3")
    var bell = new Audio("https://www.tones7.com/media/sweet_text.mp3")
    var bell2 = new Audio("https://www.tones7.com/media/sweet_text.mp3")
    var alarm = new Audio("https://www.tones7.com/media/emergency_alarm.mp3");
    var testSound = new Audio("https://www.tones7.com/media/text_notification.mp3")

    var bellEnabled = true
    var alarmEnabled = true
    var updateEnabled = true
    var updateNotificationEnabled = false
    var notification_turned_off = true

    setTimeout(setClickListener,1000)
    let nIntervId

    let check_Inveravll

    var audioPlayPromise = true

    setInterval(timerIncrement, 1000)

    testSound.volume = 0
    var promise = testSound.play();
    if (promise) {
        promise.catch(function(error) {
            audioPlayPromise = false
        });
    }


    if (!check_Inveravll) {
        if(notification_turned_off) return
            check_Inveravll = setInterval(checkForMessages, 1000);
        }

    var idleTime = 0;

    function ResetIdleTime(){
        idleTime = 0
    }

    function updateUebersicht(){
        idleTime = 0
        console.log("Update")
        window[5].document.querySelector("body > table > tbody > tr:nth-child(5) > td > table > tbody > tr > td:nth-child(2) > a:nth-child(3)").click()
        if(updateNotificationEnabled)beep.play()
        setTimeout(() => {
            window[6].onkeypress = ResetIdleTime
            window[6].onmousemove = ResetIdleTime
        }, 2000);

    }

    function timerIncrement() {
        idleTime = idleTime + 1;
        if (idleTime > 150 + Math.floor(Math.random() * 20) ){ // about 3 minutes
            if(updateEnabled)updateUebersicht();
        }
    }

    function checkForMessages(){
        var nachricht = false
        for (const a of window[6].document.querySelectorAll("a")) {
            if (a.textContent.includes("Nachricht")) {
                nachricht = true
            }
        }
        var ereignis = false
        for (const a of window[6].document.querySelectorAll("a")) {
            if (a.textContent.includes("Ereignis")) {
                ereignis = true
            }
        }
        if(nachricht || ereignis){ // Bedingung für Message Sound
            if(idleTime > 10 && bellEnabled){
                bellEnabled = false
                playBell()
                setTimeout(playBell2,700)
                setTimeout(bellEnable,8000)
            }
        }
        if(false){ // Bedingung für Attack Alarm
            startAlarm()
        }
    }


    function startAlarm(){
        if(alarmEnabled){
            alarm.play()
            alarmEnabled = false
            setTimeout(stopAlarm,3600)
        }
    }

    function stopAlarm(){
        alarm.pause();
        alarm.currentTime = 0;
        setTimeout(enableAlarm,10000)
    }

    function enableAlarm(){
        alarmEnabled = true
    }
    function bellEnable(){
        bellEnabled = true
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




    function menu_clicked(clickedElement){
        ResetIdleTime()
        //console.log(clickedElement.srcElement.innerText)
        setTimeout(setClickListener,400)
    }

    function setClickListener(){
        //console.log("setClickListener")
        window[5].document.querySelector("body > table > tbody > tr:nth-child(5) > td > table > tbody > tr > td:nth-child(2)").onclick = menu_clicked
        window[6].onclick = main_clicked
    }

    function main_clicked(clickedElement){
        ResetIdleTime()
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