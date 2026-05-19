import SearchClient from "./SearchClient";

export default async function SearchPage({ searchParams }) {
  const params = await searchParams;
  const q = params.q || "";

  return <SearchClient query={q} />;
}
