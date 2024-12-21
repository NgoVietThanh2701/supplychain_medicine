import bcryptjs from 'bcryptjs';

export const hashPassword = (password: string) => {
   return bcryptjs.hashSync(password, bcryptjs.genSaltSync(10));
}

export const comparePassword = (password: string, hashPassword: string) => {
   return bcryptjs.compareSync(password, hashPassword);
}
