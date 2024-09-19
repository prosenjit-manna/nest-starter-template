import { appConfig } from 'src/app.config';

export function paginationInputTransformer(options: {
  page?: number;
  pageSize?: number;
  totalRowCount?: number;
}): { skip: number; page: number; perPage: number, totalPage?: number} {
  let skip = 0;
  const page = Number(options?.page) || 0;
  const perPage = Number(options?.pageSize) || appConfig.pageSize;

  if (page > 0) {
    skip = (page - 1) * perPage;
  }


  return {
    skip,
    page: page ? page : page + 1,
    perPage: perPage,
    totalPage: Math.ceil(Number(options?.totalRowCount) / perPage),
  };
}
