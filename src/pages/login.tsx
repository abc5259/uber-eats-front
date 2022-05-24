import { useMutation } from "@apollo/client";
import gql from "graphql-tag";
import { SubmitHandler, useForm } from "react-hook-form";
import { FormError } from "../components/form-error";
import {
  loginMutation,
  loginMutationVariables,
} from "../__generated__/loginMutation";

const LOGIN_MUTATION = gql`
  mutation loginMutation($LoginInput: LoginInput!) {
    login(input: $LoginInput) {
      ok
      token
      error
    }
  }
`;

type Inputs = {
  email: string;
  password: string;
};

export const Login = () => {
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<Inputs>();
  const onCompleted = (data: loginMutation) => {
    const {
      login: { ok, token },
    } = data;
    if (ok) {
      console.log(token);
    }
  };
  const [loginMutation, { data: loginMutationResult, loading }] = useMutation<
    loginMutation,
    loginMutationVariables
  >(LOGIN_MUTATION, {
    onCompleted,
  });
  const onValid: SubmitHandler<Inputs> = ({ email, password }) => {
    if (!loading) {
      loginMutation({
        variables: {
          LoginInput: {
            email,
            password,
          },
        },
      });
    }
  };
  return (
    <div className="h-screen flex items-center justify-center bg-gray-800">
      <div className="bg-white w-full max-w-lg pt-10 pb-7 rounded-lg text-center">
        <h3 className="text-2xl text-gray-800">Log In</h3>
        <form onSubmit={handleSubmit(onValid)} className="grid gap-3 mt-5 px-5">
          <input
            {...register("email", {
              required: "이메일을 적어주세요",
            })}
            type="email"
            placeholder="Email"
            className="input"
          />
          {errors.email?.message && (
            <FormError errorMessage={errors.email?.message} />
          )}
          <input
            {...register("password", {
              required: "password를 적어주세요",
              // minLength: {
              //   value: 10,
              //   message: "최소한 10글자 이상이어야합니다",
              // },
            })}
            type="password"
            placeholder="Password"
            className="input"
          />
          {errors.password?.message && (
            <FormError errorMessage={errors.password?.message} />
          )}
          <button className="button">
            {loading ? "loading..." : "Log In"}
          </button>
          {loginMutationResult?.login.error && (
            <FormError errorMessage={loginMutationResult.login.error} />
          )}
        </form>
      </div>
    </div>
  );
};