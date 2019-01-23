/*
 *                                      
 *   _____ _       _              ___   
 *  |   __| |_ ___| |_ ___    ___|_  |  
 *  |__   |  _| .'|  _| -_|  | . |_| |_ 
 *  |_____|_| |__,|_| |___|  |_  |_____|
 *                             |_|      
 *                         Version 0.0.1
 *  
 *  Larrea Martín <larreaamartin@gmail.com>
 *  coins
 */

class q1{

    constructor(){
        /*FILE SYSTEM UTIL*/
        this.fs = require('fs');
        /*FILE INFO*/
        this.coinWalletPath = "./model/coinWallet.json";
        this.billWalletPath = "./model/billWallet.json";
        this.stockPath = "./model/stock.json";
        this.coins = null;
        var product = null;
        var value = 0;
        /*Nodes*/
        var q0 = null;
        var q1 = null;
        var q2 = null;

        this.updateCoins();
    }

    /*----- Setters & Getters -----*/
    setQ0(q0){
        this.q0 = q0;
    }

    setQ1(q1){
        this.q1 = q1;
    }

    setQ2(q2){
        this.q2 = q2;
    }
    
    listen(entry, objectClass, total){
        if (entry == "cancel" && objectClass == 'option')
            return this.q0.getWelcomeMessage();
        else if (objectClass == 'coin' || objectClass == 'bill') {
            if (objectClass == 'coin'){
                this.addCoin(entry);
            } else if (objectClass == 'bill'){
                this.addBill(entry);
            }
            return this.getMoneyMessage(entry);
        }
        else if (objectClass == 'product')
            return this.isBuyable(entry, total);
        else if (objectClass == 'returnCoin')
            return this.returnCoin(entry);
        else if (objectClass == 'returnBill')
            return this.returnBill(entry);
    }

    /*----- Methods -----*/

    updateCoins(){
        this.coins = JSON.parse(this.fs.readFileSync(this.coinWalletPath, 'utf8'));
    }

    getMoneyMessage(entry){
        return "----- Usted ha insertado: " + entry +" -----";
    }

    getUncompleteValueMessage(){
        var Message = "---- El valor ingresado: " + this.value + " está incompleto";
        return Message;
    }

    isBuyable(productId, total){
        this.updateCoins();
        if (this.checkStock(productId)){
            if (this.checkotalValue(this.getProduct(productId), total)){
                if (this.hasChange(this.getProduct(productId).price, total)) {
                    this.fs.writeFile(this.coinWalletPath, JSON.stringify(this.coins, null, 4) , 'utf-8');
                    this.updateCoins();
                    console.log(this.hasChangeString(this.getProduct(productId).price, total, "monedas: "));
                    return this.q2.listen(productId, 'product', this.hasChangeString(this.getProduct(productId).price, total, "monedas: "));
                }else{
                    return "No hay suficiente cambio";
                }
            } else {
                return "Dinero insuficiente";
            }
        } else if (this.checkStock(productId) == false){
            return "No hay " + this.getProduct(productId).name;
        }
    }


    getProduct(productId){
        var stock =  JSON.parse(this.fs.readFileSync(this.stockPath, 'utf8'));
        var product = null;
        stock.products.forEach(function(element){
            if (element.product.id == productId) {
                product = element.product;
            }
        });
        return product;
    }

    checkStock(productId){
        var stock =  JSON.parse(this.fs.readFileSync(this.stockPath, 'utf8'));
        var hasStock = false;
        stock.products.forEach(function(element){
            if (element.product.id == productId) {
                hasStock = (element.product.quantity >= 1) ? true : false;
                return hasStock;
            }
        });
        return hasStock;
    }

    checkotalValue(product, total){
        var isEnough = (total >= product.price) ? true : false;
        return isEnough;
    }

