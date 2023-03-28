import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
const defaultOptions = {} as const;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
};

export type Asset = {
  __typename?: 'Asset';
  description: Scalars['String'];
  id: Scalars['Int'];
  path: Scalars['String'];
  size: Scalars['Float'];
};

export type Category = {
  __typename?: 'Category';
  id: Scalars['Int'];
  name: Scalars['String'];
};

export type Color = {
  __typename?: 'Color';
  id: Scalars['Int'];
  value: Scalars['String'];
};

export type Mutation = {
  __typename?: 'Mutation';
  activeUser: SignInSuccess;
  createCategory: Category;
  createColor: Color;
  createProduct: Product;
  createSize: Size;
  deleteAsset: Asset;
  deleteCategory: Category;
  deleteColor: Color;
  deleteSize: Size;
  forgotPassword: Scalars['Boolean'];
  resetPassword: Scalars['Boolean'];
  revokeRefreshTokensForUser: Scalars['Boolean'];
  signIn: SignInSuccess;
  signUp: Scalars['Boolean'];
};


export type MutationActiveUserArgs = {
  token: Scalars['String'];
};


export type MutationCreateCategoryArgs = {
  name: Scalars['String'];
};


export type MutationCreateColorArgs = {
  value: Scalars['String'];
};


export type MutationCreateProductArgs = {
  input: ProductInput;
};


export type MutationCreateSizeArgs = {
  value: Scalars['String'];
};


export type MutationDeleteAssetArgs = {
  id: Scalars['Float'];
};


export type MutationDeleteCategoryArgs = {
  id: Scalars['Float'];
};


export type MutationDeleteColorArgs = {
  id: Scalars['Float'];
};


export type MutationDeleteSizeArgs = {
  id: Scalars['Float'];
};


export type MutationForgotPasswordArgs = {
  email: Scalars['String'];
};


export type MutationResetPasswordArgs = {
  password: Scalars['String'];
  token: Scalars['String'];
};


export type MutationRevokeRefreshTokensForUserArgs = {
  userId: Scalars['Int'];
};


export type MutationSignInArgs = {
  email: Scalars['String'];
  password: Scalars['String'];
};


export type MutationSignUpArgs = {
  email: Scalars['String'];
  firstName: Scalars['String'];
  lastName: Scalars['String'];
  password: Scalars['String'];
};

export type Product = {
  __typename?: 'Product';
  assets?: Maybe<Array<Asset>>;
  categories?: Maybe<Array<Category>>;
  colors?: Maybe<Array<Color>>;
  description: Scalars['String'];
  id: Scalars['Int'];
  name: Scalars['String'];
  price: Scalars['String'];
  quantity: Scalars['Int'];
  rating?: Maybe<Scalars['Float']>;
  reviews?: Maybe<Array<Review>>;
  sizes?: Maybe<Array<Size>>;
  thumbnail?: Maybe<Asset>;
  user?: Maybe<User>;
};

export type ProductInput = {
  description: Scalars['String'];
  name: Scalars['String'];
};

export type Query = {
  __typename?: 'Query';
  asset: Asset;
  bye: Scalars['String'];
  categories: Array<Category>;
  category: Category;
  color: Color;
  colors: Array<Color>;
  hello: Scalars['String'];
  product: Product;
  search: Array<Product>;
  size: Size;
  sizes: Array<Size>;
  users: Array<User>;
};


export type QueryAssetArgs = {
  id: Scalars['Float'];
};


export type QueryCategoryArgs = {
  id: Scalars['Float'];
};


export type QueryColorArgs = {
  id: Scalars['Float'];
};


export type QueryProductArgs = {
  id: Scalars['Float'];
};


export type QuerySearchArgs = {
  limit?: InputMaybe<Scalars['Float']>;
};


export type QuerySizeArgs = {
  id: Scalars['Float'];
};

export type Review = {
  __typename?: 'Review';
  content: Scalars['String'];
  id: Scalars['Int'];
  rating: Scalars['Float'];
  user?: Maybe<User>;
};

export type SignInSuccess = {
  __typename?: 'SignInSuccess';
  token: Scalars['String'];
};

export type Size = {
  __typename?: 'Size';
  id: Scalars['Int'];
  value: Scalars['String'];
};

export type User = {
  __typename?: 'User';
  avatar: Asset;
  email: Scalars['String'];
  firstName: Scalars['String'];
  fullName: Scalars['String'];
  id: Scalars['Int'];
  isActive: Scalars['Boolean'];
  isSeller: Scalars['Boolean'];
  lastName: Scalars['String'];
  products?: Maybe<Array<Product>>;
  tokenVersion: Scalars['Int'];
};

