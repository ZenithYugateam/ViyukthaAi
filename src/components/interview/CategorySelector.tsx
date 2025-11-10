import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface CategorySelectorProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  disabled?: boolean;
}

export const CategorySelector = ({ selectedCategory, onCategoryChange, disabled }: CategorySelectorProps) => {
  const categories = [
    { value: "general", label: "General Interview" },
    { value: "java", label: "Java Developer" },
    { value: "python", label: "Python Developer" },
    { value: "javascript", label: "JavaScript Developer" },
    { value: "sql", label: "SQL & Databases" },
    { value: "react", label: "React Developer" },
    { value: "fullstack", label: "Full Stack Developer" },
  ];

  return (
    <div className="mb-2 md:mb-4">
      <Select value={selectedCategory} onValueChange={onCategoryChange} disabled={disabled}>
        <SelectTrigger className="w-full md:max-w-xs bg-card border-border text-sm md:text-base h-10 md:h-11">
          <SelectValue placeholder="Select interview category" />
        </SelectTrigger>
        <SelectContent>
          {categories.map((category) => (
            <SelectItem key={category.value} value={category.value}>
              {category.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
