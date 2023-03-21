const SHA256 = require('crypto-js/sha256');

class Block {
    constructor(timestamp, data, previousHash) {
        this.timestamp = timestamp;
        this.data = data;
        this.previousHash = previousHash;
        this.hash = this.calculateHash();
        this.nonce = 0;
    }

    // ハッシュ値を計算するメソッド
    calculateHash() {
        return SHA256(
            this.previousHash +
            this.timestamp +
            JSON.stringify(this.data) +
            this.nonce
        ).toString();
    }

    // マイニングするメソッド
    // ハッシュ値の先頭が00でない限り、nonceをインクリメントしてハッシュ値を計算し続ける
    mineBlock() {
        while (this.hash.substring(0, 2) !== '00') {
            this.nonce++;
            this.hash = this.calculateHash();
            console.log(this.nonce, '...mining...')
        }
        console.log("ブロックがマイニングされました：" + this.hash);
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

    // ブロックを追加するメソッド
    // 
    addBlock(newBlock) {
        newBlock.mineBlock();
        this.chain.push(newBlock);
    }

    isChainVaild() {
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

console.log('ブロックの中身を書き換えた状態:' + originalCoin.isChainVaild());

originalCoin.chain[1].hash = originalCoin.chain[1].calculateHash();

console.log(JSON.stringify(originalCoin, null, 2));
console.log('ハッシュ値を再計算した場合:' + originalCoin.isChainVaild());

