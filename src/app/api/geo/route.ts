import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    // 1. Check Cloudflare / Vercel Edge Headers
    const headerCountry =
      req.headers.get("x-vercel-ip-country") ||
      req.headers.get("cf-ipcountry") ||
      req.headers.get("x-country-code");

    if (headerCountry && headerCountry.length === 2) {
      return NextResponse.json({ country: headerCountry.toUpperCase() });
    }

    // 2. Fetch from fast public IP country service
    const clientIp =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      req.headers.get("x-real-ip") ||
      "";

    if (clientIp && !clientIp.startsWith("127.") && !clientIp.startsWith("192.168.") && clientIp !== "::1") {
      const geoRes = await fetch(`https://api.country.is/${clientIp}`, {
        next: { revalidate: 3600 },
        signal: AbortSignal.timeout(2000),
      });

      if (geoRes.ok) {
        const data = await geoRes.json();
        if (data?.country) {
          return NextResponse.json({ country: data.country.toUpperCase() });
        }
      }
    }

    return NextResponse.json({ country: "IN" });
  } catch (err) {
    return NextResponse.json({ country: "IN" });
  }
}
