// If the handle is a URL, just print the URL.
// Otherwise, print the handle prefixed by the @-symbol.
const getSocialHandle = (handle: string) => {
  if (handle.startsWith("http://") || handle.startsWith("https://"))
    return handle;

  return `@${handle}`;
};

export default getSocialHandle;
