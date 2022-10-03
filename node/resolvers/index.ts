import { queries as petQueries } from './pets'
import { mutations as petMutations } from './pets'


export const resolvers = {
  Mutation: {
    ...petMutations
  },
  Query: {
    ...petQueries
  }
}