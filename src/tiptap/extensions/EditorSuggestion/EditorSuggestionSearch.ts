export interface Searchable {
  text: string;
}

export default class EditorSuggestionSearch<T extends Searchable> {
  searchIndex: T[];

  constructor(searchIndex: T[]) {
    this.searchIndex = searchIndex;
  }

  search(query: string) {
    const sanitized = query.trim();

    // dumbest possible search
    for (const searchable of this.searchIndex) {
      const index = searchable.text.indexOf(sanitized);
      if (index !== -1) {
        return {
          match: searchable,
          query: sanitized,
          from: index,
          to: index + sanitized.length,
        };
      }
    }

    return null;
  }
}