export type SignUpMutationVariables = Exact<{
  firstName: Scalars['String'];
  lastName: Scalars['String'];
  email: Scalars['String'];
  password: Scalars['String'];
}>;


export type SignUpMutation = { __typename?: 'Mutation', signUp: boolean };

export type SignInMutationVariables = Exact<{
  email: Scalars['String'];
  password: Scalars['String'];
}>;


export type SignInMutation = { __typename?: 'Mutation', signIn: { __typename?: 'SignInSuccess', token: string } };

export type ActivateUserMutationVariables = Exact<{
  token: Scalars['String'];
}>;


export type ActivateUserMutation = { __typename?: 'Mutation', activeUser: { __typename?: 'SignInSuccess', token: string } };

export type ForgotPasswordMutationVariables = Exact<{
  email: Scalars['String'];
}>;


export type ForgotPasswordMutation = { __typename?: 'Mutation', forgotPassword: boolean };

export type ResetPasswordMutationVariables = Exact<{
  token: Scalars['String'];
  password: Scalars['String'];
}>;


export type ResetPasswordMutation = { __typename?: 'Mutation', resetPassword: boolean };

export type HelloQueryVariables = Exact<{ [key: string]: never; }>;


export type HelloQuery = { __typename?: 'Query', hello: string };

export type SearchQueryVariables = Exact<{
  name?: InputMaybe<Scalars['String']>;
  maxPrice?: InputMaybe<Scalars['Float']>;
  minPrice?: InputMaybe<Scalars['Float']>;
  categories?: InputMaybe<Array<Scalars['String']> | Scalars['String']>;
  tags?: InputMaybe<Array<Scalars['String']> | Scalars['String']>;
}>;


export type SearchQuery = { __typename?: 'Query', search: Array<{ __typename?: 'Product', id: number, name: string, description: string, price: string, categories?: Array<{ __typename?: 'Category', id: number, name: string }> | null, sizes?: Array<{ __typename?: 'Size', id: number, value: string }> | null, colors?: Array<{ __typename?: 'Color', id: number, value: string }> | null, user?: { __typename?: 'User', id: number, firstName: string, lastName: string, email: string } | null }> };

export type FindProductByIdQueryVariables = Exact<{
  productId: Scalars['Float'];
}>;


export type FindProductByIdQuery = { __typename?: 'Query', product: { __typename?: 'Product', id: number, name: string, description: string, price: string, quantity: number, rating?: number | null, categories?: Array<{ __typename?: 'Category', id: number, name: string }> | null, sizes?: Array<{ __typename?: 'Size', id: number, value: string }> | null, colors?: Array<{ __typename?: 'Color', id: number, value: string }> | null, assets?: Array<{ __typename?: 'Asset', id: number, description: string, path: string, size: number }> | null, reviews?: Array<{ __typename?: 'Review', id: number, content: string, rating: number, user?: { __typename?: 'User', fullName: string } | null }> | null, user?: { __typename?: 'User', id: number, firstName: string, lastName: string, email: string } | null } };

export type FindProductNameByIdQueryVariables = Exact<{
  id: Scalars['Float'];
}>;


export type FindProductNameByIdQuery = { __typename?: 'Query', product: { __typename?: 'Product', name: string } };


export const SignUpDocument = gql`
    mutation SignUp($firstName: String!, $lastName: String!, $email: String!, $password: String!) {
  signUp(
    firstName: $firstName
    lastName: $lastName
    email: $email
    password: $password
  )
}
    `;
export type SignUpMutationFn = Apollo.MutationFunction<SignUpMutation, SignUpMutationVariables>;

/**
 * __useSignUpMutation__
 *
 * To run a mutation, you first call `useSignUpMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSignUpMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [signUpMutation, { data, loading, error }] = useSignUpMutation({
 *   variables: {
 *      firstName: // value for 'firstName'
 *      lastName: // value for 'lastName'
 *      email: // value for 'email'
 *      password: // value for 'password'
 *   },
 * });
 */
export function useSignUpMutation(baseOptions?: Apollo.MutationHookOptions<SignUpMutation, SignUpMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<SignUpMutation, SignUpMutationVariables>(SignUpDocument, options);
      }
export type SignUpMutationHookResult = ReturnType<typeof useSignUpMutation>;
export type SignUpMutationResult = Apollo.MutationResult<SignUpMutation>;
export type SignUpMutationOptions = Apollo.BaseMutationOptions<SignUpMutation, SignUpMutationVariables>;
export const SignInDocument = gql`
    mutation SignIn($email: String!, $password: String!) {
  signIn(email: $email, password: $password) {
    token
  }
}
    `;
export type SignInMutationFn = Apollo.MutationFunction<SignInMutation, SignInMutationVariables>;

