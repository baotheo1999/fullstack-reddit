import { FieldError } from "../generated/graphql";

// [
//     {field:'username',message:'some erro'}
// ]
// convert trên xuống dưới
// {
//     username:'someerror'
// }

export const mapFieldErrors = (
  errors: FieldError[]
): { [key: string]: string } =>
  errors.reduce(
    (accumulatedErrorsObj, error) => ({
      ...accumulatedErrorsObj,
      [error.field]: error.message,
    }),
    {}
  );
