import { configureStore } from "@reduxjs/toolkit";
import { clientPagesStore } from "@/services/store/clientPagesStore";
import { downloadStore } from './services/store/downloadStore';

const store = configureStore({
  reducer: {
    clientPages: clientPagesStore.reducer,
    download: downloadStore.reducer,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;

export default store;
