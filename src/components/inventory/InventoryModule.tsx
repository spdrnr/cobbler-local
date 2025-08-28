import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Plus,
  Search,
  AlertTriangle,
  Package,
  TrendingDown,
  X,
  Edit,
  ShoppingCart,
  Trash2,
  User,
  Calendar,
  History,
} from "lucide-react";


interface UpdateHistory {
  date: string;
  updatedBy: string;
  action: "Created" | "Updated";
  quantityChange: number;
  newQuantity: number;
}

interface InventoryItem {
  id: number;
  name: string;
  category: string;
  quantity: number;
  minStock: number;
  unit: string;
  purchasePrice: number;
  sellingPrice: number;
  lastUpdated: string;
  lastUpdatedBy?: string;
  history: UpdateHistory[];
}

interface FormData {
  name: string;
  category: string;
  unit: string;
  quantity: string;
  purchasePrice: string;
  sellingPrice: string;
}

// Step 1: Removed static data - no sampleInventory array

const STORAGE_KEY = "inventory_data";

export default function InventoryManager() {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);
  const [showUpdateForm, setShowUpdateForm] = useState(false);
  const [updateQuantity, setUpdateQuantity] = useState("");
  const [updaterName, setUpdaterName] = useState("");
  const [showHistoryModal, setShowHistoryModal] = useState<InventoryItem | null>(null);
  const [formData, setFormData] = useState<FormData>({
    name: "",
    category: "",
    unit: "",
    quantity: "",
    purchasePrice: "",
    sellingPrice: "",
  });

  // Step 1: Modified to start with empty inventory instead of sample data
  useEffect(() => {
    const savedInventory = localStorage.getItem(STORAGE_KEY);
    if (savedInventory) {
      try {
        setInventory(JSON.parse(savedInventory));
      } catch (error) {
        console.error("Error loading inventory from localStorage:", error);
        setInventory([]); // Empty array instead of sampleInventory
      }
    } else {
      setInventory([]); // Empty array instead of sampleInventory
    }
  }, []);

  // Save to localStorage whenever inventory changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(inventory));
  }, [inventory]);

  const lowStockItems = inventory.filter(
    (item) => item.quantity <= item.minStock
  );
  const totalItems = inventory.length;
  const totalQuantity = inventory.reduce((sum, item) => sum + item.quantity, 0);
  const wellStockedItems = inventory.length - lowStockItems.length;

  const filteredInventory = inventory.filter(
    (item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStockStatus = (item: InventoryItem) => {
    if (item.quantity <= item.minStock) {
      return { status: "Low Stock", color: "bg-red-500 text-white" };
    }
    if (item.quantity <= item.minStock * 1.5) {
      return { status: "Medium", color: "bg-yellow-500 text-white" };
    }
    return { status: "Good", color: "bg-green-500 text-white" };
  };

  const getCurrentDate = () => {
    return new Date().toISOString().split("T")[0];
  };

  const resetForm = () => {
    setFormData({
      name: "",
      category: "",
      unit: "",
      quantity: "",
      purchasePrice: "",
      sellingPrice: "",
    });
  };

  const handleAddItem = () => {
    if (
      !formData.name ||
      !formData.category ||
      !formData.unit ||
      !formData.quantity ||
      !formData.purchasePrice ||
      !formData.sellingPrice
    ) {
      alert("Please fill in all required fields");
      return;
    }

    const newQuantity = parseInt(formData.quantity);
    const newItem: InventoryItem = {
      id: Date.now(),
      name: formData.name,
      category: formData.category,
      unit: formData.unit,
      quantity: newQuantity,
      minStock: 5, // Default min stock
      purchasePrice: parseFloat(formData.purchasePrice),
      sellingPrice: parseFloat(formData.sellingPrice),
      lastUpdated: getCurrentDate(),
      lastUpdatedBy: "System",
      history: [
        {
          date: getCurrentDate(),
          updatedBy: "System",
          action: "Created",
          quantityChange: newQuantity,
          newQuantity: newQuantity,
        },
      ],
    };

    setInventory((prev) => [...prev, newItem]);
    resetForm();
    setShowAddForm(false);
  };

  const checkStockAlert = (item: InventoryItem) => {
    if (item.quantity < item.minStock) {
      alert(
        `⚠️ LOW STOCK ALERT!\n\nItem: ${item.name}\nCurrent Stock: ${item.quantity} ${item.unit}\nMinimum Required: ${item.minStock} ${item.unit}\n\nPlease restock soon!`
      );
    }
  };

  // Step 2: Fixed update functionality
  const handleUpdateStock = (item: InventoryItem, newQuantity: number) => {
    if (!updaterName.trim()) {
      alert("Please provide the name of the person updating the stock.");
      return;
    }
    const oldQuantity = item.quantity;
    const quantityChange = newQuantity - oldQuantity;

    setInventory((prev) =>
      prev.map((invItem) =>
        invItem.id === item.id
          ? {
              ...invItem,
              quantity: newQuantity,
              lastUpdated: getCurrentDate(),
              lastUpdatedBy: updaterName,
              history: [
                ...(invItem.history || []),
                {
                  date: getCurrentDate(),
                  updatedBy: updaterName,
                  action: "Updated",
                  quantityChange: quantityChange,
                  newQuantity: newQuantity,
                },
              ],
            }
          : invItem
      )
    );

    checkStockAlert({ ...item, quantity: newQuantity });
    setEditingItem(null);
    setShowUpdateForm(false);
    setUpdateQuantity("");
    setUpdaterName("");
  };

  // Step 2: Fixed restock functionality
  const handleRestock = (item: InventoryItem, additionalQuantity: number) => {
    if (additionalQuantity <= 0) {
      alert("Please enter a valid quantity to add");
      return;
    }
    if (!updaterName.trim()) {
      alert("Please provide the name of the person updating the stock.");
      return;
    }

    setInventory((prev) =>
      prev.map((invItem) =>
        invItem.id === item.id
          ? {
              ...invItem,
              quantity: invItem.quantity + additionalQuantity,
              lastUpdated: getCurrentDate(),
              lastUpdatedBy: updaterName,
            }
          : invItem
      )
    );
    setEditingItem(null);
    setShowUpdateForm(false);
    setUpdateQuantity("");
    setUpdaterName("");
  };

  // Step 4: Added delete functionality
  const handleDeleteItem = (id: number, name: string) => {
    if (confirm(`Are you sure you want to delete "${name}"?`)) {
      setInventory((prev) => prev.filter((item) => item.id !== id));
    }
  };

  const handleFormChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const openUpdateForm = (item: InventoryItem) => {
    setEditingItem(item);
    setShowUpdateForm(true);
    setUpdateQuantity(item.quantity.toString());
  };

  // Step 3: Function to check if restock should be disabled when stock >= 5
  const isRestockDisabled = (quantity: number) => {
    return quantity >= 5;
  };

  return (
    <div className="space-y-4 sm:space-y-6 animate-fade-in p-2 sm:p-0 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Inventory Management
          </h1>
          <p className="text-sm sm:text-base text-gray-600">
            Track materials and stock levels
          </p>
        </div>
        <Button
          onClick={() => setShowAddForm(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white w-full sm:w-auto"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Item
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <Card className="p-3 sm:p-4 bg-white border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-lg sm:text-2xl font-bold text-gray-900">
                {totalItems}
              </div>
              <div className="text-xs sm:text-sm text-gray-600">
                Total Items
              </div>
            </div>
            <Package className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600" />
          </div>
        </Card>
        <Card className="p-3 sm:p-4 bg-white border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-lg sm:text-2xl font-bold text-gray-900">
                {totalQuantity}
              </div>
              <div className="text-xs sm:text-sm text-gray-600">
                Total Quantity
              </div>
            </div>
            <TrendingDown className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600" />
          </div>
        </Card>
        <Card className="p-3 sm:p-4 bg-white border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-lg sm:text-2xl font-bold text-red-600">
                {lowStockItems.length}
              </div>
              <div className="text-xs sm:text-sm text-gray-600">
                Low Stock Alerts
              </div>
            </div>
            <AlertTriangle className="h-6 w-6 sm:h-8 sm:w-8 text-red-600" />
          </div>
        </Card>
        <Card className="p-3 sm:p-4 bg-white border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-lg sm:text-2xl font-bold text-green-600">
                {wellStockedItems}
              </div>
              <div className="text-xs sm:text-sm text-gray-600">
                Well Stocked
              </div>
            </div>
            <Package className="h-6 w-6 sm:h-8 sm:w-8 text-green-600" />
          </div>
        </Card>
      </div>

      {/* Low Stock Alerts */}
      {lowStockItems.length > 0 && (
        <Card className="p-3 sm:p-4 bg-red-50 border border-red-200">
          <div className="flex items-center space-x-2 mb-3">
            <AlertTriangle className="h-4 w-4 sm:h-5 sm:w-5 text-red-600" />
            <h3 className="font-semibold text-red-800 text-sm sm:text-base">
              Low Stock Alerts
            </h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {lowStockItems.map((item) => (
              <div key={item.id} className="text-xs sm:text-sm text-red-800">
                <span className="font-medium">{item.name}</span> - Only{" "}
                {item.quantity} {item.unit} left
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Search */}
      <Card className="p-3 sm:p-4 bg-white border border-gray-200 shadow-sm">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search inventory..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 border-gray-300"
          />
        </div>
      </Card>

      {/* Add Item Form Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900">
                  Add New Item
                </h2>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setShowAddForm(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Item Name <span className="text-red-500">*</span>
                  </label>
                  <Input
                    value={formData.name}
                    onChange={(e) => {
                      const value = e.target.value;
                      // Allow only letters, spaces, and basic punctuation
                      if (/^[A-Za-z\s]*$/.test(value)) {
                        handleFormChange("name", value);
                      }
                    }}
                    placeholder="e.g., Leather Polish"
                    required
                  />
                  {formData.name && !/^[A-Za-z\s]+$/.test(formData.name) && (
                    <p className="text-red-500 text-sm mt-1">
                      Item name should not contain numbers.
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category <span className="text-red-500">*</span>
                  </label>
                  <Input
                    value={formData.category}
                    onChange={(e) => {
                      const value = e.target.value;
                      // Allow only letters, spaces, commas and basic punctuation
                      if (/^[A-Za-z\s,]*$/.test(value)) {
                        handleFormChange("category", value);
                      }
                    }}
                    placeholder="e.g., Polish, Soles, Thread"
                    required
                  />
                  {formData.category &&
                    !/^[A-Za-z\s,]+$/.test(formData.category) && (
                      <p className="text-red-500 text-sm mt-1">
                        Category should not contain numbers.
                      </p>
                    )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Unit Type <span className="text-red-500">*</span>
                  </label>
                  <Input
                    value={formData.unit}
                    onChange={(e) => {
                      const value = e.target.value;
                      // Allow only letters, spaces, commas
                      if (/^[A-Za-z\s,]*$/.test(value)) {
                        handleFormChange("unit", value);
                      }
                    }}
                    placeholder="e.g., bottles, pairs, spools"
                    required
                  />
                  {formData.unit && !/^[A-Za-z\s,]+$/.test(formData.unit) && (
                    <p className="text-red-500 text-sm mt-1">
                      Unit type should not contain numbers.
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Current Stock <span className="text-red-500">*</span>
                    </label>
                    <Input
                      type="number"
                      value={formData.quantity}
                      onChange={(e) =>
                        handleFormChange("quantity", e.target.value)
                      }
                      placeholder="0"
                      min="0"
                      required
                      className="no-spinner"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Purchase Price <span className="text-red-500">*</span>
                    </label>
                    <Input
                      type="number"
                      // step="0.01"
                      value={formData.purchasePrice}
                      onChange={(e) =>
                        handleFormChange("purchasePrice", e.target.value)
                      }
                      placeholder="0"
                      min="0"
                      required
                      className="no-spinner"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Selling Price <span className="text-red-500">*</span>
                    </label>
                    <Input
                      type="number"
                      // step="0.01"
                      value={formData.sellingPrice}
                      onChange={(e) =>
                        handleFormChange("sellingPrice", e.target.value)
                      }
                      placeholder="0"
                      min="0"
                      required
                      className="no-spinner"
                    />
                  </div>
                </div>
              </div>

              <div className="flex space-x-3 mt-6">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  onClick={() => setShowAddForm(false)}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleAddItem}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Add Item
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Update Stock Form Modal */}
      {showUpdateForm && editingItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-md">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900">
                  Update Stock
                </h2>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowUpdateForm(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <div className="mb-4">
                <p className="text-sm text-gray-600">
                  Item: <span className="font-medium">{editingItem.name}</span>
                </p>
                <p className="text-sm text-gray-600">
                  Current Stock:{" "}
                  <span className="font-medium">
                    {editingItem.quantity} {editingItem.unit}
                  </span>
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    New Quantity
                  </label>
                  <Input
                    type="number"
                    value={updateQuantity}
                    onChange={(e) => setUpdateQuantity(e.target.value)}
                    placeholder="Enter new quantity"
                    min="0"
                    className="no-spinner"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Updated By <span className="text-red-500">*</span>
                  </label>
                  <Input
                    type="text"
                    value={updaterName}
                    onChange={(e) => setUpdaterName(e.target.value)}
                    placeholder="Enter your name"
                    required
                  />
                </div>
              </div>

              <div className="flex space-x-3 mt-6">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setShowUpdateForm(false)}
                >
                  Cancel
                </Button>
                <Button
                  onClick={() =>
                    handleUpdateStock(editingItem, parseInt(updateQuantity))
                  }
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                >
                  Update Stock
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* History Modal */}
      {showHistoryModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-2xl max-h-[90vh] flex flex-col">
            <div className="p-6 border-b">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">
                  Update History for: {showHistoryModal.name}
                </h2>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setShowHistoryModal(null)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="p-6 overflow-y-auto">
              {showHistoryModal.history &&
              showHistoryModal.history.length > 0 ? (
                <ul className="space-y-4">
                  {showHistoryModal.history
                    .slice()
                    .reverse()
                    .map((entry, index) => (
                      <li key={index} className="flex items-start space-x-4">
                        <div className="flex-shrink-0">
                          <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                            <User className="h-5 w-5 text-gray-600" />
                          </div>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-800">
                            {entry.updatedBy}{" "}
                            <span className="text-gray-500 font-normal">
                              {entry.action === "Created"
                                ? "created the item"
                                : `updated the stock`}
                            </span>
                          </p>
                          <p className="text-xs text-gray-500 mb-1">
                            {new Date(entry.date).toLocaleString()}
                          </p>
                          <p className="text-sm text-gray-700">
                            Quantity changed by{" "}
                            <span
                              className={`font-bold ${
                                entry.quantityChange >= 0
                                  ? "text-green-600"
                                  : "text-red-600"
                              }`}
                            >
                              {entry.quantityChange > 0
                                ? `+${entry.quantityChange}`
                                : entry.quantityChange}
                            </span>
                            , new quantity is{" "}
                            <span className="font-bold">
                              {entry.newQuantity}
                            </span>
                            .
                          </p>
                        </div>
                      </li>
                    ))}
                </ul>
              ) : (
                <div className="text-center py-10 text-gray-500">
                  <History className="h-12 w-12 mx-auto mb-2" />
                  <p>No history found for this item.</p>
                </div>
              )}
            </div>
          </Card>
        </div>
      )}

      {/* Inventory List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {filteredInventory.length > 0 ? (
          filteredInventory.map((item) => (
            <Card
              key={item.id}
              className="p-4 flex flex-col justify-between bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200"
            >
              <div>
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-lg text-gray-800">
                    {item.name}
                  </h3>
                  <Badge className={getStockStatus(item).color}>
                    {getStockStatus(item).status}
                  </Badge>
                </div>
                <p className="text-sm text-gray-500 mb-3">{item.category}</p>

                <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm mb-4">
                  <div className="font-medium text-gray-700">Stock</div>
                  <div>
                    {item.quantity} {item.unit}
                  </div>
                  <div className="font-medium text-gray-700">Purchase Price</div>
                  <div>₹{item.purchasePrice.toLocaleString()}</div>
                  <div className="font-medium text-gray-700">Selling Price</div>
                  <div>₹{item.sellingPrice.toLocaleString()}</div>
                </div>

                <div className="border-t border-gray-200 pt-3 space-y-2 text-xs text-gray-500">
                  <div className="flex items-center">
                    <Calendar className="h-3 w-3 mr-2" />
                    Last Updated: {item.lastUpdated}
                  </div>
                  <div className="flex items-center">
                    <User className="h-3 w-3 mr-2" />
                    Updated By: {item.lastUpdatedBy || "N/A"}
                  </div>
                </div>
              </div>

              <div className="flex space-x-2 mt-4">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  onClick={() => openUpdateForm(item)}
                >
                  <Edit className="h-3 w-3 mr-1" />
                  Update
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  onClick={() => setShowHistoryModal(item)}
                >
                  <History className="h-3 w-3 mr-1" />
                  History
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  className="flex-1"
                  onClick={() => handleDeleteItem(item.id, item.name)}
                >
                  <Trash2 className="h-3 w-3 mr-1" />
                  Delete
                </Button>
              </div>
            </Card>
          ))
        ) : (
          <div className="col-span-1 md:col-span-2 lg:col-span-3 text-center py-10 text-gray-500">
            <Package className="h-12 w-12 mx-auto mb-2" />
            <p>No inventory items found.</p>
            <p className="text-sm">
              Click "Add Item" to get started.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}