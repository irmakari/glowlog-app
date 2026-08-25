export interface CategoryFilterChipItem {
  id: string;
  label: string;
  count: number;
}

export interface CategoryFilterChipsProps {
  categories: CategoryFilterChipItem[];
  selectedCategory: string;
  onSelectCategory: (categoryId: string) => void;
}
