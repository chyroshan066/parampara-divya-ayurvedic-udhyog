// import { NextRequest, NextResponse } from "next/server";
// import { getAdminSession } from "@/utils/auth";
// import { sql } from "@/utils/db";

// export async function PATCH(
//   request: NextRequest,
//   { params }: { params: Promise<{ id: string }> }
// ) {
//   const session = await getAdminSession(request);
//   if (!session) {
//     return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//   }

//   const { id } = await params;

//   let body: { isRead?: boolean };
//   try {
//     body = await request.json();
//   } catch {
//     return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
//   }

//   if (typeof body.isRead !== "boolean") {
//     return NextResponse.json({ error: "isRead must be a boolean." }, { status: 400 });
//   }

//   await sql`
//     update contact_messages
//     set is_read = ${body.isRead}
//     where id = ${id}
//   `;

//   return NextResponse.json({ success: true });
// }
























import { NextRequest, NextResponse } from "next/server";
import { getAdminSession } from "@/utils/auth";
import { sql } from "@/utils/db";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getAdminSession(request);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  let body: { isRead?: boolean };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  if (typeof body.isRead !== "boolean") {
    return NextResponse.json({ error: "isRead must be a boolean." }, { status: 400 });
  }

  await sql`
    update contact_messages
    set is_read = ${body.isRead}
    where id = ${id}
  `;

  return NextResponse.json({ success: true });
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getAdminSession(request);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  await sql`
    delete from contact_messages
    where id = ${id}
  `;

  return NextResponse.json({ success: true });
}