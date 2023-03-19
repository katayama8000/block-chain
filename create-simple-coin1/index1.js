// SHA256のライブラリを読み込む
const SHA256 = require('crypto-js/sha256');

// ブロックのクラスの定義
class Block {
    // コンストラクタ
    constructor(timestamp, data, previousHash) {
        this.timestamp = timestamp;         // 時刻
        this.data = data;                   // データ
        this.previousHash = previousHash;   // 前のブロックのハッシュ値
        this.hash = this.calculateHash();  // 自身のハッシュ値
    }

    // 自身のハッシュ値を計算するメソッド
    calculateHash() {
        // 前のブロックのハッシュ値、時刻、データを結合してハッシュ値を計算する
        return SHA256(this.previousHash + this.timestamp + JSON.stringify(this.data)).toString();
    }
}

// ブロックチェーンのクラスの定義
class Blockchain {
    // コンストラクタ
    constructor() {
        // 最初のブロック（ジェネシスブロック）を生成してチェーンの先頭に追加する
        this.chain = [this.createGenesisBlock()];
    }

    // ジェネシスブロックを生成するメソッド
    createGenesisBlock() {
        // 時刻、データ、前のブロックのハッシュ値を指定してブロックを生成する
        return new Block("05/02/2019", "GenesisBlock", "0");
    }

    // 最新のブロックを取得するメソッド
    getLatestBlock() {
        return this.chain[this.chain.length - 1];
    }

    // 新しいブロックを追加するメソッド
    addBlock(newBlock) {
        // 前のブロックのハッシュ値を自身のpreviousHashに設定する
        newBlock.previousHash = this.getLatestBlock().hash;
        // 自身のハッシュ値を計算して設定する
        newBlock.hash = newBlock.calculateHash();
        // チェーンに新しいブロックを追加する
        this.chain.push(newBlock);
    }

    // チェーンの妥当性をチェックするメソッド
    isChainValid() {
        for (let i = 1; i < this.chain.length; i++) {
            const currentBlock = this.chain[i];
            const previousBlock = this.chain[i - 1];

            // 自身のハッシュ値が正しいかをチェックする
            if (currentBlock.hash !== currentBlock.calculateHash()) {
                return false;
            }

            // 前のブロックのハッシュ値が正しいかをチェックする
            if (currentBlock.previousHash !== previousBlock.hash) {
                return false;
            }
        }

        // チェーンが妥当であればtrueを返す
        return true;
    }
}

// ブロックチェーンを生成する
let originalCoin = new Blockchain();

// ブロックを追加する
originalCoin.addBlock(new Block("06/02/2019", { SendCoinToA: 3 }));
originalCoin.addBlock(new Block("07/03/2019", { SendCoinToB: 8 }));

// ブロックチェーンをJSON形式で出力する
console.log(JSON.stringify(originalCoin, null, 2));

// ブロックチェーンの妥当性をチェックする（改ざんなしの状態）
console.log('改ざんなしの状態:' + originalCoin.isChainValid());