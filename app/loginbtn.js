"use client";

import axios from "axios";
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

            {session.user.email === "cki60900@gmail.com" ? (
              <div style={{ marginTop: "10px" }}>
                <button
                  className="button-default"
                  onClick={() => {
                    const fetchDb = async () => {
                      const response = await axios.get(
                        `http://localhost:3001/db`
                      );
                      const jsonString = JSON.stringify(response.data, null, 2);
                      await navigator.clipboard.writeText(jsonString);
                      alert("db.json 내용이 클립보드에 복사되었습니다!");
                    };
                    fetchDb();
                  }}
                >
                  db copy
                </button>
              </div>
            ) : null}
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
