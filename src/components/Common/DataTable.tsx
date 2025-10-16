import React, { useState } from "react";
import { useTranslation } from "../../hooks/useTranslation";
import {
  ChevronUp,
  ChevronDown,
  Search,
  Plus,
  Edit2,
  Trash2,
} from "lucide-react";

interface Column<T> {
  key: keyof T;
  label: string;
  sortable?: boolean;
  render?: (value: any, row: T) => React.ReactNode;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  onAdd?: () => void;
  onEdit?: (item: T) => void;
  onDelete?: (item: T) => void;
  loading?: boolean;
  searchPlaceholder?: string;
  addButtonText?: string;
  customActions?: (item: T) => React.ReactNode;
}

const DataTable = <T extends { id: string }>({
  data,
  columns,
  onAdd,
  onEdit,
  onDelete,
  loading = false,
  searchPlaceholder,
  addButtonText,
  customActions,
}: DataTableProps<T>) => {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState<{
    key: keyof T;
    direction: "asc" | "desc";
  } | null>(null);

  // Set default values for translations
  const finalSearchPlaceholder = searchPlaceholder || t("search");
  const finalAddButtonText = addButtonText || t("add");

  const handleSort = (key: keyof T) => {
    let direction: "asc" | "desc" = "asc";
    if (
      sortConfig &&
      sortConfig.key === key &&
      sortConfig.direction === "asc"
    ) {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const sortedData = React.useMemo(() => {
    let sortableItems = [...data];
    if (sortConfig !== null) {
      sortableItems.sort((a, b) => {
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];

        if (aValue < bValue) {
          return sortConfig.direction === "asc" ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === "asc" ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableItems;
  }, [data, sortConfig]);

  const filteredData = React.useMemo(() => {
    if (!searchTerm) return sortedData;

    return sortedData.filter((item) =>
      Object.values(item).some((value) =>
        String(value).toLowerCase().includes(searchTerm.toLowerCase()),
      ),
    );
  }, [sortedData, searchTerm]);

  if (loading) {
    return (
      <div className="bg-white    shadow-lg border border-suva-grey-25">
        <div className="px-6 py-4 border-b border-suva-grey-25">
          <div className="flex justify-between items-center">
            <div className="h-8 bg-suva-grey-50   w-48 animate-pulse"></div>
            <div className="h-10 bg-suva-grey-50   w-32 animate-pulse"></div>
          </div>
        </div>
        <div className="p-6">
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="h-12 bg-suva-grey-25   animate-pulse"
              ></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white    shadow-lg border border-suva-grey-25">
      <div className="px-6 py-4 border-b border-suva-grey-25">
        <div className="flex justify-between items-center">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-suva-grey-50" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-suva-grey-25    leading-5 bg-white placeholder-suva-grey-50 focus:outline-none focus:placeholder-suva-grey-75 focus:ring-1 focus:ring-suva-blue-100 focus:border-suva-blue-100 sm:text-sm"
              placeholder={finalSearchPlaceholder}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          {onAdd && (
            <button
              onClick={onAdd}
              className="rounded-full inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium    shadow-lg text-white bg-suva-blue-100 hover:bg-suva-interaction-blue focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-suva-blue-100 transition-colors duration-200"
            >
              <Plus className="h-4 w-4 mr-2" />
              {finalAddButtonText}
            </button>
          )}
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-suva-grey-25">
          <thead className="bg-suva-bg-grey">
            <tr>
              {columns.map((column) => (
                <th
                  key={String(column.key)}
                  className={`px-6 py-3 text-left text-xs font-medium text-suva-grey-75 uppercase tracking-wider ${
                    column.sortable
                      ? "cursor-pointer hover:bg-suva-grey-25"
                      : ""
                  }`}
                  onClick={() => column.sortable && handleSort(column.key)}
                >
                  <div className="flex items-center space-x-1">
                    <span>{column.label}</span>
                    {column.sortable && (
                      <div className="flex flex-col">
                        <ChevronUp
                          className={`h-3 w-3 ${
                            sortConfig?.key === column.key &&
                            sortConfig.direction === "asc"
                              ? "text-suva-blue-100"
                              : "text-suva-grey-50"
                          }`}
                        />
                        <ChevronDown
                          className={`h-3 w-3 -mt-1 ${
                            sortConfig?.key === column.key &&
                            sortConfig.direction === "desc"
                              ? "text-suva-blue-100"
                              : "text-suva-grey-50"
                          }`}
                        />
                      </div>
                    )}
                  </div>
                </th>
              ))}
              {(onEdit || onDelete || customActions) && (
                <th className="px-6 py-3 text-right text-xs font-medium text-suva-grey-75 uppercase tracking-wider">
                  {t("actions")}
                </th>
              )}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-suva-grey-25">
            {filteredData.map((item, index) => (
              <tr
                key={item.id}
                className={`hover:bg-suva-bg-grey transition-colors duration-200 ${
                  index % 2 === 0 ? "bg-white" : "bg-suva-grey-25/30"
                }`}
              >
                {columns.map((column) => (
                  <td
                    key={String(column.key)}
                    className="px-6 py-4 whitespace-nowrap text-sm text-suva-grey-100"
                  >
                    {column.render
                      ? column.render(item[column.key], item)
                      : String(item[column.key])}
                  </td>
                ))}
                {(onEdit || onDelete || customActions) && (
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-2">
                      {customActions && customActions(item)}
                      {onEdit && (
                        <button
                          onClick={() => onEdit(item)}
                          className="rounded-full text-suva-blue-100 hover:text-suva-interaction-blue transition-colors duration-200"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                      )}
                      {onDelete && (
                        <button
                          onClick={() => onDelete(item)}
                          className="rounded-full text-error hover:text-suva-red-accent transition-colors duration-200"
                        >
                          <Trash2 className="h-4 w-4 text-suva-negative" />
                        </button>
                      )}
                    </div>
                  </td>
                )}
              </tr>
            ))}
            {filteredData.length === 0 && (
              <tr>
                <td
                  colSpan={columns.length + (onEdit || onDelete || customActions ? 1 : 0)}
                  className="px-6 py-12 text-center text-suva-grey-75"
                >
                  {searchTerm ? "No results found" : "No data available"}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DataTable;
