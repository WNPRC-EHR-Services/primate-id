import PrimateID from '../src/primate-id';
import * as chai from 'chai';
import * as cAsP from 'chai-as-promised';

before(() => {
  chai.should();
  chai.use(cAsP);
});


describe('Generate', () => {
  it('should contain the prefix', () =>
    PrimateID.Generate('XX').should.eventually.contain('XX'));
  it('should pad the prefix if necessary', () =>
    PrimateID.Generate('P').should.eventually.contain('PX'));
  it('should fail on a longer prefix', () =>
    PrimateID.Generate('WNPRC').should.eventually.be.rejected);
  it('should be 10 characters long', () =>
    PrimateID.Generate('XX').should.eventually.have.length(10));
  it('should be valid', () =>
    PrimateID.Generate('XX').then(result => PrimateID.IsValid(result).should.be.true));
});

describe('IsValid', () => {
  it('should be true for a valid id',
    () => PrimateID.IsValid('WIVH03HDVC').should.be.true);
  it('should be false for an id of the wrong length',
    () => PrimateID.IsValid('WIVH03HC').should.be.false);
  it('should be false for a transposition',
    () => PrimateID.IsValid('WIVH30HDVC').should.be.false);
  it('should be false for a mistyped character',
    () => PrimateID.IsValid('WIVG03HDVC').should.be.false);
});

describe('RandomPartGenerator', () => {
  it('should be override-able', () => {
    PrimateID.RandomPartGenerator = (() => Promise.resolve('ABCDEFG'));
    return PrimateID.Generate('XX').should.eventually.contain('ABCDEFG');
  });
  it('should throw an error for invalid lengths (long)', () => {
    PrimateID.RandomPartGenerator = () => Promise.resolve('ABCDEFGHIJKLMN');
    return PrimateID.Generate('XX').should.eventually.be.rejected;
  });
  it('should throw an error for invalid lengths (short)', () => {
    PrimateID.RandomPartGenerator = () => Promise.resolve('ABC');
    return PrimateID.Generate('XX').should.eventually.be.rejected;
  });
  it('should throw an error for invalid characters', () => {
    PrimateID.RandomPartGenerator = () => Promise.resolve('!@#$%^ ');
    return PrimateID.Generate('XX').should.eventually.be.rejected;
  });
});


