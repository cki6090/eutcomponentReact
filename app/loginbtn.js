"use client";

import { useSession, signIn, signOut } from "next-auth/react";
export default function Component() {
  const { data: session } = useSession();
  if (session) {
    return (
      <>
        <div className="login-btn">
          <button onClick={() => signOut()}> 📄 Sign out</button>
          <div className="login-info">
            <div>이메일 : {session.user.email}</div>
            <div> 이름 : {session.user.name} </div>
            <div> 토큰 만료 시간 : {session.expires} </div>
          </div>
        </div>
      </>
    );
  }
  return (
    <>
      <div className="login-btn">
        <button onClick={() => signIn()}>Sign in</button>
      </div>
    </>
  );
}
