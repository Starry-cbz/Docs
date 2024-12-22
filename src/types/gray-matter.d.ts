declare module 'gray-matter' {
  function matter(input: string): {
    data: Record<string, unknown>;
    content: string;
  };
  export = matter;
}

