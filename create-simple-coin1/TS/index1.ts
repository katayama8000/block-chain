import SHA256 from 'crypto-js/sha256';

class Block {
  timestamp: string;
  data: any;
  previousHash: string;
  hash: string;

  constructor(timestamp: string, data: any, previousHash: string = '') {
    this.timestamp = timestamp;
    this.data = data;
    this.previousHash = previousHash;
    this.hash = this.calculateHash();
  }

  calculateHash(): string {
    return SHA256(
      this.previousHash + this.timestamp + JSON.stringify(this.data)
    ).toString();
  }
}

class Blockchain {
  chain: Block[];

  constructor() {
    this.chain = [this.createGenesisBlock()];
  }

  createGenesisBlock(): Block {
    return new Block('05/02/2019', 'GenesisBlock', '0');
  }

  getLatestBlock(): Block {
    return this.chain[this.chain.length - 1];
  }

  addBlock(newBlock: Block): void {
    newBlock.previousHash = this.getLatestBlock().hash;
    newBlock.hash = newBlock.calculateHash();
    this.chain.push(newBlock);
  }

  isChainValid(): boolean {
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

originalCoin.addBlock(new Block('06/02/2019', { SendCoinToA: 3 }));
originalCoin.addBlock(new Block('07/03/2019', { SendCoinToB: 8 }));

console.log(JSON.stringify(originalCoin, null, 2));

console.log('改ざんなしの状態:' + originalCoin.isChainValid());
