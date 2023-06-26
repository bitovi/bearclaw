import { config } from "./config";

export const getClient = () => {
  return {
    fetch: async <T> (query: string, params?: any) => {
      const response = await fetch(`https://${config.projectId}.api.sanity.io/v2021-10-21/data/query/production?query=${query}`)
      const { result }: { result: T } = await response.json()
      
      return result;
    }
  }
}
