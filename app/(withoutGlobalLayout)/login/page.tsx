"use client";

import { FormEvent, MouseEvent, useEffect, useState } from "react";
import { redirect, useRouter } from "next/navigation";
import { checkUserLogIn, emailLogIn, oAuthLogIn } from "../../../utils/supabase/authAPI";
import S from "@/style/login/login.module.css";
import Link from "next/link";
import Image from "next/image";
import KakaoLoginIcon from "@/assets/images/join_kakaotalk.svg";
import GoogleLoginIcon from "@/assets/images/join_google.svg";
import GithubLoginIcon from "@/assets/images/join_github.svg";
import FacebookLoginIcon from "@/assets/images/join_facebook.svg";
import Logo from "@/assets/images/logo.svg";
import ErrorMessage from "@/components/logIn/ErrorMessage";
import { Metadata } from "next";

const LogIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState<string[]>([]);
  const router = useRouter();

  const logInHandler = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      await emailLogIn(email, password);
    } catch (error) {
      console.log(error); //NOTE - 테스트 코드
      setErrorMessage(["이메일 또는 비밀번호를 잘못 입력했습니다.", "입력하신 내용을 다시 확인해주세요."]);
      return;
    }
    console.log("로그인 성공"); //NOTE - 테스트 코드

    router.push("/main"); //NOTE - 메인 페이지로 이동
  };

  const emailFocusHandler = () => {
    setErrorMessage([]);
  };

  const passwordFocusHandler = () => {
    setErrorMessage([]);
  };

  const kakaoLogIn = async () => {
    try {
      await oAuthLogIn("kakao");
    } catch (error) {
      setErrorMessage(["카카오 계정을 통한 로그인에 실패했습니다."]);
      return;
    }
  };

  const googleLogIn = async () => {
    try {
      await oAuthLogIn("google");
    } catch (error) {
      setErrorMessage(["구글 계정을 통한 로그인에 실패했습니다."]);
      return;
    }
  };

  const githubLogIn = async () => {
    try {
      await oAuthLogIn("github");
    } catch (error) {
      setErrorMessage(["깃허브 계정을 통한 로그인에 실패했습니다."]);
      return;
    }
  };

  const facebookLogIn = async () => {
    try {
      await oAuthLogIn("facebook");
    } catch (error) {
      setErrorMessage(["페이스북 계정을 통한 로그인에 실패했습니다."]);
      return;
    }
  };

  // useEffect(() => {
  //   const checkUser = async () => {
  //     const isUserLogIn = await checkUserLogIn();

  //     if (isUserLogIn) {
  //       // redirect("/");
  //       // router.push("/"); //TODO - 이 방식은 로그인 페이지가 살짝 보임, URL 접근을 막는 방식 생각하기(ui상 로그인 버튼은 안 보여서 접근 불가능)
  //     }
  //   };
  //   checkUser();
  // }, []);

  return (
    <div className={S.wrapper}>
      <header>
        <Link href="/">
          <Image src={Logo} alt="logo" />
        </Link>
      </header>
      <main className={S.mainWrapper}>
        <form onSubmit={logInHandler}>
          <h2>로그인</h2>
          <div className={S.userform}>
            <p>
              <label htmlFor="email">이메일</label>
              <input
                id="email"
                placeholder="이메일을 입력해주세요."
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
                onFocus={emailFocusHandler}
                required
              />
            </p>
            <p>
              <label htmlFor="password">비밀번호</label>
              <input
                type="password"
                id="password"
                placeholder="비밀번호를 입력해주세요."
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
                onFocus={passwordFocusHandler}
                required
              />
            </p>
            <div className={S.emailSave}>
              <p>
                <input type="checkbox" id="saveEmail" />
                <label htmlFor="saveEmail">이메일 저장</label>
              </p>
              <Link href="/register">회원가입</Link>
            </div>
            {/* <p className={S.error}>
              {errorMessage}
              <span>{secondErrorMessage}</span>
            </p> */}
            <ErrorMessage errorMessage={errorMessage} />
          </div>
          <div className={S.simpleLogin}>
            <h3>간편 로그인하기</h3>
            <ul>
              <li>
                <button type="button" onClick={kakaoLogIn}>
                  <Image src={KakaoLoginIcon} alt="카카오톡 로그인" />
                </button>
              </li>
              <li>
                <button type="button" onClick={googleLogIn}>
                  <Image src={GoogleLoginIcon} alt="구글 로그인" />
                </button>
              </li>
              <li>
                <button type="button" onClick={githubLogIn}>
                  <Image src={GithubLoginIcon} alt="깃허브 로그인" />
                </button>
              </li>
              <li>
                <button type="button" onClick={facebookLogIn}>
                  <Image src={FacebookLoginIcon} alt="페이스북 로그인" />
                </button>
              </li>
            </ul>
          </div>
          <button type="submit" className={S.loginButton}>
            로그인
          </button>
        </form>
      </main>
    </div>
  );
};
//NOTE - 컴포넌트 분리해서 로그인페이지만의 메타데이터 삽입
// export const metadata: Metadata = {
//   title: "IceCraft 로그인페이지",
//   description: "IceCraft 로그인페이지 입니다.",
//   keywords: ["아이스브레이킹", "icebreaking", "마피아", "mafia"],
//   creator: "IceCraft",
//   openGraph: {
//     title: "IceCraft",
//     description: "Into Stunning Space, IceCraft",
//     images: [
//       {
//         url: "/app/favicon.ico",
//         width: 500,
//         height: 400
//       }
//     ],
//     //FIXME - url: '로그인 페이지URL',
//     siteName: "IceCraft",
//     locale: "ko_KR",
//     type: "website"
//   }
// };

export default LogIn;
