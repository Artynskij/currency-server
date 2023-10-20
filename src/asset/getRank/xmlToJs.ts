export const XmlToJs = (res) => {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const convert = require('xml-js');
  const options = { ignoreComment: true, alwaysChildren: true };
  const result = convert.xml2json(res, { compact: true, options });
  return JSON.parse(result);
};
