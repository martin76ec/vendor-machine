/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var coins = [];
var bills = [];
var port = 3001;

window.onload = function(){
    var xhttp = new XMLHttpRequest();
    xhttp.open("GET", "http://localhost:" + port + "/State?entry=start", true);
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            document.getElementById("moneyInserted").innerHTML = this.responseText;
            document.getElementById("totalValue").innerHTML = "$ 0.00";
            writeOnLCD("Total: $" + getTotal().toFixed(2));
        }
    };
    xhttp.send();
};

function allowDrop(ev) {
    ev.preventDefault();
}

function drag(ev) {//----------arastrar
    ev.dataTransfer.setData("text", ev.target.id);
}

function drop(ev) {//----------soltar
    ev.preventDefault();
    var data = ev.dataTransfer.getData("text");
    //ev.target.appendChild(document.getElementById(data));  -------- es para que se quede el billete en el destino(y no queremos eso verdad?)
    comprobate(data)
}

function dropDollars(ev) {
    ev.preventDefault();
    var data = ev.dataTransfer.getData("text");
    //ev.target.appendChild(document.getElementById(data)); -------- es para que se quede el billete en el destino(y no queremos eso verdad?)
    comprobateDollars(data);
}
function dropBilletera(ev) {//--------billetera, origen de la moneda
    ev.preventDefault();
    var data = ev.dataTransfer.getData("text");
    ev.target.appendChild(document.getElementById(data));
    drag();

}
///-------------------FIN Funciones para arrastrar y pegar

    function sendMoney(value, type){
        var xhttp = new XMLHttpRequest();
        var state = "no respondio";
        xhttp.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                document.getElementById("moneyInserted").innerHTML = this.response;
                if (type === 'coin') {
                    coins.push(value);
                } else if (type === 'bill') {
                    bills.push(value);
                }
                document.getElementById("totalValue").innerHTML = "$ " + getTotal().toFixed(2);
                writeOnLCD("Total: $" + getTotal().toFixed(2));
            };
        }
            xhttp.open("GET", "http://localhost:" + port + "/State?entry=" + value + "&objectClass="+type, true);
            xhttp.send();
    }

    /*function writeOnLCD(message) {
        var xhttp = new XMLHttpRequest();
        var state = "no respondio";
        xhttp.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                document.getElementById("moneyInserted").innerHTML = this.response;
                if (type === 'coin') {
                    coins.push(value);
                } else if (type === 'bill') {
                    bills.push(value);
                }
                document.getElementById("totalValue").innerHTML = "$ " + getTotal().toFixed(2);
            };
        }
        xhttp.open("GET", "http://localhost:" + port + "/Lcd?string=" + message, true);
        xhttp.send();
    }*/

    function writeOnLCD(message){
        var socket = io();
        socket.emit('message', message);
    }


    function getTotal(){
        var total = 0;
        for(var i = 0; i < coins.length; i ++){
            total += coins[i];
        }
        for(var i = 0; i < bills.length; i ++){
            total += bills[i];
        }
        return total;
    }

    function comprobate(name) {
        var FirstValue = 0;
        var state = null;
        if (name == "1dolarcent") {
            sendMoney(1, "coin");
            Efectsaudio();
        } else if (name == "50cent") {
            sendMoney(0.5, "coin");
            Efectsaudio();
        } else if (name == "25cent") {
            sendMoney(0.25, "coin");
            Efectsaudio();
        } else if (name == "10cent") {
            sendMoney(0.1, "coin");
            Efectsaudio();
        } else if (name == "5cent") {
            sendMoney(0.05, "coin");
            Efectsaudiocoin();
        } else if (name == "1cent") {
            sendMoney(0.01, "coin");
            Efectsaudio();
        } else {
            document.getElementById("moneyInserted").innerHTML = "----- Ingrese el valor en el espacio correspondiente -----";
            alert("Inserte el dato correcto");
            document.getElementById("moneyInserted").value = FirstValue;
        }
    }
//----------------------------FIN Comprobar la imagen arrastrada en dispositivo de centavos  (vertical)

