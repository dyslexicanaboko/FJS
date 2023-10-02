import IEquatable from "./IEquatable.js";
import IObject from "./IObject.js";
import crypto from "crypto";
import { EmptyGuidString, GuidWrapperCharacters } from "../constants.js";
import { isValidGuidString } from "../string-formats.js";
import { getHashCodeForString } from "../utils.js";

//https://learn.microsoft.com/en-us/dotnet/api/system.guid
//https://developer.mozilla.org/en-US/docs/Web/API/Crypto/randomUUID
//The purpose for this class is to just have a container that represents a GUID.
export default class Guid implements IObject<Guid>, IEquatable<Guid> {
  private _value: string = EmptyGuidString;

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

  public static newGuid(): Guid {
    //https://stackoverflow.com/questions/105034/how-to-create-a-guid-uu

    //https://developer.mozilla.org/en-US/docs/Web/API/Crypto/randomUUID
    //self.crypto.randomUUID() -- Secure context: This feature is available only in secure contexts (HTTPS), in some or all supporting browsers.

    //https://nodejs.org/api/crypto.html#cryptorandomuuidoptions only available in Node.js v14.17.0 or later
    //crypto.randomUUID()
    return new Guid(crypto.randomUUID());
  }

  public static get empty() {
    return new Guid(EmptyGuidString);
  }

  public equals(other: Guid): boolean {
    return this._value === other.toString();
  }

  public getHashCode(): number {
    //This is not even remotely close to what a Guid hash is supposed to do - keeping it for now.
    //I think it's fair to say that this string hash is still very unique
    //https://github.com/dyslexicanaboko/FJS/issues/20
    return getHashCodeForString(this._value);
  }

  public toString(): string {
    return this._value;
  }

  //TODO: Should there be a compare function? Guid comparison and sorting is actually not easy to do.
  //https://github.com/dyslexicanaboko/FJS/issues/20
}
