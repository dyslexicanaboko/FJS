//Is left -1 <, 1 >, 0 = then right
export const defaultComparer = <T>(left: T, right: T): number => {
  //If both are undefined then left = right
  if (!left && !right) return 0;

  //If left is undefined then left < right
  if (!left) return -1;

  //If right is undefined then left > right
  if (!right) return 1;

  //If neither is undefined, then do a proper compare
  if (left < right) return -1;

  if (left === right) return 0;

  //if(left > right)
  return 1;
};
