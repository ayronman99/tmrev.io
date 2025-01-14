import { combineReducers } from 'redux';

import { tmrevApi } from '../api';
import modalSlice from '../slice/modalSlice';
import navigationSlice from '../slice/navigationSlice';
import reviewsSlice from '../slice/reviewsSlice';
import toastSlice from '../slice/toastSlice';
import userProfileSlice from '../slice/userProfileSlice';
import watchListSlice from '../slice/watchListSlice';

const rootReducer = combineReducers({
  [tmrevApi.reducerPath]: tmrevApi.reducer,
  modal: modalSlice,
  navigation: navigationSlice,
  reviews: reviewsSlice,
  toast: toastSlice,
  userProfile: userProfileSlice,
  watchList: watchListSlice,
});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
