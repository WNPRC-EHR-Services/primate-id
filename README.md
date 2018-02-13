[![npm version](https://badge.fury.io/js/%40wnprc%2Fprimate-id.svg)](https://badge.fury.io/js/%40wnprc%2Fprimate-id)

# PrimateID

This Typescript library provides a reference implementation for generating and validating random-yet-prefixed "universal" ids for animals housed at various primate research facilities around the country.

### Specification

The current form is defined as follows:
```ABNF
primate-id    = prefix-part random-part check-digit

prefix-part   = 2UPALPHA
random-part   = 7(DIGIT | "A" | "B" | "C" | "D" | "E" | "F" | "G" | "H" | "J" | "K" | "M" 
                        | "N" | "P" | "Q" | "R" | "T" | "U" | "V" | "W" | "X" | "Y" | "Z")
check-digit   = 1(DIGIT | UPALPHA)
```

The current implementation uses the [Luhn mod N](https://en.wikipedia.org/wiki/Luhn_mod_N_algorithm) algorithm to generate the check digit with respect to the other nine characters of the PrimateID.

### For Users

There are two implementations included in this library--a synchronous implementation and an asynchronous, Promise-based implementation. To use each one, import the corresponding class from the library as shown in the following example:
```TypeScript
import * as PrimateID from '@wnprc/primate-id';

// using the asynchronous version (Generate returns a Promise<string>)
const async = new PrimateID.Async();
async.Generate('XX').then(x => console.log(x));

// using the synchronous version (Generate returns a string)
const sync = new PrimateID.Sync();
console.log(sync.Generate('XX'));
```

### For Developers

To build, execute, and test the package, use the `npm` scripts defined in `package.json`:

```sh
# to install the dependencies
npm install

# to compile the TypeScript
npm run build

# to print an 'XX' id to the console
npm run generate

# to run the tests in the ./test folder
npm test
```
