import { InternetIdentityProvider, signIn } from "@junobuild/core-peer";

export default function LoginButton() {
  const _signIn = async () => {
    await signIn({
      provider: new InternetIdentityProvider({
        domain: "ic0.app",
      }),
    });
  };

  return (
    <>
      <div>
        <div>
          <p>Please sign in</p>
        </div>
      </div>
    </>
  );
}
