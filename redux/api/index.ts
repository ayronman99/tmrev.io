import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { HYDRATE } from 'next-redux-wrapper';

import {
  DiscoverMovie, DiscoverMovieQuery, DiscoverTv, DiscoverTvQuery, Movie, MovieQuery,
} from '../../models/tmdb';
import { User, UserQuery } from '../../models/tmrev';

const apiKey = process.env.NEXT_PUBLIC_TMDB_API_KEY;
const tmrevAPI = process.env.NEXT_PUBLIC_TMREV_API;

export const tmrevApi = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://api.themoviedb.org/3/',
    prepareHeaders: (headers) => headers,
  }),
  endpoints: (builder) => ({
    getDiscoverMovie: builder.query<DiscoverMovie, DiscoverMovieQuery>({
      query: (data) => ({
        url: `/discover/movie?api_key=${apiKey}&page=${data.page}`,
      }),
      transformResponse: (response: DiscoverMovie) => response,
    }),
    getDiscoverTv: builder.query<DiscoverTv, DiscoverTvQuery>({
      query: (data) => ({
        url: `/discover/tv?api_key=${apiKey}&page=${data.page}`,
      }),
      transformResponse: (response: DiscoverTv) => response,
    }),
    getMovie: builder.query<Movie, MovieQuery>({
      query: (data) => ({
        url: `/movie/${data.movie_id}?api_key=${apiKey}&append_to_response=credits,release_dates,reviews`,
      }),
      transformResponse: async (response: Movie, _, arg) => {
        const urls = [
          `${tmrevAPI}/imdb/${response.imdb_id}`,
          `${tmrevAPI}/movie/all/${arg.movie_id}`,
        ];
        const requests = urls.map((url) => fetch(url));
        const responses = await Promise.all(requests);
        const promises = responses.map((res) => res.json());

        const movieReviews = await Promise.all(promises);

        return {
          ...response,
          imdb: movieReviews[0],
          tmrevReviews: movieReviews[1],
        };
      },
    }),
    getUser: builder.query<User, UserQuery>({
      query: (data) => ({
        url: `${tmrevAPI}/user/full/${data.uid}`,
      }),
      transformResponse: (response: User) => response,
    }),
  }),
  // eslint-disable-next-line consistent-return
  extractRehydrationInfo(action, { reducerPath }) {
    if (action.type === HYDRATE) {
      return action.payload[reducerPath];
    }
  },
});

export const {
  useGetDiscoverMovieQuery,
  useGetDiscoverTvQuery,
  useGetMovieQuery,
  useGetUserQuery,
  util: { getRunningOperationPromises },
} = tmrevApi;

export const { getDiscoverMovie, getDiscoverTv, getMovie } = tmrevApi.endpoints;