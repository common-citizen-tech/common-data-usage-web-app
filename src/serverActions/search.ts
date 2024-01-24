'use server'

import { fetchData } from '~/lib/api/fetchData'

export const searchEntities = async (searchQuery: string) => {
  return await fetchData(`/search?query=${searchQuery}`);
};