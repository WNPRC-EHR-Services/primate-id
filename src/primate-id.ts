import luhnN  = require('luhn-mod-n')

export class PrimateID {

  // characters used in the Base32-encoded random section of the id
  private static BASE32 = '0123456789ABCDEFGHJKMNPQRTUVWXYZ';

  // length of the entire id string (in characters)
  private static FULLID_LENGTH = 16;

  // allowed length of the user-defined prefix portion of the id. this should always
  // be at least one less than the full id length (for the check digit)
  private static PREFIX_LENGTH = 4;

  // padding character used for prefixes that are too short
  private static PREFIX_PADDER = 'X';

  // length of the random character section of the id (computed by substracting
  // the length of the prefix and the check digit from the total)
  private static RANDOM_LENGTH = PrimateID.FULLID_LENGTH - (PrimateID.PREFIX_LENGTH + 1);

  // valid characters for the primate id, used to compute the check digit
  private static VALUES = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  
  /**
   * Generates a new PrimateID with the passed prefix. If the prefix
   * is shorter than expected, it will be right-padded to the correct
   * length.
   *
   * @param {string} prefix - Prefix to prepend on the id
   * @returns {string} Newly-generated PrimateID value
   * @throws {Error} Will throw if the passed prefix is too long.
   */
  public Generate(prefix: string): string {
    if (prefix.length > PrimateID.PREFIX_LENGTH) {
      throw new Error(`Invalid prefix: must be ${PrimateID.PREFIX_LENGTH} or fewer characters`);
    }
    let padded = prefix;
    if (prefix.length < PrimateID.PREFIX_LENGTH) {
      padded = PrimateID.Pad(prefix, PrimateID.PREFIX_LENGTH, PrimateID.PREFIX_PADDER);
    }
    const rand: string = Array.apply(null, Array(PrimateID.RANDOM_LENGTH))
                              .map(() => PrimateID.BASE32.charAt(Math.floor(Math.random() * PrimateID.BASE32.length)))
                              .join('');

    const code: string = padded + rand;
    return code + luhnN.generateCheckCharacter(code, PrimateID.VALUES);
  }
 
  /**
   * Validates the passed PrimateID value based on its length and check digit.
   *
   * @param {string} id - PrimateID to validate
   * @returns {boolean} True if valid, false otherwise
   */
  public IsValid(id: string): boolean {
    return (id.length == PrimateID.FULLID_LENGTH) && luhnN.isValid(id.toUpperCase(), PrimateID.VALUES);
  }

  // right-pads the passed string to the passed length using the passed character
  private static Pad(prefix: string, targetLength: number, paddingChar: string): string {
    let result: string = prefix;
    while (result.length < targetLength) {
      result += paddingChar;
    }
    return result;
  }

}

export default new PrimateID();
