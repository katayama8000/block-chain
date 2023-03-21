import SHA256 from 'crypto-js/sha256';

class Block {
  public timestamp: Date;
  public data: any;
  public previousHash: string;
  public hash: string;
  public nonce: number;

  constructor(timestamp: Date, data: any, previousHash: string) {
    this.timestamp = timestamp;
    this.data = data;
    this.previousHash = previousHash;
    this.hash = this.calculateHash();
    this.nonce = 0;
  }

  calculateHash(): string {
    return SHA256(
      this.previousHash +
        this.timestamp +
        JSON.stringify(this.data) +
        this.nonce
    ).toString();
  }

  mineBlock(): void {
    while (this.hash.substring(0, 2) !== '00') {
      this.nonce++;
      this.hash = this.calculateHash();
      console.log(this.hash);
    }
    console.log('ブロックがマイニングされました：' + this.hash);
  }
}

class Blockchain {
  public chain: Block[];

  constructor() {
    this.chain = [this.createGenesisBlock()];
  }

  createGenesisBlock(): Block {
    return new Block(new Date('05/02/2019'), 'GenesisBlock', '0');
  }

  getLatestBlock(): Block {
    return this.chain[this.chain.length - 1];
  }

  addBlock(newBlock: Block): void {
    console.log(`${this.chain.length}番目のブロックをマイニング....`);
    newBlock.mineBlock();
    this.chain.push(newBlock);
  }

  isChainVaild(): boolean {
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

originalCoin.addBlock(
  new Block(new Date('06/02/2019'), { SendCoinToA: 3 }, '')
);
originalCoin.addBlock(
  new Block(new Date('07/03/2019'), { SendCoinToB: 8 }, '')
);

console.log(JSON.stringify(originalCoin, null, 2));
