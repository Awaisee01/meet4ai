import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then(res => res.json());

export function useUser() {
  const { data, error, mutate } = useSWR("/api/user", fetcher);
  return { user: data?.user, isLoading: !error && !data, isError: error, mutate };
}
