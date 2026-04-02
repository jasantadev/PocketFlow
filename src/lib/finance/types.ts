export type MovementType = "income" | "expense";

export type CategoryRow = {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  monthly_budget: string | null;
  created_at: string;
};

export type MovementRow = {
  id: string;
  user_id: string;
  category_id: string;
  type: MovementType;
  amount: string;
  occurred_on: string;
  description: string | null;
  created_at: string;
};

export type MovementWithCategory = MovementRow & {
  category_title: string;
};
