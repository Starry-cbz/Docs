export interface SearchResult {
  id: string;
  title: string;
  url: string;
  snippet?: string;
}

export interface SearchBarProps {
  onSearch: (query: string) => Promise<void>;
  className?: string;
}

export interface SearchResultsProps {
  results: SearchResult[];
  selectedIndex: number;
  onResultSelect: (result: SearchResult) => void;
  onKeyDown?: (event: React.KeyboardEvent) => void;
  tabIndex?: number;
}

