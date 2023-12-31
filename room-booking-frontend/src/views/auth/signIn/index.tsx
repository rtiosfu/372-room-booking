import React, { useContext } from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { NavLink, useHistory } from "react-router-dom";
// Chakra imports
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Icon,
  Input,
  InputGroup,
  InputRightElement,
  Text,
  useColorModeValue,
  useToast,
} from "@chakra-ui/react";
// Custom components
import DefaultAuth from "layouts/auth/Default";
// Assets
import illustration from "assets/img/auth/sub.jpeg";
import { MdOutlineRemoveRedEye } from "react-icons/md";
import { RiEyeCloseLine } from "react-icons/ri";
// Context
import { UserContext } from "../../../contexts/UserContext";

function SignIn() {
  // Chakra color mode
  const textColor = useColorModeValue("navy.700", "white");
  const textColorSecondary = "gray.400";
  const textColorDetails = useColorModeValue("navy.700", "secondaryGray.600");
  const textColorBrand = useColorModeValue("brand.500", "white");
  const brandStars = useColorModeValue("brand.500", "brand.400");

  const toast = useToast();
  const history = useHistory();

  const [show, setShow] = React.useState(false);
  const { loggedInUser, setLoggedInUser } = useContext(UserContext);

  console.log("LOGGED IN?: ", loggedInUser);

  const handleClick = () => setShow(!show);

  const initialValues = {
    email: "",
    password: "",
  };

  const validationSchema = Yup.object().shape({
    email: Yup.string().email("Invalid email address").required("Required"),
    password: Yup.string()
      .min(8, "Password must be at least 8 characters")
      .required("Required"),
  });

  const onSubmit = async (values: any, { setSubmitting, setErrors }: any) => {
    const email = values.email;
    const password = values.password;
    const data = {
      username: email,
      password: password,
    };
    try {
      const response = await fetch("http://localhost:8080/login-api", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
        credentials: "include",
      });
      const responseData = await response.json();
      console.log("DATA: ", responseData);
      if (responseData.success) {
        toast({
          title: "Welcome to SFSS Room Booking",
          description: "You have successfully logged in",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
        setLoggedInUser(responseData);
        history.push("/admin");
      } else {
        setErrors({ email: true, password: true });
        toast({
          title: "An error has occurred",
          description: "You have used an incorrect email or password",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
        setLoggedInUser(null);
      }
      setSubmitting(false);
    } catch (error) {
      console.log(error);
      setSubmitting(false);
    }
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={onSubmit}
    >
      {({ isSubmitting }) => (
        <Form>
          <DefaultAuth
            illustrationBackground={illustration}
            image={illustration}
          >
            <Flex
              maxW={{ base: "100%", md: "max-content" }}
              w="100%"
              mx={{ base: "auto", lg: "0px" }}
              me="auto"
              h="100%"
              alignItems="start"
              justifyContent="center"
              mb={{ base: "30px", md: "60px" }}
              px={{ base: "25px", md: "0px" }}
              mt={{ base: "40px", md: "14vh" }}
              flexDirection="column"
            >
              <Box me="auto">
                <Heading color={textColor} fontSize="36px" mb="10px">
                  Sign In
                </Heading>
                <Text
                  mb="36px"
                  ms="4px"
                  color={textColorSecondary}
                  fontWeight="400"
                  fontSize="md"
                >
                  Enter your email and password to sign in!
                </Text>
              </Box>
              <Flex
                zIndex="2"
                direction="column"
                w={{ base: "100%", md: "420px" }}
                maxW="100%"
                background="transparent"
                borderRadius="15px"
                mx={{ base: "auto", lg: "unset" }}
                me="auto"
                mb={{ base: "20px", md: "auto" }}
              >
                <FormControl>
                  <FormLabel
                    display="flex"
                    ms="4px"
                    fontSize="sm"
                    fontWeight="500"
                    color={textColor}
                    mb="8px"
                  >
                    Email<Text color={brandStars}>*</Text>
                  </FormLabel>
                  <Field name="email">
                    {({ field, form }: any) => (
                      <Input
                        {...field}
                        id="email"
                        variant="auth"
                        fontSize="sm"
                        ms={{ base: "0px", md: "0px" }}
                        type="email"
                        placeholder="mail@simmmple.com"
                        mb="24px"
                        fontWeight="500"
                        size="lg"
                        borderColor={
                          form.errors.email && form.touched.email && "red"
                        }
                      />
                    )}
                  </Field>

                  <FormLabel
                    ms="4px"
                    fontSize="sm"
                    fontWeight="500"
                    color={textColor}
                    display="flex"
                  >
                    Password<Text color={brandStars}>*</Text>
                  </FormLabel>
                  <InputGroup size="md">
                    <Field name="password">
                      {({ field, form }: any) => (
                        <Input
                          {...field}
                          id="password"
                          fontSize="sm"
                          placeholder="Min. 8 characters"
                          mb="24px"
                          size="lg"
                          type={show ? "text" : "password"}
                          variant="auth"
                          borderColor={
                            form.errors.password &&
                            form.touched.password &&
                            "red"
                          }
                        />
                      )}
                    </Field>

                    <InputRightElement
                      display="flex"
                      alignItems="center"
                      mt="4px"
                    >
                      <Icon
                        color={textColorSecondary}
                        _hover={{ cursor: "pointer" }}
                        as={show ? RiEyeCloseLine : MdOutlineRemoveRedEye}
                        onClick={handleClick}
                      />
                    </InputRightElement>
                  </InputGroup>

                  <Button
                    fontSize="sm"
                    variant="brand"
                    fontWeight="500"
                    w="100%"
                    h="50"
                    mb="24px"
                    type="submit"
                    isLoading={isSubmitting}
                  >
                    Sign In
                  </Button>
                </FormControl>
                <Flex
                  flexDirection="column"
                  justifyContent="center"
                  alignItems="start"
                  maxW="100%"
                  mt="0px"
                >
                  <Text
                    color={textColorDetails}
                    fontWeight="400"
                    fontSize="14px"
                  >
                    Not registered yet?
                    <NavLink to="/auth/sign-up">
                      <Text
                        color={textColorBrand}
                        as="span"
                        ms="5px"
                        fontWeight="500"
                      >
                        Create an Account
                      </Text>
                    </NavLink>
                  </Text>
                </Flex>
              </Flex>
            </Flex>
          </DefaultAuth>
        </Form>
      )}
    </Formik>
  );
}

export default SignIn;
