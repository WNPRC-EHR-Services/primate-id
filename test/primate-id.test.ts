import PrimateID from '../src/primate-id'
import { expect } from 'chai';

describe('Generate', () => {
  it('should contain the prefix', () => {
    const prefix: string = 'XXXX';
    const target: string = PrimateID.Generate(prefix);
    expect(target).to.contain(prefix);
  });
  it('should pad the prefix if necessary', () => {
    const shortPrefix: string = 'PRC';
    const target: string = PrimateID.Generate(shortPrefix);
    expect(target).to.contain('PRCX');
  }); 
  it('should fail on a longer prefix', () => {
    const longPrefix: string = 'WNPRC';
    expect(() => PrimateID.Generate(longPrefix)).to.throw('Invalid prefix: must be 4 or fewer characters');
  });
  it('should be 16 characters long', () => {
    const target: string = PrimateID.Generate('XXXX');
    expect(target.length).to.equal(16);
  });
  it('should be valid', () => {
    const target: string = PrimateID.Generate('XXXX');
    expect(PrimateID.IsValid(target)).to.equal(true);
  });
});

describe('IsValid', () => {
  it('should be true for a valid id', () => {
    const valid = 'PRCX5NBK87TF8PTP';
    expect(PrimateID.IsValid(valid)).to.equal(true);
  });
  it('should be false for an id of the wrong length', () => {
    const shortid = 'PRCX5NBK87TF8';
    expect(PrimateID.IsValid(shortid)).to.equal(false);
  });
  it('should be false for a transposition', () => {
    // swapped these:  ----------**----
    const transpose = 'PRCX5NBK87FT8PTP';
    expect(PrimateID.IsValid(transpose)).to.equal(false);
  });
  it('should be false for a mistyped character', () => {
    // mistyped here:  ------*---------
    const mistyped  = 'PRCX5NPK87TF8PTP';
    expect(PrimateID.IsValid(mistyped )).to.equal(false);
  });
});


