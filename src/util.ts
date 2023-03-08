export function replaceAll(
    str: string,
    searchValue: string | RegExp,
    replaceValue: string
  ): string {
    function escapeRegExp(str: string): string {
      return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); // $& means the whole matched string
    }
    return str.replace(
      searchValue instanceof RegExp
        ? searchValue
        : new RegExp(escapeRegExp(searchValue), "gm"),
      replaceValue
    );
  }