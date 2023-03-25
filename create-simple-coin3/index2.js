// SHA-256ハッシュ関数を使用するためのモジュールをインポート
const SHA256 = require('crypto-js/sha256');

// トランザクションを表すクラス
// 仮想通貨の取引データのことを、 トランザクションと呼ぶ
class Transaction {
    constructor(senderAddress, recipientAddress, amount) {
        this.senderAddress = senderAddress; // コインを送金する人
        this.recipientAddress = recipientAddress; // コインを受け取る人
        this.amount = amount; // 送金するコインの量
    }
}

// ブロックを表すクラス
class Block {
    constructor(timestamp, transactions, previousHash) {
        this.timestamp = timestamp;             // このブロックが作成された日時
        this.transactions = transactions;       // このブロックに含まれるトランザクション
        this.previousHash = previousHash;       // 一つ前のブロックのハッシュ値
        this.hash = this.calculateHash();       // このブロックのハッシュ値
        this.nonce = 0;                         // ハッシュ値を計算するためのnonce
    }

    // このブロックのハッシュ値を計算する関数
    calculateHash() {
        return SHA256(
            this.previousHash +
            this.timestamp +
            JSON.stringify(this.transactions) +
            this.nonce
        ).toString();
    }

    // ブロックをマイニングする関数
    mineBlock() {
        while (this.hash.substring(0, 2) !== '00') {
            this.nonce++;
            this.hash = this.calculateHash();
        }
        console.log("ブロックがマイニングされました：" + this.hash);
    }
}

// ブロックチェーンを表すクラス
class Blockchain {
    constructor() {
        this.chain = [this.createGenesisBlock()];    // ブロックチェーンの最初のブロック（ジェネシスブロック）
        this.pendingTransactions = [];              // 処理中のトランザクションの配列
        this.miningReward = 12.5;                   // ブロックをマイニングした場合に与えられる報酬
    }

    // ブロックチェーンの最初のブロック（ジェネシスブロック）を作成する関数
    createGenesisBlock() {
        return new Block("05/02/2019", [], "0");
    }

    // 最新のブロックを取得する関数
    getLatestBlock() {
        return this.chain[this.chain.length - 1];
    }

    // 処理中のトランザクションを含む新しいブロックをマイニングする関数
    minePendingTransactions(miningRewardAddress) {
        let block = new Block(Date.now(), this.pendingTransactions, this.getLatestBlock().hash);
        block.mineBlock();

        console.log('ブロックが正常にマイニングされました');
        this.chain.push(block);

        this.pendingTransactions = [
            new Transaction(null, miningRewardAddress, this.miningReward)
        ];
    }

    // 作成されたトランザクションを、未承認トランザクションの配列に格納する
    createTransaction(transaction) {
        this.pendingTransactions.push(transaction);
    }

    getBalanceOfAddress(address) {
        let balance = 0;

        for (const block of this.chain) {
            for (const trans of block.transactions) {
                console.log(block)
                if (trans.senderAddress === address) {
                    balance -= trans.amount;
                }
                if (trans.recipientAddress === address) {
                    balance += trans.amount;
                }
            }
        }
        return balance;
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

originalCoin.createTransaction(new Transaction(null, 'your-address', 12.5));
originalCoin.createTransaction(new Transaction('address1', 'your-address', 10));
originalCoin.createTransaction(new Transaction('your-address', 'address2', 2));

// 未承認のトランザクション
console.log('\n 未承認のトランザクション', originalCoin.pendingTransactions);

console.log('\n マイニングを開始');
originalCoin.minePendingTransactions('your-address');

console.log('\n あなたのアドレスの残高は', originalCoin.getBalanceOfAddress('your-address'));

//STEP1　再度マイニングを実行
console.log('\n マイニングを再度実行');
originalCoin.minePendingTransactions('your-address');

//STEP2　残高計算の記述
console.log('\n あなたのアドレスの残高は', originalCoin.getBalanceOfAddress('your-address'));

