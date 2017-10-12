import PrimateID from '../src/primate-id'
import { expect } from 'chai';

describe('Generate', () => {
  it('should contain the prefix', () => {
    const prefix: string = 'XX';
    const target: string = PrimateID.Generate(prefix);
    expect(target).to.contain(prefix);
  });
  it('should pad the prefix if necessary', () => {
    const shortPrefix: string = 'P';
    const target: string = PrimateID.Generate(shortPrefix);
    expect(target).to.contain('PX');
  }); 
  it('should fail on a longer prefix', () => {
    const longPrefix: string = 'WNPRC';
    expect(() => PrimateID.Generate(longPrefix)).to.throw('Invalid prefix: must be 2 or fewer characters');
  });
  it('should be 16 characters long', () => {
    const target: string = PrimateID.Generate('XX');
    expect(target.length).to.equal(10);
  });
  it('should be valid', () => {
    const target: string = PrimateID.Generate('XX');
    expect(PrimateID.IsValid(target)).to.equal(true);
  });
});

describe('IsValid', () => {
  it('should be true for a valid id', () => {
    const valid = 'WIVH03HDVC';
    expect(PrimateID.IsValid(valid)).to.equal(true);
  });
  it('should be false for an id of the wrong length', () => {
    const shortid = 'WIVH03HC';
    expect(PrimateID.IsValid(shortid)).to.equal(false);
  });
  it('should be false for a transposition', () => {
    // swapped these:  ----**----
    const transpose = 'WIVH30HDVC';
    expect(PrimateID.IsValid(transpose)).to.equal(false);
  });
  it('should be false for a mistyped character', () => {
    // mistyped here:  ---*------
    const mistyped  = 'WIVG03HDVC';
    expect(PrimateID.IsValid(mistyped )).to.equal(false);
  });
});

describe('RandomPartGenerator', () => {
  it('should be override-able', () => {
    const idpart = 'ABCDEFG';
    PrimateID.RandomPartGenerator = () => idpart;
    const target = PrimateID.Generate('XX');
    expect(target).to.contain(idpart);
  });
})


