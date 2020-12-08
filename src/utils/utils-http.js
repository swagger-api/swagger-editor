import axios from 'axios';

// Although this call works, we can't use this directly,
// because the intended replacement of SwaggerClient has a transform interface
// export async function getGeneratorsList({ url }) {
//   const config = {
//     headers: {
//       'Content-Type': 'application/json',
//       // eslint-disable-next-line prettier/prettier
//       'Accept': 'application/json',
//     },
//   };
//   const res = await axios.get(url, config);
//   console.log("utils. res:", res);
//   return res.data;
// };

// importFromURL
export async function getDefinitionFromUrl({ url }) {
  const config = {};
  const res = await axios.get(url, config).catch((err) => err);
  if (!res) {
    return { error: 'Network Error' };
  }
  if (res instanceof Error && res.message) {
    return { error: res.message }; // 'Request failed with status code 404'
  }
  if (res instanceof Error) {
    return { error: 'unknown error' };
  }
  return res.data;
}

// downloadGeneratedFile -> handleResponse -> downloadFile
// given a swagger2 spec, Generator 3 response with a "builder url" -> where we make a fetch call in handleResponse -> afterwards, we download the blob
export async function getGeneratedDefinition({ url }) {
  const config = { responseType: 'blob' };
  const res = await axios.get(url, config);
  if (!res) {
    return { error: 'Network Error' };
  }
  if (res instanceof Error && res.message) {
    return { error: res.message };
  }
  if (res instanceof Error) {
    return { error: 'unknown error' }; // statusCode: 400
  }
  return { data: res.data }; // expect res.data: Blob
}

// convert modal (from swagger2 to oas3, using converter.swagger.io)
export async function postPerformOasConversion({ url, data }) {
  const config = {
    headers: {
      'Content-Type': 'application/yaml',
      // eslint-disable-next-line prettier/prettier
      'Accept': 'application/yaml',
    },
  };
  const res = await axios.post(url, data, config);
  if (!res) {
    return { error: 'Network Error' };
  }
  if (res instanceof Error && res.message) {
    return { error: res.message };
  }
  if (res instanceof Error) {
    return { error: 'unknown error' }; // statusCode: 400
  }
  return res.data;
}
