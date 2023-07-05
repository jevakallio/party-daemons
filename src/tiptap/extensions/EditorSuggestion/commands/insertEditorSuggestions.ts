import { Node as ProseMirrorNode } from "prosemirror-model";
import { EditorState, Transaction } from "prosemirror-state";
import orderBy from "lodash/orderBy";
import differenceBy from "lodash/differenceBy";
import uniqWith from "lodash/uniqWith";

import EditorSuggestionSearch from "../EditorSuggestionSearch";

type Maybe<T> = T | null | undefined;
type ManuscriptSuggestionType = string;

type EditorSuggestionComment = {
  id: string;
  type: ManuscriptSuggestionType;
  comment: Maybe<string>;
  matcher: string;
  createdAt: string;
};

type SearchableNode = {
  text: string;
  nodeOffset: number;
  node: ProseMirrorNode;
};

type ReplaceableNode = {
  id: string;
  content: string;
  type: ManuscriptSuggestionType;
  comment: Maybe<string>;
  node: ProseMirrorNode;
  from: number;
  to: number;
  offset: number;
};

export type InsertEditorSuggestionsCommandArgs = {
  suggestions: EditorSuggestionComment[];
  onSuggestionNotMatched?: (suggestion: EditorSuggestionComment) => void;
  onSuggestionAlreadyExists?: (suggestion: EditorSuggestionComment) => void;
};

/**
 * Inserts Editor suggestions to the current document
 *
 * See src/features/editor/README.md for a more complete explanation
 */
export function insertEditorSuggestions({
  suggestions,
  onSuggestionNotMatched,
  onSuggestionAlreadyExists,
}: InsertEditorSuggestionsCommandArgs) {
  return ({ state }: { state: EditorState }) => {
    try {
      // trim out any suggestions that would result in duplicate annotations
      const oldestFirst = orderBy(suggestions, [(s) => s.createdAt], ["desc"]);
      const uniqueSuggestions = uniqWith(
        oldestFirst,
        (a, b) =>
          a.type === b.type &&
          a.comment === b.comment &&
          a.matcher === b.matcher
      );

      // start by removing all existing suggestions. we need to do this
      // up front, so that existing suggestions aren't counted against
      // node positions. this is done in a transaction, so that if the whole
      // routine fails to commit, existing suggestions are still present
      let transaction = removeExistingSuggestionsInTransaction(state);

      // get all direct child nodes with text (paragraphs etc)
      const searchableNodes = findNodesWithSearchableContent(transaction);

      // split suggestions into paragraph chunks
      const queries = splitSuggestionsAlongParagraphBoundaries(suggestions);

      // run through all suggestions and find their positions and parent nodes
      const changes = findReplaceableNodes(queries, searchableNodes);

      // if any matching nodes were found, create editor suggestions
      if (changes.length) {
        transaction = insertEditorSuggestionNodes(transaction, state, changes);
      }

      // apply transaction (commit changes)
      state.apply(transaction);

      // if any suggestions were not matched and the caller has attached a handler,
      // report back on each unmatched suggestion
      if (onSuggestionNotMatched) {
        reportUnmatchedSuggestions(
          suggestions,
          changes,
          onSuggestionNotMatched
        );
      }

      if (onSuggestionAlreadyExists) {
        reportDuplicateSuggestions(
          suggestions,
          uniqueSuggestions,
          onSuggestionAlreadyExists
        );
      }

      return true;
    } catch (e) {
      console.error(
        "Something went wrong while inserting editor suggestions",
        e
      );
      return false;
    }
  };
}

/**
 * Finds all top-level nodes that have replaceable text content
 * along with their document offset positions
 */
function findNodesWithSearchableContent(transaction: Transaction) {
  const doc = transaction.doc;
  const searchableNodes: SearchableNode[] = [];
  const makeSearchableNode = (node: ProseMirrorNode, offset: number) => ({
    text: node.textContent,
    nodeOffset: offset,
    node,
  });

  doc.descendants((node: ProseMirrorNode, offset: number) => {
    switch (node.type.name) {
      // These are the main "top level text block" elements
      // we look for suggestions in.
      case "paragraph":
      case "heading":
        searchableNodes.push(makeSearchableNode(node, offset));
        return false;
      default:
        // recurse deeper (in case of list items etc)
        return true;
    }
  });

  return searchableNodes;
}

/**
 * Splits any suggestions that spans across multiple paragraphs
 * into multiple inline suggestions
 */
