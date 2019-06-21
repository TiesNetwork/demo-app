type buildUrlType = {
  path: Array<string> | string,
};

export const buildUrl: Function = ({ path }: buildUrlType): string => {
  const url: string = []
    .concat(path)
    .join('/')
    .replace(/\/+/g, '/');

  return url;
};

export const resolveUrl: Function = (...path): string => buildUrl({ path });

export type { buildUrlType };
