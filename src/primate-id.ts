import luhnN = require('luhn-mod-n');

/**
 * Helper class used to generate and validate default PrimateIds.
 */
class DefaultPrimateId {

    /**
     * Characters used in the Base32-encoded random section of the id
     * @type {string}
     */
    static BASE32 = '0123456789ABCDEFGHJKMNPQRTUVWXYZ';

    /**
     * Length of the entire id string (in characters)
     * @type {number}
     */
    static FULLID_LENGTH = 10;

    /**
     * Allowed length of the user-defined prefix portion of the id. this should always
     * be at least one less than the full id length (for the check digit).
     * @type {number}
     */
    static PREFIX_LENGTH = 2;

    /**
     * Padding character used for prefixes that are too short
     * @type {string}
     */
    static PREFIX_PADDER = 'X';

    /**
     * Length of the random character section of the id (computed by subtracting
     * the length of the prefix and the check digit from the total).
     * @type {number}
     */
    static RANDOM_LENGTH = DefaultPrimateId.FULLID_LENGTH - (DefaultPrimateId.PREFIX_LENGTH + 1);

    /**
     * Valid characters for the primate id, used to compute the check digit.
     * @type {string}
     */
    static VALUES = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';

    //
    /**
     * Validation regex for the random part.
     * @type {RegExp}
     */
    static RANDOM_PART_VALIDATOR = new RegExp(`^[${DefaultPrimateId.VALUES}]+$`);

    /**
     * Validates the passed DefaultPrimateId value based on its length and check digit.
     *
     * @param {string} id - DefaultPrimateId to validate
     * @returns {boolean} True if valid, false otherwise
     */
    static IsValid(id: string): boolean {
        return (id.length == DefaultPrimateId.FULLID_LENGTH) && luhnN.isValid(id.toUpperCase(), DefaultPrimateId.VALUES);
    }

    /**
     * Returns the default, 7-random-character random part.
     *
     * @returns {string} Random, 7-character id part
     */
    static GenerateRandomPart(): string {
        return Array.apply(null, Array(DefaultPrimateId.RANDOM_LENGTH))
            .map(() => DefaultPrimateId.BASE32.charAt(Math.floor(Math.random() * DefaultPrimateId.BASE32.length)))
            .join('');
    }

    //
    /**
     * Right-pads the passed string to the passed length using the passed character.
     *
     * @param {string} prefix - Prefix string to pad
     * @param {number} targetLength - Length to which to pad
     * @param {string} paddingChar - Character to use when padding
     * @returns {string} - Padded string including the prefix on the left
     */
    static Pad(prefix: string, targetLength: number, paddingChar: string): string {
        let result: string = prefix;
        while (result.length < targetLength) {
            result += paddingChar;
        }
        return result;
    }

}

export class Async {

    // callback function to implement the strategy pattern for generating the ids
    private randomPartGenerator: (() => Promise<string>) | null = null;

    /**
     * Overrides the default, random character generator for generating ids.
     *
     * @param {() => string} val - New function to execute when generating ids (or null to restore the default)
     */
    public set RandomPartGenerator(val: (() => Promise<string>) | null) {
        this.randomPartGenerator = val;
    }

    /**
     * Generates a new DefaultPrimateId with the passed prefix. If the prefix
     * is shorter than expected, it will be right-padded to the correct
     * length.
     *
     * @param {string} prefix - Prefix to prepend on the id
     * @returns {string} Newly-generated DefaultPrimateId value
     * @throws {Error} Will throw if the passed prefix is too long or if the random part generator is invalid.
     */
    public async Generate(prefix: string): Promise<string> {
        if (prefix.length > DefaultPrimateId.PREFIX_LENGTH) {
            throw new Error(`Invalid prefix: must be ${DefaultPrimateId.PREFIX_LENGTH} or fewer characters`);
        }
        let padded = prefix;
        if (prefix.length < DefaultPrimateId.PREFIX_LENGTH) {
            padded = DefaultPrimateId.Pad(prefix, DefaultPrimateId.PREFIX_LENGTH, DefaultPrimateId.PREFIX_PADDER);
        }
        const code: string = padded + await this.GenerateRandomPart();
        return code + luhnN.generateCheckCharacter(code, DefaultPrimateId.VALUES);
    }

