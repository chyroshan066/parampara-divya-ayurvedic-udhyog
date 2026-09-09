import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { sql } from "@/utils/db";
import { getAdminSession } from "@/utils/auth";
import { ORDER_STATUSES } from "@/constants/order-status";

const updateStatusSchema = z.object({
  status: z.enum(ORDER_STATUSES),
});

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ orderId: string }> }
) {
  // getAdminSession reads the cookie straight off the request and is
  // the helper meant for /api/admin/* routes specifically — it returns
  // a clean 401 JSON on failure rather than the HTML redirect that page
  // middleware would produce.
  const session = await getAdminSession(request);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { orderId } = await params;

  const body = await request.json().catch(() => null);
  const parsed = updateStatusSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Please provide a valid status." },
      { status: 400 }
    );
  }

  const [updated] = await sql`
    update orders
    set status = ${parsed.data.status}
    where id = ${orderId}
    returning id, status
  `;

  if (!updated) {
    return NextResponse.json({ error: "Order not found." }, { status: 404 });
  }

  return NextResponse.json({ success: true, status: updated.status });
}