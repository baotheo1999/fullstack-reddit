import { Box, Flex, Spinner, Button, Link } from "@chakra-ui/react";
import NextLink from "next/link";
import { Form, Formik } from "formik";
import InputField from "../components/InputField";
import Wrapper from "../components/Wrapper";
import {
  ForgotPasswordInput,
  useForgotPasswordMutation,
} from "../generated/graphql";
import { useCheckAuth } from "../utils/useCheckAuth";

const ForgotPassword = () => {
  const { data: authData, loading: authLoading } = useCheckAuth();

  const initialValues = { email: "" };
  const [forgotPassword, { loading, data }] = useForgotPasswordMutation();

  const onForgotPasswordSubmit = async (values: ForgotPasswordInput) => {
    await forgotPassword({ variables: { forgotPasswordInput: values } });
  };

  if (authLoading || (!authLoading && authData?.me)) {
    return (
      <Flex justifyContent="center" alignItems="center" minH="100vh">
        <Spinner />
      </Flex>
    );
  } else {
    return (
      <Wrapper size="small">
        <Formik initialValues={initialValues} onSubmit={onForgotPasswordSubmit}>
          {({ isSubmitting }) =>
            !loading && data ? (
              <Box>please check your inbox</Box>
            ) : (
              <Form>
                <InputField
                  name="email"
                  placeholder="Email"
                  label="Email"
                  type="email"
                ></InputField>

                <Flex mt={4}>
                  <NextLink href="/login">
                    <Link ml="auto">Back To Login</Link>
                  </NextLink>
                </Flex>

                <Button
                  type="submit"
                  colorScheme="teal"
                  mt={4}
                  isLoading={isSubmitting}
                >
                  Send Reset Password Email
                </Button>
              </Form>
            )
          }
        </Formik>
      </Wrapper>
    );
  }
};

export default ForgotPassword;
