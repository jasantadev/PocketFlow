"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/src/lib/supabase/server";
import { isMovementType, parseAmountInput } from "@/src/lib/finance/validation";
import type { MovementType } from "@/src/lib/finance/types";

const DASHBOARD = "/dashboard";

function q(msg: string) {
  return encodeURIComponent(msg);
}

export async function ensureDefaultCategory() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return;
  }

  const { count, error: countError } = await supabase
    .from("categories")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user.id);

  if (countError) {
    throw new Error(countError.message);
  }

  if (count === 0) {
    const { error } = await supabase.from("categories").insert({
      user_id: user.id,
      title: "General",
      description: null,
      monthly_budget: null,
    });
    if (error) {
      throw new Error(error.message);
    }
  }
}

export async function createCategory(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    redirect("/login");
  }

  const title = String(formData.get("title") ?? "").trim();
  if (!title) {
    redirect(`${DASHBOARD}?categoryError=${q("El título es obligatorio")}`);
  }

  const descRaw = formData.get("description");
  const description =
    typeof descRaw === "string" && descRaw.trim() !== ""
      ? descRaw.trim()
      : null;

  const budgetRaw = formData.get("monthly_budget");
  let monthly_budget: number | null = null;
  if (typeof budgetRaw === "string" && budgetRaw.trim() !== "") {
    const b = parseAmountInput(budgetRaw);
    if (b === null) {
      redirect(`${DASHBOARD}?categoryError=${q("Presupuesto mensual no válido")}`);
    }
    monthly_budget = b;
  }

  const { error } = await supabase.from("categories").insert({
    user_id: user.id,
    title,
    description,
    monthly_budget,
  });

  if (error) {
    redirect(`${DASHBOARD}?categoryError=${q(error.message)}`);
  }

  revalidatePath(DASHBOARD);
  redirect(DASHBOARD);
}

export async function updateCategory(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    redirect("/login");
  }

  const id = String(formData.get("id") ?? "");
  if (!id) {
    redirect(`${DASHBOARD}?categoryError=${q("Categoría no válida")}`);
  }

  const title = String(formData.get("title") ?? "").trim();
  if (!title) {
    redirect(`${DASHBOARD}?categoryError=${q("El título es obligatorio")}`);
  }

  const descRaw = formData.get("description");
  const description =
    typeof descRaw === "string" && descRaw.trim() !== ""
      ? descRaw.trim()
      : null;

  const budgetRaw = formData.get("monthly_budget");
  let monthly_budget: number | null = null;
  if (typeof budgetRaw === "string" && budgetRaw.trim() !== "") {
    const b = parseAmountInput(budgetRaw);
    if (b === null) {
      redirect(`${DASHBOARD}?categoryError=${q("Presupuesto mensual no válido")}`);
    }
    monthly_budget = b;
  }

  const { error } = await supabase
    .from("categories")
    .update({
      title,
      description,
      monthly_budget,
    })
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) {
    redirect(`${DASHBOARD}?categoryError=${q(error.message)}`);
  }

  revalidatePath(DASHBOARD);
  redirect(DASHBOARD);
}

export async function deleteCategory(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    redirect("/login");
  }

  const id = String(formData.get("id") ?? "");
  if (!id) {
    redirect(`${DASHBOARD}?categoryError=${q("Categoría no válida")}`);
  }

  const { error } = await supabase
    .from("categories")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) {
    if (error.code === "23503" || error.message.includes("foreign key")) {
      redirect(
        `${DASHBOARD}?categoryError=${q(
          "No se puede eliminar: hay movimientos usando esta categoría",
        )}`,
      );
    }
    redirect(`${DASHBOARD}?categoryError=${q(error.message)}`);
  }

  revalidatePath(DASHBOARD);
  redirect(DASHBOARD);
}

export async function saveMovement(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    redirect("/login");
  }

  const id = String(formData.get("id") ?? "").trim();
  const typeRaw = String(formData.get("type") ?? "");
  const categoryId = String(formData.get("category_id") ?? "").trim();
  const amountRaw = String(formData.get("amount") ?? "");
  const occurredRaw = String(formData.get("occurred_on") ?? "");
  const descRaw = formData.get("description");
  const description =
    typeof descRaw === "string" && descRaw.trim() !== ""
      ? descRaw.trim()
      : null;

  if (!isMovementType(typeRaw)) {
    redirect(`${DASHBOARD}?movementError=${q("Tipo de movimiento no válido")}`);
  }
  const type: MovementType = typeRaw;

  if (!categoryId) {
    redirect(`${DASHBOARD}?movementError=${q("Selecciona una categoría")}`);
  }

  const amount = parseAmountInput(amountRaw);
  if (amount === null) {
    redirect(`${DASHBOARD}?movementError=${q("Importe no válido (debe ser > 0)")}`);
  }

  if (!/^\d{4}-\d{2}-\d{2}$/.test(occurredRaw)) {
    redirect(`${DASHBOARD}?movementError=${q("Fecha no válida")}`);
  }

  const insertPayload = {
    user_id: user.id,
    category_id: categoryId,
    type,
    amount,
    occurred_on: occurredRaw,
    description,
  };

  if (id) {
    const { error } = await supabase
      .from("movements")
      .update({
        category_id: categoryId,
        type,
        amount,
        occurred_on: occurredRaw,
        description,
      })
      .eq("id", id)
      .eq("user_id", user.id);

    if (error) {
      redirect(`${DASHBOARD}?movementError=${q(error.message)}`);
    }
  } else {
    const { error } = await supabase.from("movements").insert(insertPayload);

    if (error) {
      redirect(`${DASHBOARD}?movementError=${q(error.message)}`);
    }
  }

  revalidatePath(DASHBOARD);
  redirect(DASHBOARD);
}

export async function deleteMovement(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    redirect("/login");
  }

  const id = String(formData.get("id") ?? "");
  if (!id) {
    redirect(`${DASHBOARD}?movementError=${q("Movimiento no válido")}`);
  }

  const { error } = await supabase
    .from("movements")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) {
    redirect(`${DASHBOARD}?movementError=${q(error.message)}`);
  }

  revalidatePath(DASHBOARD);
  redirect(DASHBOARD);
}
