export interface DatabaseEntry {
  id: string;
  [key: string]: unknown;
}

export interface DatabaseConfig<T extends DatabaseEntry> {
  slug: string;
  name: string;
  description: string;
  category: string;
  entries: T[];
  columns: DatabaseColumn<T>[];
  defaultSort?: keyof T;
}

export interface DatabaseColumn<T> {
  key: keyof T;
  header: string;
  searchable?: boolean;
  sortable?: boolean;
  hideOnMobile?: boolean;
  render?: (value: unknown, entry: T) => string;
}
