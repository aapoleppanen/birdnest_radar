import { UrlPathOptions } from '../types';

const getUrlPath = (url: string, options: UrlPathOptions): string => {
  const { routeParams, queryParams } = options;
  let formattedUrl = url;

  if (routeParams != null) {
    Object.keys(routeParams).forEach((key) => {
      formattedUrl = formattedUrl.replace(`:${key}`, routeParams[key].toString());
    });
  }

  if (queryParams != null) {
    formattedUrl = formattedUrl + new URLSearchParams(queryParams).toString();
  }

  return formattedUrl;
};

export { getUrlPath };
