import { gql } from '@apollo/client';

export const GET_ARTICLES = gql`
    query articleTypeQuery($page: Int!) {
        retrievePageArticles(page: $page) {
            id
            author
            createdAt
            score
            updatedAt
            title
            text
            type
            url
        }
  }
`