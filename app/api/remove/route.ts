import { NextResponse } from "next/server";
import { utapi } from "../uploadthing/uploathing";

export async function POST(req: Request) {
  try {
    const { key }: { key: string } = await req.json();

    console.log({ key });

    utapi.deleteFiles([key]);

    return NextResponse.json({ message: "Removed" }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
