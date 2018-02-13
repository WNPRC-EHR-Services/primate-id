import * as PrimateID from '../src/primate-id';
import * as chai from 'chai';
import * as cAsP from 'chai-as-promised';

before(() => {
    chai.should();
    chai.use(cAsP);
});

{   // tests for the asynchronous version of the generator
    const Swim = new PrimateID.Async();
    describe('Generate (async)', () => {
        it('should contain the prefix', () =>
            Swim.Generate('XX').should.eventually.contain('XX'));
        it('should pad the prefix if necessary', () =>
            Swim.Generate('P').should.eventually.contain('PX'));
        it('should fail on a longer prefix', () =>
            Swim.Generate('WNPRC').should.eventually.be.rejected);
        it('should be 10 characters long', () =>
            Swim.Generate('XX').should.eventually.have.length(10));
        it('should be valid', () =>
            Swim.Generate('XX').then(result => Swim.IsValid(result).should.be.true));
    });

    describe('IsValid (async)', () => {
        it('should be true for a valid id',
            () => Swim.IsValid('WIVH03HDVC').should.be.true);
        it('should be false for an id of the wrong length',
            () => Swim.IsValid('WIVH03HC').should.be.false);
        it('should be false for a transposition',
            () => Swim.IsValid('WIVH30HDVC').should.be.false);
        it('should be false for a mistyped character',
            () => Swim.IsValid('WIVG03HDVC').should.be.false);
    });

    describe('RandomPartGenerator (async)', () => {
        it('should be override-able', () => {
            Swim.RandomPartGenerator = (() => Promise.resolve('ABCDEFG'));
            return Swim.Generate('XX').should.eventually.contain('ABCDEFG');
        });
        it('should throw an error for invalid lengths (long)', () => {
            Swim.RandomPartGenerator = () => Promise.resolve('ABCDEFGHIJKLMN');
            return Swim.Generate('XX').should.eventually.be.rejected;
        });
        it('should throw an error for invalid lengths (short)', () => {
            Swim.RandomPartGenerator = () => Promise.resolve('ABC');
            return Swim.Generate('XX').should.eventually.be.rejected;
        });
        it('should throw an error for invalid characters', () => {
            Swim.RandomPartGenerator = () => Promise.resolve('!@#$%^ ');
            return Swim.Generate('XX').should.eventually.be.rejected;
        });
    });
}

{   // tests for the synchronous version of the generator
    const Sync = new PrimateID.Sync();
    describe('Generate (sync)', () => {
        it('should contain the prefix', () =>
            Sync.Generate('XX').should.contain('XX'));
        it('should pad the prefix if necessary', () =>
            Sync.Generate('P').should.contain('PX'));
        it('should fail on a longer prefix', () =>
            (() => Sync.Generate('WNPRC')).should.throw());
        it('should be 10 characters long', () =>
            Sync.Generate('XX').should.have.length(10));
        it('should be valid', () =>
            Sync.IsValid(Sync.Generate('XX')).should.be.true);
    });

    describe('IsValid (sync)', () => {
        it('should be true for a valid id',
            () => Sync.IsValid('WIVH03HDVC').should.be.true);
        it('should be false for an id of the wrong length',
            () => Sync.IsValid('WIVH03HC').should.be.false);
        it('should be false for a transposition',
            () => Sync.IsValid('WIVH30HDVC').should.be.false);
        it('should be false for a mistyped character',
            () => Sync.IsValid('WIVG03HDVC').should.be.false);
    });

    describe('RandomPartGenerator (sync)', () => {
        it('should be override-able', () => {
            Sync.RandomPartGenerator = (() => 'ABCDEFG');
            return Sync.Generate('XX').should.contain('ABCDEFG');
        });
        it('should throw an error for invalid lengths (long)', () => {
            Sync.RandomPartGenerator = () => 'ABCDEFGHIJKLMN';
            return (() => Sync.Generate('XX')).should.throw();
        });
        it('should throw an error for invalid lengths (short)', () => {
            Sync.RandomPartGenerator = () => 'ABC';
            return (() => Sync.Generate('XX')).should.throw();
        });
        it('should throw an error for invalid characters', () => {
            Sync.RandomPartGenerator = () => '!@#$%^ ';
            return (() => Sync.Generate('XX')).should.throw();
        });
    });
}

