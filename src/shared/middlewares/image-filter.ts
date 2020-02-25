import { extname } from "path";

export const imageFileFilter = (req, file, callback) => {
  console.log(file);
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
      return callback(new Error('Only image files are allowed!'), false);
    }
    callback(null, true);
  };

  export const editFileName = (req, file, callback) => {
    console.log(file.originalname);
    const name = file.originalname.split('.')[0];
    console.log(name);
    const fileExtName = extname(file.originalname);
    const randomName = Array(4)
      .fill(null)
      .map(() => Math.round(Math.random() * 16).toString(16))
      .join('');
    callback(null, `${name}-${randomName}${fileExtName}`);
  };