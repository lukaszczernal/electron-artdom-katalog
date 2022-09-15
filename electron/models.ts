export interface Page {
  svg: {
    dir: string;
    file: string;
    path: string,
  },
  status: 'enabled' | 'disabled',
};
