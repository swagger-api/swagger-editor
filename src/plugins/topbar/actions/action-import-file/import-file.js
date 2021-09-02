// Wrap the browser FileReader into a Promise
export const readFileAsTextAsync = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      resolve(reader.result);
    };
    reader.onerror = () => {
      reader.abort();
      reject(new DOMException('Problem parsing input file.'));
    };
    reader.readAsText(file, 'UTF-8');
  });
};

export default { readFileAsTextAsync };