function splitSuggestionsAlongParagraphBoundaries(
  suggestions: EditorSuggestionComment[]
): EditorSuggestionComment[] {
  const queries = [];
  for (const suggestion of suggestions) {
    const chunks = suggestion.matcher.trim().split("\n");
    let first = true;
    for (const chunk of chunks) {
      queries.push({
        ...suggestion,
        // only the first of each id group should have comment
        comment: first ? suggestion.comment : null,
        matcher: chunk,
      });
      first = false;
    }
  }
  return queries;
}

/**
 * Look through all the searchable nodes and find the positions
 * of suggestions to replace
 */
function findReplaceableNodes(
  suggestions: EditorSuggestionComment[],
  searchableNodes: SearchableNode[]
): ReplaceableNode[] {
  const changes = [];
  const searchEngine = new EditorSuggestionSearch(searchableNodes);
  for (const suggestion of suggestions) {
    const result = searchEngine.search(suggestion.matcher);
    if (result) {
      changes.push({
        id: suggestion.id,
        content: result.query,
        type: suggestion.type,
        comment: suggestion.comment,
        node: result.match.node,
        from: result.from,
        to: result.to,
        offset: result.match.nodeOffset,
      });
    }
  }

  return changes;
}

/**
 * Given a set of positions, wrap their content in EditorSuggestion nodes
 */
function insertEditorSuggestionNodes(
  transaction: Transaction,
  state: EditorState,
  changes: ReplaceableNode[]
) {
  // apply changes in reverse order to not cause any positional drift
  orderBy(changes, [(c) => c.offset + c.from], ["desc"]).forEach((change) => {
    // add the highlight
    transaction = transaction.addMark(
      change.offset + change.from + 1,
      change.offset + change.to + 1,
      state.schema.marks.editorHighlight.create({
        suggestionId: change.id,
      })
    );

    if (change.comment) {
      // insert new EditorSuggestion node
      const newNode = state.schema.nodes.editorSuggestion.create({
        id: change.id,
        type: change.type,
        comment: change.comment,
        originalText: change.content,
      });

      transaction = transaction.insert(
        change.offset + change.from + 1,
        newNode
      );
    }
  });

  return transaction;
}

function removeExistingSuggestionsInTransaction(
  state: EditorState
): Transaction {
  let transaction = state.tr;
  let totalDeletedNodeSize = 0;

  transaction.doc.descendants((node, position) => {
    if (node.type.name === "editorSuggestion") {
      // delete editor suggestion node
      transaction = transaction.deleteRange(
        position + totalDeletedNodeSize,
        position + totalDeletedNodeSize + node.nodeSize
      );

      // we need to manually keep count of the total node
      // size of deleted nodes, so that we can adjust any future
      // node positions
      totalDeletedNodeSize -= node.nodeSize;
    } else {
      // remove any editor highlight marks we find
      if (node.marks.find((mark) => mark.type.name === "editorHighlight")) {
        transaction = transaction.removeMark(
          position + totalDeletedNodeSize,
          position + totalDeletedNodeSize + node.nodeSize,
          state.schema.marks.editorHighlight
        );
      }
    }
  });

  // tr.doc.descendants((node, position) => {});

  return transaction;
}

function reportUnmatchedSuggestions(
  suggestions: EditorSuggestionComment[],
  changes: ReplaceableNode[],
  onSuggestionNotMatched: (suggestion: EditorSuggestionComment) => void
) {
  const unmatchedSuggestions = differenceBy(
    suggestions,
    changes,
    (item) => item.id
  );

  unmatchedSuggestions.forEach((unmatched) => {
    try {
      onSuggestionNotMatched(unmatched);
    } catch (e) {
      console.error("Failed to process unmatched suggestion", unmatched, e);
      throw e;
    }
  });
}

function reportDuplicateSuggestions(
  allSuggestions: EditorSuggestionComment[],
  appliedSuggestions: EditorSuggestionComment[],
  onSuggestionAlreadyFound: (suggestion: EditorSuggestionComment) => void
) {
  if (appliedSuggestions.length < allSuggestions.length) {
    const duplicates = differenceBy(
      allSuggestions,
      appliedSuggestions,
      (suggestion) => suggestion.id
    );

    duplicates.forEach((duplicate) => {
      try {
        onSuggestionAlreadyFound(duplicate);
      } catch (e) {
        console.error("Failed to process duplicate suggestion", duplicate, e);
        throw e;
      }
    });
  }
}