/**
 * __useSignInMutation__
 *
 * To run a mutation, you first call `useSignInMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSignInMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [signInMutation, { data, loading, error }] = useSignInMutation({
 *   variables: {
 *      email: // value for 'email'
 *      password: // value for 'password'
 *   },
 * });
 */
export function useSignInMutation(baseOptions?: Apollo.MutationHookOptions<SignInMutation, SignInMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<SignInMutation, SignInMutationVariables>(SignInDocument, options);
      }
export type SignInMutationHookResult = ReturnType<typeof useSignInMutation>;
export type SignInMutationResult = Apollo.MutationResult<SignInMutation>;
export type SignInMutationOptions = Apollo.BaseMutationOptions<SignInMutation, SignInMutationVariables>;
export const ActivateUserDocument = gql`
    mutation ActivateUser($token: String!) {
  activeUser(token: $token) {
    token
  }
}
    `;
export type ActivateUserMutationFn = Apollo.MutationFunction<ActivateUserMutation, ActivateUserMutationVariables>;

/**
 * __useActivateUserMutation__
 *
 * To run a mutation, you first call `useActivateUserMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useActivateUserMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [activateUserMutation, { data, loading, error }] = useActivateUserMutation({
 *   variables: {
 *      token: // value for 'token'
 *   },
 * });
 */
export function useActivateUserMutation(baseOptions?: Apollo.MutationHookOptions<ActivateUserMutation, ActivateUserMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<ActivateUserMutation, ActivateUserMutationVariables>(ActivateUserDocument, options);
      }
export type ActivateUserMutationHookResult = ReturnType<typeof useActivateUserMutation>;
export type ActivateUserMutationResult = Apollo.MutationResult<ActivateUserMutation>;
export type ActivateUserMutationOptions = Apollo.BaseMutationOptions<ActivateUserMutation, ActivateUserMutationVariables>;
export const ForgotPasswordDocument = gql`
    mutation ForgotPassword($email: String!) {
  forgotPassword(email: $email)
}
    `;
export type ForgotPasswordMutationFn = Apollo.MutationFunction<ForgotPasswordMutation, ForgotPasswordMutationVariables>;

/**
 * __useForgotPasswordMutation__
 *
 * To run a mutation, you first call `useForgotPasswordMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useForgotPasswordMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [forgotPasswordMutation, { data, loading, error }] = useForgotPasswordMutation({
 *   variables: {
 *      email: // value for 'email'
 *   },
 * });
 */
export function useForgotPasswordMutation(baseOptions?: Apollo.MutationHookOptions<ForgotPasswordMutation, ForgotPasswordMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<ForgotPasswordMutation, ForgotPasswordMutationVariables>(ForgotPasswordDocument, options);
      }
export type ForgotPasswordMutationHookResult = ReturnType<typeof useForgotPasswordMutation>;
export type ForgotPasswordMutationResult = Apollo.MutationResult<ForgotPasswordMutation>;
export type ForgotPasswordMutationOptions = Apollo.BaseMutationOptions<ForgotPasswordMutation, ForgotPasswordMutationVariables>;
export const ResetPasswordDocument = gql`
    mutation ResetPassword($token: String!, $password: String!) {
  resetPassword(token: $token, password: $password)
}
    `;
export type ResetPasswordMutationFn = Apollo.MutationFunction<ResetPasswordMutation, ResetPasswordMutationVariables>;

/**
 * __useResetPasswordMutation__
 *
 * To run a mutation, you first call `useResetPasswordMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useResetPasswordMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [resetPasswordMutation, { data, loading, error }] = useResetPasswordMutation({
 *   variables: {
 *      token: // value for 'token'
 *      password: // value for 'password'
 *   },
 * });
 */
export function useResetPasswordMutation(baseOptions?: Apollo.MutationHookOptions<ResetPasswordMutation, ResetPasswordMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<ResetPasswordMutation, ResetPasswordMutationVariables>(ResetPasswordDocument, options);
      }
export type ResetPasswordMutationHookResult = ReturnType<typeof useResetPasswordMutation>;
export type ResetPasswordMutationResult = Apollo.MutationResult<ResetPasswordMutation>;
export type ResetPasswordMutationOptions = Apollo.BaseMutationOptions<ResetPasswordMutation, ResetPasswordMutationVariables>;
export const HelloDocument = gql`
    query Hello {
  hello
}
    `;

/**
 * __useHelloQuery__
 *
 * To run a query within a React component, call `useHelloQuery` and pass it any options that fit your needs.
 * When your component renders, `useHelloQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useHelloQuery({
 *   variables: {
 *   },
 * });
 */
export function useHelloQuery(baseOptions?: Apollo.QueryHookOptions<HelloQuery, HelloQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<HelloQuery, HelloQueryVariables>(HelloDocument, options);
      }
