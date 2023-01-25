export type AsyncState<DATA> = {
  data?: DATA;
  isLoading: boolean;
  error?: string;
}
