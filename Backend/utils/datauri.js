import DataUriParser from 'datauri/parser.js';

import path from "path";

const getDataUri = (file) => {
    const parser = new DataUriParser();
    const extName = path.extname(file.originalname).toString();
    return parser.format(extName, file.buffer); //Converts the file buffer into a Data URI format.
};

export default getDataUri;

