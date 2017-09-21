import PrimateID from '../src/primate-id'
import { expect } from 'chai';

const pid: PrimateID = new PrimateID();

describe('Generate', () => {
  it('should contain the prefix', () => {
    const prefix: string = 'XXXX';
    const target: string = pid.Generate(prefix);
    expect(target).to.contain(prefix);
  });
  it('should pad the prefix if necessary', () => {
    const shortPrefix: string = 'PRC';
    const target: string = pid.Generate(shortPrefix);
    expect(target).to.contain('PRCX');
  }); 
  it('should fail on a longer prefix', () => {
    const longPrefix: string = 'WNPRC';
    expect(() => pid.Generate(longPrefix)).to.throw('Invalid prefix: must be 4 or fewer characters');
  });
  it('should be 16 characters long', () => {
    const target: string = pid.Generate('XXXX');
    expect(target.length).to.equal(16);
  });
  it('should be valid', () => {
    const target: string = pid.Generate('XXXX');
    expect(pid.IsValid(target)).to.equal(true);
  });
});

describe('IsValid', () => {
  it('should be true for a valid id', () => {
    const valid = 'PRCX5NBK87TF8PTP';
    expect(pid.IsValid(valid)).to.equal(true);
  });
  it('should be false for an id of the wrong length', () => {
    const shortid = 'PRCX5NBK87TF8';
    expect(pid.IsValid(shortid)).to.equal(false);
  });
  it('should be false for a transposition', () => {
    // swapped these:  ----------**----
    const transpose = 'PRCX5NBK87FT8PTP';
    expect(pid.IsValid(transpose)).to.equal(false);
  });
  it('should be false for a mistyped character', () => {
    // mistyped here:  ------*---------
    const mistyped  = 'PRCX5NPK87TF8PTP';
    expect(pid.IsValid(mistyped )).to.equal(false);
  });
});


