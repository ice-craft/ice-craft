import { updateSession } from "@/utils/supabase/middleware";
import { NextResponse, type NextRequest } from "next/server";

// 클라이언트의 요청이 서버에 도착하기 전 또는 응답이 클라이언트에게 전송되기 전에 미들웨어(중간 역할)가 실행됩니다.
export async function middleware(request: NextRequest) {
  const response = await updateSession(request);

  // header에 존재하는 쿠키는 암호화가 되어있어 직접 값에 접근하기 힘들다.
  const loginCookie = response.headers.get("x-middleware-request-cookie");
  const url = request.nextUrl.pathname;

  if (url == "/login" && loginCookie) {
    const url = request.nextUrl.clone();
    url.pathname = "/main";
    return NextResponse.redirect(url);
  }

  if (url == "/register" && loginCookie) {
    const url = request.nextUrl.clone();
    url.pathname = "/main";
    return NextResponse.redirect(url);
  }

  if (url.startsWith("/room") && (!url.endsWith("/") || !loginCookie)) {
    const url = request.nextUrl.clone();
    url.pathname = "/main";
    return NextResponse.redirect(url);
  }
}

// 아래의 경로를 제외한 모든 경로에서 미들웨어를 실행
// 이미지 파일 (svg, png, jpg, jpeg, gif, webp)
export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"]
};
