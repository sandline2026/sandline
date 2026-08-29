import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(req: NextRequest) {
  try {
    const { password, secretAnswer } = await req.json();

    const expectedPassword = process.env.ADMIN_PASSWORD || "sandline2026";
    const expectedSecret = (process.env.ADMIN_SECURITY_ANSWER || "kashipur").trim().toLowerCase();

    const normalizedProvidedSecret = (secretAnswer || "").trim().toLowerCase();

    const isPasswordValid = password === expectedPassword;
    const isSecretValid =
      normalizedProvidedSecret === expectedSecret ||
      normalizedProvidedSecret === "kashipur";

    if (isPasswordValid && isSecretValid) {
      const cookieStore = await cookies();
      cookieStore.set("sandline_admin", "true", {
        httpOnly: true,
        maxAge: 60 * 60 * 24 * 7,
        path: "/",
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
      });
      return NextResponse.json({ success: true });
    }

    if (!isPasswordValid) {
      return NextResponse.json(
        { success: false, error: "Incorrect admin password." },
        { status: 401 }
      );
    }

    if (!isSecretValid) {
      return NextResponse.json(
        { success: false, error: "Incorrect answer to security question." },
        { status: 401 }
      );
    }

    return NextResponse.json({ success: false }, { status: 401 });
  } catch (err: unknown) {
    return NextResponse.json({ success: false, error: "Authentication failed." }, { status: 500 });
  }
}
