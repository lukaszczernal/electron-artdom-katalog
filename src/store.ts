import { configureStore } from "@reduxjs/toolkit";
import { clientCatalogStore } from "@/services/store/clientCatalogStore";
import { downloadStore } from "./services/store/downloadStore";
import { clientFileRemoveStore } from "./services/store/clientFileRemoveStore";
import { clientFileUploadStore } from "./services/store/clientFileUploadStore";

const store = configureStore({
  reducer: {
    clientCatalog: clientCatalogStore.reducer,
    clientFileRemove: clientFileRemoveStore.reducer,
    clientFileUpload: clientFileUploadStore.reducer,
    download: downloadStore.reducer,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;

export default store;
