import IEquatable from "./IEquatable.js";
import IObject from "./IObject.js";
import crypto from "crypto";
import { EmptyGuidString, GuidWrapperCharacters } from "../constants.js";
import { isValidGuidString } from "../string-formats.js";
import { getHashCodeForString } from "../utils.js";

/**
 * The purpose for this class is to just have a container that represents a GUID.
 * https://learn.microsoft.com/en-us/dotnet/api/system.guid
 * https://developer.mozilla.org/en-US/docs/Web/API/Crypto/randomUUID
 * @class Guid
 */
export default class Guid implements IObject<Guid>, IEquatable<Guid> {
  private _value: string = EmptyGuidString;

  /**
   * Converts a guid that is formatted as a string into a Guid object container.
   * Undefined or null is assumed to be an Empty guid.
   * Formatting must be in the globally recognized 8/4/4/4/12 hex digit format: 00000000-0000-0000-0000-000000000000.
   * Wrappers can be curly braces, parenthesis, or no wrappers at all.
   * The alphanumerics (hex) is made lowercase for the sake of comparison and equality.
   * @param guidString guid formatted as a string.
   * @returns
   */
  constructor(guidString: string | undefined | null) {
    if (guidString === undefined || guidString === null) return;

    //Stripping out wrapper characters if they exist such as {, }, -, etc.
    GuidWrapperCharacters.forEach((char) => {
      guidString = guidString!.replace(char, "");
    });

    //Doing a loose check on the string to see if it is a valid guid format, but not enforcing version
    if (!isValidGuidString(guidString))
      throw new Error(
        "String must be in the globally recognized 8/4/4/4/12 hex digit format: 00000000-0000-0000-0000-000000000000."
      );

    this._value = guidString.toLowerCase();
  }

  /**
   * Generates a new GUID using `crypto.randomUUID()`. This method is only available in Node.js v14.17.0 or later.
   * https://nodejs.org/api/crypto.html#cryptorandomuuidoptions
   * @returns A new randomized Guid object.
   */
  public static newGuid(): Guid {
    //https://stackoverflow.com/questions/105034/how-to-create-a-guid-uu

    //https://developer.mozilla.org/en-US/docs/Web/API/Crypto/randomUUID
    //self.crypto.randomUUID() -- Secure context: This feature is available only in secure contexts (HTTPS), in some or all supporting browsers.

    //https://nodejs.org/api/crypto.html#cryptorandomuuidoptions only available in Node.js v14.17.0 or later
    //crypto.randomUUID()
    return new Guid(crypto.randomUUID());
  }

  /**
   * Gets an all zero GUID: 00000000-0000-0000-0000-000000000000
   */
  public static get empty() {
    return new Guid(EmptyGuidString);
  }

  /**
   * Compare equality of two guids by their lowercase string values.
   * @param other the other Guid to compare with.
   * @returns true if equal, false if different.
   */
  public equals(other: Guid): boolean {
    return this._value === other.toString();
  }

  /**
   * Returns the hash of the string value of the Guid.
   * @returns hash code of the string value of the Guid.
   */
  public getHashCode(): number {
    //This is not even remotely close to what a Guid hash is supposed to do - keeping it for now.
    //I think it's fair to say that this string hash is still very unique
    //https://github.com/dyslexicanaboko/FJS/issues/20
    return getHashCodeForString(this._value);
  }

  /**
   * Returns the string representation of the Guid with no wrappers in all lowercase.
   * @returns Guid as a string.
   */
  public toString(): string {
    return this._value;
  }

  //TODO: Should there be a compare function? Guid comparison and sorting is actually not easy to do.
  //https://github.com/dyslexicanaboko/FJS/issues/20
}
