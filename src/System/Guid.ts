import { EmptyGuidString, GuidWrapperCharacters } from "../constants.js";
import { isValidGuidString } from "../string-formats.js";
import { getHashCodeForString } from "../utils.js";
import IEquatable from "./IEquatable.js";
import IObject from "./IObject.js";

//https://learn.microsoft.com/en-us/dotnet/api/system.guid
//https://developer.mozilla.org/en-US/docs/Web/API/Crypto/randomUUID
//The purpose for this class is to just have a container that represents a GUID.
export default class Guid implements IObject<Guid>, IEquatable<Guid> {
  private _value: string;

  //TODO: Must fit the Guid format
  constructor(guidString: string = EmptyGuidString) {
    if (guidString === undefined || guidString === null)
      throw new Error("String cannot be null or undefined.");

    //Stripping out wrapper characters if they exist such as {, }, -, etc.
    GuidWrapperCharacters.forEach((char) => {
      guidString = guidString.replace(char, "");
    });

    //Doing a loose check on the string to see if it is a valid guid format, but not enforcing version
    if (!isValidGuidString(guidString))
      throw new Error(
        "String must be in the globally recognized 8/4/4/4/12 guid format: 00000000-0000-0000-0000-000000000000."
      );

    this._value = guidString;
  }

  public newGuid(): Guid {
    //https://stackoverflow.com/questions/105034/how-to-create-a-guid-uu
    //Secure context: This feature is available only in secure contexts (HTTPS), in some or all supporting browsers.
    return new Guid(self.crypto.randomUUID());
  }

  public static get empty() {
    return new Guid(EmptyGuidString);
  }

  public equals(other: Guid): boolean {
    return this._value === other.toString();
  }

  public getHashCode(): number {
    return getHashCodeForString(this._value);
  }

  public toString(): string {
    return this._value;
  }

  //TODO: Should there be a compare function? Guid comparison and sorting is actually not easy to do.
}
