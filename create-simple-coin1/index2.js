const SHA256 = require('crypto-js/sha256');

class Block {
    constructor(timestamp, data, previousHash) {
        this.timestamp = timestamp;
        this.data = data;
        this.previousHash = previousHash;
        this.hash = this.calculateHash();
    }

    calculateHash() {
        return SHA256(this.previousHash + this.timestamp + JSON.stringify(this.data)).toString();
    }
}

class Blockchain {
    constructor() {
        this.chain = [this.createGenesisBlock()];
    }

    createGenesisBlock() {
        return new Block("05/02/2019", "GenesisBlock", "0");
    }

    getLatestBlock() {
        return this.chain[this.chain.length - 1];
    }

    addBlock(newBlock) {
        newBlock.previousHash = this.getLatestBlock().hash;
        newBlock.hash = newBlock.calculateHash();
        this.chain.push(newBlock);
    }

    isChainValid() {
        for (let i = 1; i < this.chain.length; i++) {
            const currentBlock = this.chain[i];
            const previousBlock = this.chain[i - 1];

            if (currentBlock.hash !== currentBlock.calculateHash()) {
                return false;
            }

            if (currentBlock.previousHash !== previousBlock.hash) {
                return false;
            }
        }

        return true;
    }
}

let originalCoin = new Blockchain();
originalCoin.addBlock(new Block("06/02/2019", { SendCoinToA: 3 }));
originalCoin.addBlock(new Block("07/03/2019", { SendCoinToB: 8 }));

originalCoin.chain[1].data = { SendCoinToA: 200 };

//STEP2 以下の1行の記述を移動させる


console.log('ブロックの中身を書き換えた状態:' + originalCoin.isChainValid());

//STEP1 ブロックのデータを書き換えた状態で、更にハッシュ値を再計算する
originalCoin.chain[1].hash = originalCoin.chain[1].calculateHash();

//STEP2 上のSTEP2の記述(ブロックの中身の出力)をここに移動させる
console.log(JSON.stringify(originalCoin, null, 2));

//STEP3 再度ブロックチェーンの妥当性をチェックしてみる
console.log('ハッシュ値を再計算した場合:' + originalCoin.isChainValid());


