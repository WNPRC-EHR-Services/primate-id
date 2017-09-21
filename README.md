# PrimateID

This Typescript library provides a reference implementation for generating and validating random-yet-prefixed "universal" ids for animals housed at various primate research facilities around the country.

### Specification

The current form is defined as follows:
```ABNF
primate-id    = prefix-part random-part check-digit

prefix-part   = 4UPALPHA
random-part   = 11(DIGIT | "A" | "B" | "C" | "D" | "E" | "F" | "G" | "H" | "J" | "K" | "M" 
                         | "N" | "P" | "Q" | "R" | "T" | "U" | "V" | "W" | "X" | "Y" | "Z")
check-digit   = 1(DIGIT | UPALPHA)
```

The current implementation uses the [Luhn mod N](https://en.wikipedia.org/wiki/Luhn_mod_N_algorithm) algorithm to generate the check digit with respect to the other fifteen characters of the PrimateID.

### For Developers

To build, execute, and test the package, use the `npm` scripts defined in `package.json`:

```sh
# to install the dependencies
npm install

# to compile the TypeScript
npm run build

# to print a 'WPRC' id to the console
npm run generate

# to run the tests in the ./test folder
npm test
```
