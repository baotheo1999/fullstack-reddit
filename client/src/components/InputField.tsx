import {
  FormControl,
  FormErrorMessage,
  FormLabel,
} from "@chakra-ui/form-control";
import { Input } from "@chakra-ui/input";
import { Textarea } from "@chakra-ui/react";
import { useField } from "formik";

interface InputFiledProps {
  name: string;
  label: string;
  placeholder: string;
  type: string;
  textarea?: boolean;
}
const InputField = ({ textarea, ...props }: InputFiledProps) => {
  const [field, { error }] = useField(props);
  return (
    <FormControl isInvalid={!!error}>
      <FormLabel htmlFor={field.name}>{props.label}</FormLabel>
      {textarea ? (
        <Textarea id={field.name} {...props} {...field} />
      ) : (
        <Input id={field.name} {...props} {...field} />
      )}

      {error && <FormErrorMessage>{error}</FormErrorMessage>}
    </FormControl>
  );
};

export default InputField;
