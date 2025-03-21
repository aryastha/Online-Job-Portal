import DataUriParser from 'datauri/parser.js';

import path from "path";

const getDataUri = (file) => {
    const parser = new DataUriParser();
    const extName = path.extname(file.originalname).toString();
    //buffer contains the binary data of the file
    return parser.format(extName, file.buffer); // parser helps to Convert the file buffer into a Data URI format.
};

export default getDataUri;