export function useHelloLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<HelloQuery, HelloQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<HelloQuery, HelloQueryVariables>(HelloDocument, options);
        }
export type HelloQueryHookResult = ReturnType<typeof useHelloQuery>;
export type HelloLazyQueryHookResult = ReturnType<typeof useHelloLazyQuery>;
export type HelloQueryResult = Apollo.QueryResult<HelloQuery, HelloQueryVariables>;
export const SearchDocument = gql`
    query Search($name: String, $maxPrice: Float, $minPrice: Float, $categories: [String!], $tags: [String!]) {
  search(limit: 100) {
    id
    name
    description
    price
    categories {
      id
      name
    }
    sizes {
      id
      value
    }
    colors {
      id
      value
    }
    user {
      id
      firstName
      lastName
      email
    }
  }
}
    `;

/**
 * __useSearchQuery__
 *
 * To run a query within a React component, call `useSearchQuery` and pass it any options that fit your needs.
 * When your component renders, `useSearchQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSearchQuery({
 *   variables: {
 *      name: // value for 'name'
 *      maxPrice: // value for 'maxPrice'
 *      minPrice: // value for 'minPrice'
 *      categories: // value for 'categories'
 *      tags: // value for 'tags'
 *   },
 * });
 */
export function useSearchQuery(baseOptions?: Apollo.QueryHookOptions<SearchQuery, SearchQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<SearchQuery, SearchQueryVariables>(SearchDocument, options);
      }
export function useSearchLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<SearchQuery, SearchQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<SearchQuery, SearchQueryVariables>(SearchDocument, options);
        }
export type SearchQueryHookResult = ReturnType<typeof useSearchQuery>;
export type SearchLazyQueryHookResult = ReturnType<typeof useSearchLazyQuery>;
export type SearchQueryResult = Apollo.QueryResult<SearchQuery, SearchQueryVariables>;
export const FindProductByIdDocument = gql`
    query FindProductById($productId: Float!) {
  product(id: $productId) {
    id
    name
    description
    price
    quantity
    categories {
      id
      name
    }
    sizes {
      id
      value
    }
    colors {
      id
      value
    }
    assets {
      id
      description
      path
      size
    }
    reviews {
      id
      content
      rating
      user {
        fullName
      }
    }
    rating
    user {
      id
      firstName
      lastName
      email
    }
  }
}
    `;

/**
 * __useFindProductByIdQuery__
 *
 * To run a query within a React component, call `useFindProductByIdQuery` and pass it any options that fit your needs.
 * When your component renders, `useFindProductByIdQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useFindProductByIdQuery({
 *   variables: {
 *      productId: // value for 'productId'
 *   },
 * });
 */
export function useFindProductByIdQuery(baseOptions: Apollo.QueryHookOptions<FindProductByIdQuery, FindProductByIdQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<FindProductByIdQuery, FindProductByIdQueryVariables>(FindProductByIdDocument, options);
      }
export function useFindProductByIdLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<FindProductByIdQuery, FindProductByIdQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<FindProductByIdQuery, FindProductByIdQueryVariables>(FindProductByIdDocument, options);
        }
export type FindProductByIdQueryHookResult = ReturnType<typeof useFindProductByIdQuery>;
export type FindProductByIdLazyQueryHookResult = ReturnType<typeof useFindProductByIdLazyQuery>;
export type FindProductByIdQueryResult = Apollo.QueryResult<FindProductByIdQuery, FindProductByIdQueryVariables>;
export const FindProductNameByIdDocument = gql`
    query FindProductNameById($id: Float!) {
  product(id: $id) {
    name
  }
}
    `;

/**
 * __useFindProductNameByIdQuery__
 *
 * To run a query within a React component, call `useFindProductNameByIdQuery` and pass it any options that fit your needs.
 * When your component renders, `useFindProductNameByIdQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useFindProductNameByIdQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useFindProductNameByIdQuery(baseOptions: Apollo.QueryHookOptions<FindProductNameByIdQuery, FindProductNameByIdQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<FindProductNameByIdQuery, FindProductNameByIdQueryVariables>(FindProductNameByIdDocument, options);
      }
export function useFindProductNameByIdLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<FindProductNameByIdQuery, FindProductNameByIdQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<FindProductNameByIdQuery, FindProductNameByIdQueryVariables>(FindProductNameByIdDocument, options);
        }
export type FindProductNameByIdQueryHookResult = ReturnType<typeof useFindProductNameByIdQuery>;
export type FindProductNameByIdLazyQueryHookResult = ReturnType<typeof useFindProductNameByIdLazyQuery>;
export type FindProductNameByIdQueryResult = Apollo.QueryResult<FindProductNameByIdQuery, FindProductNameByIdQueryVariables>;