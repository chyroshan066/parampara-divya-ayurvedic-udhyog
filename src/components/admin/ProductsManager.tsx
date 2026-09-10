"use client";

import { useRef, useState } from "react";
import { Plus, PencilSimple, Trash, X } from "@phosphor-icons/react";
import { Toast, type ToastType } from "@/components/Toast";
import type { Product } from "@/types/product";

interface ProductsManagerProps {
  initialProducts: Product[];
}

interface ToastState {
  type: ToastType;
  message: string;
}

interface FormState {
  name: string;
  description: string;
  price: string;
}

const EMPTY_FORM: FormState = { name: "", description: "", price: "" };

export function ProductsManager({ initialProducts }: ProductsManagerProps) {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [toast, setToast] = useState<ToastState | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const openAddModal = () => {
    setEditingProduct(null);
    setForm(EMPTY_FORM);
    setImageFile(null);
    setImagePreview(null);
    setFormError(null);
    setIsModalOpen(true);
  };

  const openEditModal = (product: Product) => {
    setEditingProduct(product);
    setForm({
      name: product.name,
      description: product.description ?? "",
      price: product.price,
    });
    setImageFile(null);
    setImagePreview(product.image_url);
    setFormError(null);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    if (isSaving) return;
    setIsModalOpen(false);
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null;
    setImageFile(file);
    if (file) {
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setFormError(null);

    if (!form.name.trim()) {
      setFormError("Product name is required.");
      return;
    }
    const priceNumber = Number(form.price);
    if (!Number.isFinite(priceNumber) || priceNumber <= 0) {
      setFormError("Please enter a valid price.");
      return;
    }
    if (!editingProduct && !imageFile) {
      setFormError("Please upload a product image.");
      return;
    }

    // FormData, not JSON — the file has to ride along with the text
    // fields. Deliberately no Content-Type header here: the browser
    // sets multipart/form-data with the correct boundary itself.
    const body = new FormData();
    body.set("name", form.name.trim());
    body.set("description", form.description.trim());
    body.set("price", form.price);
    if (imageFile) {
      body.set("image", imageFile);
    }

    setIsSaving(true);
    try {
      const res = await fetch(
        editingProduct
          ? `/api/admin/products/${editingProduct.id}`
          : "/api/admin/products",
        {
          method: editingProduct ? "PATCH" : "POST",
          body,
        }
      );
      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setFormError(data.error || "Something went wrong. Please try again.");
        return;
      }

      if (editingProduct) {
        setProducts((prev) =>
          prev.map((product) =>
            product.id === data.product.id ? data.product : product
          )
        );
        setToast({ type: "success", message: "Product updated." });
      } else {
        setProducts((prev) => [data.product, ...prev]);
        setToast({ type: "success", message: "Product added." });
      }
      setIsModalOpen(false);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (product: Product) => {
    if (!confirm(`Delete "${product.name}"? This can't be undone.`)) return;

    setDeletingId(product.id);
    try {
      const res = await fetch(`/api/admin/products/${product.id}`, {
        method: "DELETE",
      });
      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setToast({
          type: "error",
          message: data.error || "Couldn't delete this product.",
        });
        return;
      }

      setProducts((prev) => prev.filter((p) => p.id !== product.id));
      setToast({ type: "success", message: "Product deleted." });
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div>
      <div className="tw:flex tw:justify-end tw:mb-6">
        <button
          type="button"
          onClick={openAddModal}
          className="tw:flex tw:items-center tw:gap-x-2 tw:bg-primary tw:text-white tw:font-bold tw:text-sm tw:px-5 tw:py-2.5 tw:rounded-full tw:hover:opacity-90 tw:transition-opacity"
        >
          <Plus className="tw:w-4 tw:h-4" weight="bold" />
          Add Product
        </button>
      </div>

      {products.length === 0 ? (
        <div className="tw:bg-white tw:rounded-3xl tw:border tw:border-gray-100 tw:p-10 tw:text-center tw:text-slate-800/60">
          No products yet — add your first one to show it on the storefront.
        </div>
      ) : (
        <div className="tw:grid tw:grid-cols-1 tw:sm:grid-cols-2 tw:lg:grid-cols-3 tw:gap-5">
          {products.map((product) => (
            <div
              key={product.id}
              className="tw:bg-white tw:rounded-3xl tw:border tw:border-gray-100 tw:overflow-hidden tw:flex tw:flex-col"
            >
              <div className="tw:h-56 tw:w-full tw:bg-gray-50 tw:overflow-hidden">
                {product.image_url && (
                  <img
                    src={product.image_url}
                    alt={product.name}
                    className="tw:w-full tw:h-full tw:object-cover tw:block"
                  />
                )}
              </div>
              <div className="tw:p-4 tw:flex tw:flex-col tw:flex-1">
                <p className="tw:font-bold tw:text-slate-800">{product.name}</p>
                <p className="tw:text-primary tw:font-bold tw:text-sm tw:mt-1">
                  Rs. {product.price}
                </p>
                {product.description && (
                  <p className="tw:text-xs tw:text-slate-800/60 tw:mt-2 tw:truncate">
                    {product.description}
                  </p>
                )}
                <div className="tw:flex tw:items-center tw:gap-x-2 tw:mt-4">
                  <button
                    type="button"
                    onClick={() => openEditModal(product)}
                    className="tw:flex tw:items-center tw:justify-center tw:gap-x-1.5 tw:flex-1 tw:text-xs tw:font-bold tw:text-slate-600 tw:bg-gray-100 tw:rounded-full tw:py-2 tw:hover:bg-gray-200 tw:transition-colors"
                  >
                    <PencilSimple className="tw:w-3.5 tw:h-3.5" weight="bold" />
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(product)}
                    disabled={deletingId === product.id}
                    className="tw:flex tw:items-center tw:justify-center tw:gap-x-1.5 tw:flex-1 tw:text-xs tw:font-bold tw:text-red-600 tw:bg-red-50 tw:rounded-full tw:py-2 tw:hover:bg-red-100 tw:transition-colors tw:disabled:opacity-50"
                  >
                    <Trash className="tw:w-3.5 tw:h-3.5" weight="bold" />
                    {deletingId === product.id ? "Deleting..." : "Delete"}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {isModalOpen && (
        <div
          className="tw:fixed tw:inset-0 tw:bg-black/40 tw:z-50 tw:flex tw:items-center tw:justify-center tw:p-4"
          onClick={closeModal}
        >
          <div
            className="tw:bg-white tw:rounded-3xl tw:w-full tw:max-w-md tw:max-h-[90vh] tw:overflow-y-auto tw:p-6 ayur-modal-scroll"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="tw:flex tw:items-center tw:justify-between tw:mb-6">
              <h2 className="tw:text-xl tw:font-bold tw:text-slate-800">
                {editingProduct ? "Edit Product" : "Add Product"}
              </h2>
              <button
                type="button"
                onClick={closeModal}
                className="tw:flex tw:items-center tw:justify-center tw:w-8 tw:h-8 tw:bg-transparent tw:border-0 tw:p-0 tw:text-slate-400 tw:transition-colors tw:hover:text-slate-600"
                aria-label="Close"
              >
                <X className="tw:w-5 tw:h-5" weight="bold" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="tw:flex tw:flex-col tw:gap-y-4">
              <div>
                <label className="tw:block tw:text-xs tw:font-bold tw:text-slate-600 tw:mb-1.5">
                  Name
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(event) =>
                    setForm((prev) => ({ ...prev, name: event.target.value }))
                  }
                  className="tw:w-full tw:border tw:border-gray-200 tw:rounded-xl tw:px-4 tw:py-2.5 tw:text-sm tw:text-slate-800 tw:placeholder-gray-400"
                  placeholder="e.g. Chyawanprash"
                />
              </div>

              <div>
                <label className="tw:block tw:text-xs tw:font-bold tw:text-slate-600 tw:mb-1.5">
                  Description{" "}
                  <span className="tw:font-normal tw:text-slate-400">
                    (optional)
                  </span>
                </label>
                <textarea
                  value={form.description}
                  onChange={(event) =>
                    setForm((prev) => ({
                      ...prev,
                      description: event.target.value,
                    }))
                  }
                  rows={3}
                  className="tw:w-full tw:border tw:border-gray-200 tw:rounded-xl tw:px-4 tw:py-2.5 tw:text-sm tw:text-slate-800 tw:placeholder-gray-400 tw:resize-none"
                  placeholder="Short description shown to customers"
                />
              </div>

              <div>
                <label className="tw:block tw:text-xs tw:font-bold tw:text-slate-600 tw:mb-1.5">
                  Price (Rs.)
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={form.price}
                  onChange={(event) =>
                    setForm((prev) => ({ ...prev, price: event.target.value }))
                  }
                  className="tw:w-full tw:border tw:border-gray-200 tw:rounded-xl tw:px-4 tw:py-2.5 tw:text-sm tw:text-slate-800 tw:placeholder-gray-400"
                  placeholder="450"
                />
              </div>

              <div>
                <label className="tw:block tw:text-xs tw:font-bold tw:text-slate-600 tw:mb-1.5">
                  Image{" "}
                  {editingProduct && (
                    <span className="tw:font-normal tw:text-slate-400">
                      (leave empty to keep current)
                    </span>
                  )}
                </label>
                {imagePreview && (
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="tw:w-24 tw:h-24 tw:object-cover tw:rounded-xl tw:mb-2 tw:border tw:border-gray-100"
                  />
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleImageChange}
                  className="tw:block tw:w-full tw:text-sm tw:text-slate-600 tw:cursor-pointer tw:file:mr-4 tw:file:cursor-pointer tw:file:rounded-full tw:file:border-0 tw:file:bg-primary/10 tw:file:px-4 tw:file:py-2 tw:file:text-sm tw:file:font-bold tw:file:text-primary tw:hover:file:bg-primary/20"
                />
              </div>

              {formError && <p className="tw:text-sm tw:text-red-600">{formError}</p>}

              <button
                type="submit"
                disabled={isSaving}
                className="tw:bg-primary tw:text-white tw:font-bold tw:text-sm tw:rounded-full tw:py-3 tw:mt-2 tw:hover:opacity-90 tw:transition-opacity tw:disabled:opacity-50"
              >
                {isSaving
                  ? "Saving..."
                  : editingProduct
                  ? "Save Changes"
                  : "Add Product"}
              </button>
            </form>
          </div>
        </div>
      )}

      {toast && (
        <Toast
          type={toast.type}
          message={toast.message}
          position="bottom-right"
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}