/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
// Comprueba Navegador y Plataforma del pc

var clientPC = navigator.userAgent.toLowerCase(); // Coge info cliente
var clientVer = parseInt(navigator.appVersion); // Coge versión navegador
 
var is_ie = ((clientPC.indexOf("msie") != -1) && (clientPC.indexOf("opera") == -1));
var is_nav = ((clientPC.indexOf('mozilla')!=-1) && (clientPC.indexOf('spoofer')==-1)
                && (clientPC.indexOf('compatible') == -1) && (clientPC.indexOf('opera')==-1)
                && (clientPC.indexOf('webtv')==-1) && (clientPC.indexOf('hotjava')==-1));
var is_moz = 0;
 
var is_win = ((clientPC.indexOf("win")!=-1) || (clientPC.indexOf("16bit") != -1));
var is_mac = (clientPC.indexOf("mac")!=-1);
 
function imprm(bot) {
var txtarea = document.getElementById('write');
var tecla = new Array('1','2','3','4','5','6','7','8','9','0','q','w','e','r','t','y','u','i','o','p','a','s','d','f','g','h','j','k','l','ñ','z','x','c','v','b','n','m',',','.','-','\n',' ','              ');
txtarea.value+=tecla[bot];
txtarea.focus();
return;
}
 
function imprM(bot) {
var txtarea = document.getElementById('write');
var teclaM = new Array('!','"','·','%','/','(',')','=','?','¿','Q','W','E','R','T','Y','U','I','O','P','A','S','D','F','G','H','J','K','L','Ñ','Z','X','C','V','B','N','M',';',':','_','\n',' ','              ');
txtarea.value+=teclaM[bot];
txtarea.focus();
return;
}
 
 
var capa1
var capa2
var ns4 = (document.layers)? true:false
var ie4 = (document.all)? true:false
var ns6 = (document.getElementById)? true:false
 
function teclado() {
   if (ns4) {
     capa1 = document.c1
     capa2 = document.c2
  }
 if (ie4) {
   capa1 = c1.style
   capa2 = c2.style
 }
 if (ns6) {
   capa1 = document.getElementById('c1').style
   capa2 = document.getElementById('c2').style
 }
}
 
function muestra(obj) {
if (ns4) obj.visibility = "show"
else if (ie4) obj.visibility = "visible"
else if (ns6) obj.visibility = "visible"
}
function oculta(obj) {
if (ns4) obj.visibility = "hide"
else if (ie4) obj.visibility = "hidden"
else if (ns6) obj.visibility = "hidden"
}
 
 
function borrar() {
var txtarea = document.getElementById('write');
if ((clientVer >= 4) && is_ie && is_win) {
var txtSeleccion = document.selection.createRange().text;
 
    if (document.selection) {
 
        if (!txtSeleccion) {
        txtarea.focus();
        var Sel = document.selection.createRange();
        Sel.moveStart ('character', -txtarea.value.length);
        curPos = Sel.text.length;
        txtarea.value=txtarea.value.substr(0,txtarea.value.length-1);
        alert("posicion1: "+curPos);
        return(curPos);
        }
 
        txtarea.focus();
        var Sel = document.selection.createRange();
        document.selection.createRange().text = "";
        Sel.moveStart ('character', -txtarea.value.length);
        curPos = Sel.text.length;
        alert("posicion2: "+curPos);
        return(curPos);
    }
}
 
 
 
 
 
 
else if (txtarea.selectionEnd && (txtarea.selectionEnd - txtarea.selectionStart > 0))
 
    {
 
    var selLargo = txtarea.textLength;
    var selEmpz = txtarea.selectionStart;
    var selFin = txtarea.selectionEnd;
    var s1 = (txtarea.value).substring(0,selEmpz);
    var s2 = (txtarea.value).substring(selFin, selLargo);
    txtarea.value =  s1 +  s2;
    alert("posicion3: "+selEmpz);
    return(selEmpz);    
 
}
else
{
 
    var selLargo = txtarea.textLength;
    txtarea.value = txtarea.value.substr(0,txtarea.value.length-1);
    var Cursor = txtarea.textLength;
    return(Cursor); 
 
}
    almznaCursor(txtarea);
}
 
function almznaCursor(textEl) {
    if (textEl.createTextRange) textEl.caretPos = document.selection.createRange().duplicate();
}
 
 
function PosicionCursor(pos) {
var txtarea = document.getElementById('ta');
 
    //Firefox
    if (txtarea .setSelectionRange) {
        txtarea .focus();
        txtarea .setSelectionRange(pos,pos);
    }
    else if (txtarea .createTextRange) {
        var rango = txtarea .createTextRange();
        rango.collapse(true);
        rango.moveEnd('character', pos);
        rango.moveStart('character', pos);
        rango.select();
    }
}
 
function EliminarCaracter()
{
    PosicionCursor(borrar());
}
 


