/*
 *                                    
 *   _____ _       _              ___ 
 *  |   __| |_ ___| |_ ___    ___|   |
 *  |__   |  _| .'|  _| -_|  | . | | |
 *  |_____|_| |__,|_| |___|  |_  |___|
 *                             |_|    
 *                       Version 0.0.1
 *  
 *  Larrea Martín <larreaamartin@gmail.com>
 *  
 */

class q0{
    
    constructor(){
        /*FILE SYSTEM UTIL*/
        this.fs = require('fs');
        /*FILE INFO*/ 
        this.coinWalletPath = "./model/coinWallet.json";
        this.billWalletPath = "./model/billWallet.json";
        /*Nodes*/
        this.q1 = null;
    }

    /*----- Listeners -----*/
    listen(entry, objectClass, total){
        if (entry == '')
            return this.getWrongEntryMessage();
        if (entry === 'start')
            return this.getWelcomeMessage();
        else if (objectClass == 'product' && total == 0)
            return this.getWrongEntryMessage();
        else if (objectClass == 'product' && total != 0)
            return this.q1.listen(entry, objectClass, total);
        else if (!isNaN(entry)  && objectClass == 'coin' || !isNaN(entry)  &&  objectClass == 'bill')
            return this.q1.listen(entry, objectClass);
        else if (objectClass == 'returnCoin' || objectClass == 'returnBill' && total != 0)
            return this.q1.listen(entry, objectClass);
    }

    /*----- Setters & Getters -----*/
    setQ1(q1){
        this.q1 = q1;
    }

    /*----- Methods -----*/
    getWelcomeMessage(){
        var dt = new Date();
        var date = dt.getFullYear() + '/' + (((dt.getMonth() + 1) < 10) ? '0' : '') + (dt.getMonth() + 1) + '/' + ((dt.getDate() < 10) ? '0' : '') + dt.getDate();
        var Message =  date + " Bienvenido, escoja un producto";
        return Message;
    }

    getWrongEntryMessage(){
        return "Primero debe ingresar un valor";
    }

    checkStock(productId){
        var stock =  JSON.parse(this.fs.readFileSync(stockPath, 'utf8'));
        var hasStock = false;
        stock.products.forEach(function(element){
            if (element.product.id == productId) {
                hasStock = (element.product.quantity >= 1) ? true : false;
                return hasStock;
            }
        });
        return hasStock;
    }

    checkWallet(){
        var coins = JSON.parse(this.fs.readFileSync(this.coinWalletPath, 'utf8'));
        var total = (coins.oneCent/100) + (coins.tenCents/10) + (coins.quarterDollar/4) + (coins.halfDollar/2) + coins.oneDollar;
        var hasChange = (total >= 0.25) ? true : false;
        return hasChange;
    }

    move(){
        return this.q1;
    }
}

module.exports = q0;