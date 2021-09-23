import { Box, Button, Flex, Spinner } from "@chakra-ui/react";
import { Form, Formik } from "formik";
import NextLink from "next/link";
import router from "next/router";
import InputField from "../components/InputField";
import Layout from "../components/Layout";
import { CreatePostInput, useCreatePostMutation } from "../generated/graphql";
import { useCheckAuth } from "../utils/useCheckAuth";
const createPost = () => {
  const { data: authData, loading: authLoading } = useCheckAuth();

  const initialValues = {
    title: "",
    text: "",
  };

  const [createPost, _] = useCreatePostMutation();

  const onCreatePostSubmit = async (values: CreatePostInput) => {
    await createPost({
      variables: { createPostInput: values },
      update(cache, { data }) {
        cache.modify({
          fields: {
            posts(existing) {
              if (data?.createPost.success && data.createPost.post) {
                const newPostRef = cache.identify(data.createPost.post);
                const newPostsAfterCreation = {
                  ...existing,
                  totalCount: existing.totalCount + 1,
                  paginatePosts: [
                    {
                      __ref: newPostRef,
                    },
                    ...existing.paginatePosts,
                  ],
                };

                return newPostsAfterCreation;
              }
            },
          },
        });
      },
    });
    router.push("/");
  };

  if (authLoading || (!authLoading && !authData?.me)) {
    return (
      <Flex justifyContent="center" alignItems="center" minH="100vh">
        <Spinner />
      </Flex>
    );
  } else {
    return (
      <>
        <Layout>
          <Formik initialValues={initialValues} onSubmit={onCreatePostSubmit}>
            {({ isSubmitting }) => (
              <Form>
                <InputField
                  name="title"
                  placeholder="Title"
                  label="Title"
                  type="text"
                ></InputField>
                <Box mt={4}>
                  <InputField
                    textarea
                    name="text"
                    placeholder="Text"
                    label="Text"
                    type="textarea"
                  ></InputField>
                </Box>

                <Flex mt={4} justifyContent="space-between" align="center">
                  <Button
                    type="submit"
                    colorScheme="teal"
                    isLoading={isSubmitting}
                  >
                    Create Post
                  </Button>
                  <NextLink href="/">
                    <Button>Go back to Home Page</Button>
                  </NextLink>
                </Flex>
              </Form>
            )}
          </Formik>
        </Layout>
      </>
    );
  }
};

export default createPost;
