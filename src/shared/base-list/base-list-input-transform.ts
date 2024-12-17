import appEnv from 'src/env';

export function paginationInputTransformer(options: {
  page?: number;
  pageSize?: number;
  totalRowCount?: number;
}): { skip: number; page: number; perPage: number, totalPage: number} {
  let skip = 0;
  const page = Number(options?.page) || 0;
  const perPage = Number(options?.pageSize) || appEnv.PAGE_SIZE;

  if (page > 0) {
    skip = (page - 1) * perPage;
  }


  return {
    skip,
    page: page ? page : page + 1,
    perPage: perPage,
    totalPage: Math.ceil(Number(options?.totalRowCount) / perPage) || 0,
  };
}
