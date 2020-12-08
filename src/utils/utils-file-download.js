const FileDownload = require('js-file-download'); // replaces deprecated react-file-download

// react component helper to trigger browser to save data to file
const getFileDownload = (blob, filename) => {
  FileDownload(blob, filename);
};

export default getFileDownload;