    // noinspection JSMethodCanBeStatic
    /**
     * Validates the passed DefaultPrimateId value based on its length and check digit.
     *
     * @param {string} id - DefaultPrimateId to validate
     * @returns {boolean} True if valid, false otherwise
     */
    public IsValid(id: string): boolean {
        return DefaultPrimateId.IsValid(id);
    }

    // generates the random part of the id. will use the default 7-random-character method if none is
    // provided to the instance
    private async GenerateRandomPart(): Promise<string> {
        if (this.randomPartGenerator == null) {
            return DefaultPrimateId.GenerateRandomPart();
        } else {
            const part: string = await this.randomPartGenerator();
            if (part.length != DefaultPrimateId.RANDOM_LENGTH) {
                throw new Error(`Invalid random part: must be ${DefaultPrimateId.RANDOM_LENGTH} characters`);
            }
            if (!DefaultPrimateId.RANDOM_PART_VALIDATOR.test(part)) {
                throw new Error(`Invalid random part: contains invalid characters (alphanumeric only)`);
            }
            return part;
        }
    }

}

export class Sync {

    // callback function to implement the strategy pattern for generating the ids
    private randomPartGenerator: (() => string) | null = null;

    /**
     * Overrides the default, random character generator for generating ids.
     *
     * @param {() => string} val - New function to execute when generating ids (or null to restore the default)
     */
    public set RandomPartGenerator(val: (() => string) | null) {
        this.randomPartGenerator = val;
    }

    /**
     * Generates a new DefaultPrimateId with the passed prefix. If the prefix
     * is shorter than expected, it will be right-padded to the correct
     * length.
     *
     * @param {string} prefix - Prefix to prepend on the id
     * @returns {string} Newly-generated DefaultPrimateId value
     * @throws {Error} Will throw if the passed prefix is too long or if the random part generator is invalid.
     */
    public Generate(prefix: string): string {
        if (prefix.length > DefaultPrimateId.PREFIX_LENGTH) {
            throw new Error(`Invalid prefix: must be ${DefaultPrimateId.PREFIX_LENGTH} or fewer characters`);
        }
        let padded = prefix;
        if (prefix.length < DefaultPrimateId.PREFIX_LENGTH) {
            padded = DefaultPrimateId.Pad(prefix, DefaultPrimateId.PREFIX_LENGTH, DefaultPrimateId.PREFIX_PADDER);
        }
        const code: string = padded + this.GenerateRandomPart();
        return code + luhnN.generateCheckCharacter(code, DefaultPrimateId.VALUES);
    }

    // noinspection JSMethodCanBeStatic
    /**
     * Validates the passed DefaultPrimateId value based on its length and check digit.
     *
     * @param {string} id - DefaultPrimateId to validate
     * @returns {boolean} True if valid, false otherwise
     */
    public IsValid(id: string): boolean {
        return DefaultPrimateId.IsValid(id);
    }

    // generates the random part of the id. will use the default 7-random-character method if none is
    // provided to the instance
    private GenerateRandomPart(): string {
        if (this.randomPartGenerator == null) {
            return DefaultPrimateId.GenerateRandomPart();
        } else {
            const part: string = this.randomPartGenerator();
            if (part.length != DefaultPrimateId.RANDOM_LENGTH) {
                throw new Error(`Invalid random part: must be ${DefaultPrimateId.RANDOM_LENGTH} characters`);
            }
            if (!DefaultPrimateId.RANDOM_PART_VALIDATOR.test(part)) {
                throw new Error(`Invalid random part: contains invalid characters (alphanumeric only)`);
            }
            return part;
        }
    }
}

