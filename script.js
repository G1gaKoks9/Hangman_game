let phrase = encodedPhrase = '';
let gallowImg = 0;
let winSound = new Audio("sound/win_sound.mp3");
let loseSound = new Audio("sound/lose_sound.mp3");
let goodGuessSound = new Audio("sound/good_guess_sound.mp3");
let badGuessSound = new Audio("sound/bad_guess_sound.mp3");
let minutes = 0;
let seconds = 0;
let minDisplay = String(minutes);
let secDisplay = String(seconds);

String.prototype.setSign = function(index, sign) {
    if (index < 0 || index >= this.length) return this.toString();
    return ''.concat(this.substring(0, index), sign, this.substring(index + 1, this.length));
}

function startGame() {
    if ((/\s*/.test(document.getElementById("input-phrase").value) &&
        !(/[a-zA-Z]/.test(document.getElementById("input-phrase").value))) ||
        /[0-9]+/.test(document.getElementById("input-phrase").value)) {
            document.getElementById("input-phrase").value = '';
            alert("Wpisz hasło");
            document.getElementById("input-phrase").focus();
            return;
        }
    
    document.getElementById("game").style.display = "flex";
    document.getElementById("phrase-box").style.position = "static";

    phrase = document.getElementById("input-phrase").value.toString().toUpperCase();
    for (i = 0; i < phrase.length; i++)
        phrase.charAt(i) == ' ' ? encodedPhrase += ' ' : encodedPhrase += '-';
    showPhrase();
}

function showPhrase() {
    document.getElementById("phrase").innerHTML = encodedPhrase;
}

function checkLetter(letter) {
    if (document.getElementById(letter).style.color == "red" ||
            document.getElementById(letter).style.color == "green" ||
            gallowImg == 8 ||
            phrase == encodedPhrase) return;
    
    let isCorrect = false;
    for (i = 0; i < phrase.length; i++) {
        if (phrase.charAt(i) == letter) {
            encodedPhrase = encodedPhrase.setSign(i, letter);
            isCorrect = true;
        }
    }
    showPhrase();

    if (isCorrect) {
        document.getElementById(letter).style.cssText = "color: green; border-color: green;";
        document.getElementById(letter).classList.add("letter-reset-hover");
        if (phrase != encodedPhrase) goodGuessSound.play();
        else {
            document.querySelectorAll(".letter-box").forEach(element => { element.classList.add("letter-reset-hover"); })
            document.querySelectorAll(".letter-box").forEach(element => { element.classList.add("letter-reset-active"); })
            document.getElementById("phrase").style.color = "green";
            document.getElementById("final-message").style.color = "green";
            clearTimeout(timerUpdate);
            document.getElementById("final-message").innerHTML = "<span>Wygrałeś :)</span>";
            winSound.play();
        }
    } else {
        document.getElementById(letter).style.cssText = "color: red; border-color: red;";
        document.getElementById(letter).classList.add("letter-reset-hover");
        gallowImg++;
        document.getElementById("gallow-img").src = 'img/s'+ gallowImg +'.png';
        document.getElementById("gallow-img").alt = 'szubienica' + gallowImg;
        if (gallowImg != 8) badGuessSound.play();
        else {
            document.getElementById("phrase").style.color = "red";
            document.getElementById("final-message").style.color = "red";
            clearTimeout(timerUpdate);
            document.getElementById("final-message").innerHTML = "<span>Przegrałeś :(</span>";
            document.querySelectorAll(".letter-box").forEach(element => { element.classList.add("letter-reset-hover"); })
            document.querySelectorAll(".letter-box").forEach(element => { element.classList.add("letter-reset-active"); })
            loseSound.play();
        }
    }
}

function timerDisplay() {
    if (phrase != "") {    
        minDisplay = String(minutes);
        secDisplay = String(seconds);
        if (minDisplay.length == 1) minDisplay = '0' + minDisplay;
        if (secDisplay.length == 1) secDisplay = '0' + secDisplay;
        document.getElementById("timer").innerHTML = ''.concat("<span>", minDisplay, ':', secDisplay, "</span>");
        seconds++;
        if (seconds == 60) {
            seconds = 0;
            minutes++;
        }

        timerUpdate = setTimeout(timerDisplay, 1000);
    }
}