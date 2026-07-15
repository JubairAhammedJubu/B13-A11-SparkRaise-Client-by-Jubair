import SigninForm from "./SigninForm";

export default async function SigninPage({ searchParams }) {
  const params = await searchParams;
  const redirectTo = params?.redirect || "/dashboard";
  return <SigninForm redirectTo={redirectTo} />;
}