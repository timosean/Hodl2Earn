export function isComponentBookRoute(
  pathname: string,
  isDevelopment: boolean,
) {
  if (!isDevelopment) {
    return false;
  }

  return pathname.replace(/\/$/, '') === '/component-book';
}
