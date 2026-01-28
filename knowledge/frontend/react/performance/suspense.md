---
tags: [react, performance]
---

# Suspense

# Questions
- [What does it mean when a component suspends?](#what-does-it-mean-when-a-component-suspends)

# Answers

## What does it mean when a component suspends?

### Official Answer
In this example, the SearchResults component suspends while fetching the search results.

Try typing "a", waiting for the results, and then editing it to "ab".

The results for "a" get replaced by the loading fallback.

```typescript jsx
function App() {
  const [query, setQuery] = useState('');
  return (
    <>
      <input value={query} onChange={e => setQuery(e.target.value)} />
      <Suspense fallback={<h2>Loading...</h2>}>
        <SearchResults query={query} />
      </Suspense>
    </>
  );
}

function SearchResults({ query }) {
  const albums = use(fetchData(`/search?q=${query}`));
  
  return (
    <ul>
      {albums.map(album => (
        <li key={album.id}>...</li>
      ))}
    </ul>
  );
}
```

### Reference