//----------------------------Comprobar la imagen arrastrada en dispositivo de dolares  (horizontal)

    function comprobateDollars(name) {

        var FirstValue = document.getElementById("moneyInserted").value;

        if (name == "1dollar") {
            sendMoney(1, "bill");
            Efectsaudio();
        } else if (name == "5dollar") {
            sendMoney(5, "bill");
            Efectsaudio();
        } else {
            document.getElementById("moneyInserted").value = "No Aceptado";
            alert("Inserte el dato correcto");
            document.getElementById("moneyInserted").value = FirstValue;
        }
    }
//----------------------------FIN Comprobar la imagen arrastrada en dispositivo de dolares  (horizontal)

    function showMessage(message){
        document.getElementById("moneyInserted").innerHTML = message;
        writeOnLCD(message);
    }

//-------------------------     Mostrar producto comprado (funcion final) ---------------------------------------------------
    function BuyProductExample() {
        var nombre = document.getElementById("write").value;
        var screen = document.getElementById("moneyInserted").value;
        var xhttp = new XMLHttpRequest();
        var response = null;


        xhttp.open("GET", "http://localhost:" + port + "/State?entry=" + nombre + "&objectClass=product&total="+getTotal().toFixed(2), true);
        xhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                if (this.response.charAt(0) == 'N'){
                    showMessage(this.response);
                    setTimeout(function () {
                        cancelOperation();
                    }, 5000);
                } else if (this.response.charAt(0) == 'D'){
                    setTimeout(function () {
                        cancelOperation();
                    }, 5000);
                    showMessage(this.response);
                } else if (this.response.charAt(0) == 'm'){
                    alert(this.response);
                    showMessage('Recoja su producto');
                    var path = document.getElementById(nombre).src;
                    path = path.replace("http://localhost/view/view", ".");
                    document.getElementById("exitSnack").innerHTML = '<img id="Saled" src="' + path + '" width="50" height=80">\n\
                                                                        <br>\n\
                                                                    <input type="submit" class="btn btn-primary" name="Refresh" value="Retirar" onClick="location.reload()" style="width="100";">';
                }
            }
        };
        xhttp.send();



        //alert(path);
        //document.getElementById("moneyInserted").value =0.00;
        //document.getElementById("write").value ="";
    }

    function Efectsaudio(Path) {
        var audio = document.createElement("audio");
        audio.src = Path;
    }

    function cancelOperation(){
        var xhttp = new XMLHttpRequest();
        var returnedCoins = "Monedas: ";
        var returnedBills = "Billetes: ";
        for (var i = 0; i < coins.length; i ++){
            returnedCoins += " -> $" + coins[i];
        }
        for (var i = 0; i < bills.length; i ++){
            returnedBills += " -> $" + bills[i];
        }

        for (var i = 0; i < coins.length; i++){
            xhttp.open("GET", "http://localhost:" + port + "/State?entry=" + coins[i] + "&objectClass=returnCoin&total="+getTotal(), true);
            xhttp.send();
        }

        for (var i = 0; i < bills.length; i++){
            xhttp.open("GET", "http://localhost:" + port + "/State?entry=" + bills[i] + "&objectClass=returnBill&total="+getTotal(), true);
            xhttp.send();
        }

        if (getTotal() != 0){
            alert(returnedCoins + "\n" + returnedBills);
        }
        coins = null;
        coins = [];
        bills = [];
        document.getElementById("totalValue").innerHTML = "$ " + getTotal().toFixed(2);
        xhttp.open("GET", "http://localhost:" + port + "/State?entry=start", true);
        xhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                document.getElementById("moneyInserted").innerHTML = this.responseText;
                document.getElementById("totalValue").innerHTML = "$ 0.00";
                writeOnLCD("Total: $" + getTotal().toFixed(2));
            }
        };
        xhttp.send();
    }

//----------------------------Comprobar la imagen arrastrada en dispositivo de centavos  (vertical)


// SOCKET IO LISTENER
$(function () {
    var socket = io();
    socket.on('addMoney', function(msg){
        comprobate(msg);
    });
    socket.on('cancel', function(msg){
        cancelOperation();
    });
});