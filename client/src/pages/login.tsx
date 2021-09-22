import { Button } from "@chakra-ui/button";
import { Box, Flex, Spinner, useToast, Link } from "@chakra-ui/react";
import { Form, Formik, FormikHelpers } from "formik";
import NextLink from "next/link";
import { useRouter } from "next/router";
import InputField from "../components/InputField";
import Wrapper from "../components/Wrapper";
import {
  LoginInput,
  MeDocument,
  MeQuery,
  useLoginMutation,
} from "../generated/graphql";
import { mapFieldErrors } from "../helpers/mapFieldErrors";
import { initializeApollo } from "../lib/apolloClient.";
import { useCheckAuth } from "../utils/useCheckAuth";

const Login = () => {
  const router = useRouter();
  const toast = useToast();

  const { data: authData, loading: authLoading } = useCheckAuth();

  const initialValues: LoginInput = {
    usernameOrEmail: "",
    password: "",
  };

  const [loginUser, { loading: _loginUserLoading, data, error }] =
    useLoginMutation();
  const onLoginSubmit = async (
    values: LoginInput,
    { setErrors }: FormikHelpers<LoginInput>
  ) => {
    const response = await loginUser({
      variables: {
        loginInput: values,
      },
      // fix khi login thì nó k hiển thị logout liền mà pải load lại
      update(cache, { data }) {
        console.log("data login ", data);
        // const meData = cache.readQuery({
        //   query: MeDocument,
        // });
        // console.log('MEDATA ', meData);
        if (data?.login.success) {
          cache.writeQuery<MeQuery>({
            query: MeDocument,
            data: { me: data.login.user },
          });
        }
      },
    });
    // ? change data kp null undefine run
    if (response.data?.login.errors) {
      setErrors(mapFieldErrors(response.data.login.errors));
    } else if (response.data?.login.user) {
      toast({
        title: "Welcome",
        description: `${response.data.login.user.username}`,
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      const apolloClient = initializeApollo();
      apolloClient.resetStore();

      router.push("/");
    }
  };

  return (
    <>
      {authLoading || (!authLoading && authData?.me) ? (
        <Flex justifyContent="center" alignItems="center" minH="100vh">
          <Spinner />
        </Flex>
      ) : (
        <Wrapper size="small">
          {error && <p>Failed to Login Internal server error</p>}
          <Formik initialValues={initialValues} onSubmit={onLoginSubmit}>
            {({ isSubmitting }) => (
              <Form>
                <InputField
                  name="usernameOrEmail"
                  placeholder="Username Or Email"
                  label="Username Or Email"
                  type="text"
                ></InputField>
                <Box mt={4}>
                  <InputField
                    name="password"
                    placeholder="Password"
                    label="Password"
                    type="password"
                  ></InputField>
                </Box>

                <Flex mt={4}>
                  <NextLink href="/forgot-password">
                    <Link ml="auto">Forgot Password </Link>
                  </NextLink>
                </Flex>

                <Button
                  type="submit"
                  colorScheme="teal"
                  mt={4}
                  isLoading={isSubmitting}
                >
                  Login
                </Button>
              </Form>
            )}
          </Formik>
        </Wrapper>
      )}
    </>
  );
};

export default Login;
