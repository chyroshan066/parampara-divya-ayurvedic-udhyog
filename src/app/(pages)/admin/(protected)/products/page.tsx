import { sql } from "@/utils/db";
import { ProductsManager } from "@/components/admin/ProductsManager";
import type { Product } from "@/types/product";

export default async function AdminProductsPage() {
  const products = (await sql`
    select id, name, description, image_url, image_public_id, price, created_at, updated_at
    from products
    order by created_at desc
  `) as unknown as Product[];

  return (
    <div>
      <h1 className="tw:text-slate-800 tw:text-3xl tw:font-bold tw:mb-2">Products</h1>
      <p className="tw:text-slate-800/60 tw:text-sm tw:mb-10">
        Add, edit, or remove the products shown on your storefront.
      </p>

      <ProductsManager initialProducts={products} />
    </div>
  );
}