function isWideScreen() {
  const w = window.innerWidth;
  const h = window.innerHeight;

  const maximumNormalScreenAspectRatio = 1857 / 1220;

  return w / h > maximumNormalScreenAspectRatio;
}

export { isWideScreen };
