class q2{

    constructor(){
        /*FILE SYSTEM UTIL*/
        this.fs = require('fs');
        /*FILE INFO*/
        this.coinWalletPath = "./model/coinWallet.json";
        this.billWalletPath = "./model/billWallet.json";
        this.stockPath = "./model/stock.json";
    }

    listen(entry, objectClass, total){
        if (objectClass == "product"){
            this.subStore(entry);
            return total;
        }
    }

    subStore(productId){
        var stock =  JSON.parse(this.fs.readFileSync(this.stockPath, 'utf8'));
        var hasStock = false;
        stock.products.forEach(function(element){
            if (element.product.id == productId) {
                element.product.quantity --;
            }
        });
        this.fs.writeFile(this.stockPath, JSON.stringify(stock, null, 4) , 'utf-8');
    }


}

module.exports = q2;