    addCoin(value){
        var coins = JSON.parse(this.fs.readFileSync(this.coinWalletPath, 'utf8'));
        if (value == 1)
            coins.oneDollar ++;
        else if (value == 0.5)
            coins.halfDollar ++;
        else if (value == 0.25)
            coins.quarterDollar ++;
        else if (value == 0.1)
            coins.tenCents ++;
        else if (value == 0.05)
            coins.fiveCent ++;
        else if (value == 0.01)
            coins.oneCent ++;
        this.fs.writeFile(this.coinWalletPath, JSON.stringify(coins, null, 4) , 'utf-8');
    }

    addBill(value){
        var bills = JSON.parse(this.fs.readFileSync(this.billWalletPath, 'utf8'));
        if (value == 1)
            bills.oneDollar += 1;
        else if (value == 5)
            bills.fiveDollar += 1;
        this.fs.writeFile(this.billWalletPath, JSON.stringify(bills, null, 4) , 'utf-8');
    }

    returnCoin(value, type){
        var coins = JSON.parse(this.fs.readFileSync(this.coinWalletPath, 'utf8'));
        var bills = JSON.parse(this.fs.readFileSync(this.billWalletPath, 'utf8'));
        if (value == 1)
            coins.oneDollar --;
        else if (value == 0.5)
            coins.halfDollar --;
        else if (value == 0.25)
            coins.quarterDollar --;
        else if (value == 0.1)
            coins.tenCents --;
        else if (value == 0.05)
            coins.fiveCent --;
        else if (value == 0.01)
            coins.oneCent --;
        this.fs.writeFile(this.coinWalletPath, JSON.stringify(coins, null, 4) , 'utf-8');
    }

    returnBill(value){
        var bills = JSON.parse(this.fs.readFileSync(this.billWalletPath, 'utf8'));
        if (value == 1)
            bills.oneDollar --;
        else if (value == 5)
            bills.fiveDollar --;
        this.fs.writeFile(this.billWalletPath, JSON.stringify(bills, null, 4) , 'utf-8');
    }

    hasChangeString(price, total, string){
        var values = [1, 0.5, 0.25, 0.10, 0.05, 0.01];
        var toChange = (total - price).toFixed(2);
        if (toChange == 0) {
            return string;
        }
        for (var i = 0; i < values.length; i ++){
            if (toChange >= values[i] && this.hasCoin(values[i])) {
                string += " => " + values[i];
                return this.hasChangeString(values[i], toChange, string);
            }
        }
        return "no hay cambio suficiente";
    }

    hasChange(price, total, string){
        var values = [1, 0.5, 0.25, 0.10, 0.05, 0.01];
        var toChange = (total - price).toFixed(2);
        if (toChange == 0) {
            return true;
        }
        for (var i = 0; i < values.length; i ++){
            if (toChange >= values[i] && this.hasCoin(values[i])) {
                string += " => " + values[i];
                return this.hasChange(values[i], toChange, string);
            }
        }
        return false;
    }

    hasCoin(value){
        if (value == 0.01) {
            if (this.coins.oneCent > 0) {
                this.coins.oneCent --;
                return true;
            } else {
                return false;
            }
        }
        if (value == 0.05) {
            if (this.coins.fiveCent > 0) {
                this.coins.fiveCent --;
                return true;
            } else {
                return false;
            }
        }
        if (value == 0.10) {
            if (this.coins.tenCents > 0) {
                this.coins.tenCents --;
                return true;
            } else {
                return false;
            }
        }
        if (value == 0.25) {
            if (this.coins.quarterDollar > 0) {
                this.coins.quarterDollar --;
                return true;
            } else {
                return false;
            }
        }
        if (value == 0.5) {
            if (this.coins.halfDollar > 0) {
                this.coins.halfDollar --;
                return true;
            } else {
                return false;
            }
        }
        if (value == 1) {
            if (this.coins.oneDollar > 0) {
                this.coins.oneDollar --;
                return true;
            } else {
                return false;
            }
        }
    }

}

module.exports = q1;