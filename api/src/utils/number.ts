export const MAX_GRAPHQL_INT = 2 ** 31 - 1;
export const MIN_GRAPHQL_INT = -1 * 2 ** 31;

export const toGraphQLInteger = (number: string | number): number => {
  const int =
    typeof number === 'string' ? Number.parseInt(number) : Math.round(number);
  if (int < MIN_GRAPHQL_INT) {
    return MIN_GRAPHQL_INT;
  } else if (int > MAX_GRAPHQL_INT) {
    return MAX_GRAPHQL_INT;
  } else {
    return int;
  }
};
