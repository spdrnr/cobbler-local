// import { useState } from "react";
// import { Card } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Badge } from "@/components/ui/badge";
// import { Plus, Search, AlertTriangle, Package, TrendingDown } from "lucide-react";

// interface InventoryItem {
//   id: number;
//   name: string;
//   category: string;
//   quantity: number;
//   minStock: number;
//   unit: string;
//   lastUpdated: string;
// }

// const sampleInventory: InventoryItem[] = [
//   {
//     id: 1,
//     name: "Leather Polish - Brown",
//     category: "Polish",
//     quantity: 15,
//     minStock: 10,
//     unit: "bottles",
//     lastUpdated: "2024-01-15"
//   },
//   {
//     id: 2,
//     name: "Shoe Sole - Rubber",
//     category: "Soles",
//     quantity: 3,
//     minStock: 5,
//     unit: "pairs",
//     lastUpdated: "2024-01-14"
//   },
//   {
//     id: 3,
//     name: "Thread - Heavy Duty",
//     category: "Thread",
//     quantity: 8,
//     minStock: 3,
//     unit: "spools",
//     lastUpdated: "2024-01-13"
//   },
//   {
//     id: 4,
//     name: "Bag Zipper - Metal",
//     category: "Hardware",
//     quantity: 25,
//     minStock: 15,
//     unit: "pieces",
//     lastUpdated: "2024-01-12"
//   }
// ];

// export function InventoryModule() {
//   const [inventory, setInventory] = useState<InventoryItem[]>(sampleInventory);
//   const [searchTerm, setSearchTerm] = useState("");

//   const lowStockItems = inventory.filter(item => item.quantity <= item.minStock);
//   const totalItems = inventory.reduce((sum, item) => sum + item.quantity, 0);

//   const filteredInventory = inventory.filter(item =>
//     item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//     item.category.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   const getStockStatus = (item: InventoryItem) => {
//     if (item.quantity <= item.minStock) {
//       return { status: "Low Stock", color: "bg-destructive text-destructive-foreground" };
//     }
//     if (item.quantity <= item.minStock * 1.5) {
//       return { status: "Medium", color: "bg-warning text-warning-foreground" };
//     }
//     return { status: "Good", color: "bg-success text-success-foreground" };
//   };

//   return (
//     <div className="space-y-4 sm:space-y-6 animate-fade-in p-2 sm:p-0">
//       {/* Header */}
//       <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
//         <div>
//           <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Inventory Management</h1>
//           <p className="text-sm sm:text-base text-muted-foreground">Track materials and stock levels</p>
//         </div>
//         <Button className="bg-gradient-primary hover:opacity-90 w-full sm:w-auto">
//           <Plus className="h-4 w-4 mr-0" />
//           Add Item
//         </Button>
//       </div>

//       {/* Stats */}
//       <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
//         <Card className="p-3 sm:p-4 bg-gradient-card border-0 shadow-soft">
//           <div className="flex items-center justify-between">
//             <div>
//               <div className="text-lg sm:text-2xl font-bold text-foreground">{inventory.length}</div>
//               <div className="text-xs sm:text-sm text-muted-foreground">Total Items</div>
//             </div>
//             <Package className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
//           </div>
//         </Card>
//         <Card className="p-3 sm:p-4 bg-gradient-card border-0 shadow-soft">
//           <div className="flex items-center justify-between">
//             <div>
//               <div className="text-lg sm:text-2xl font-bold text-foreground">{totalItems}</div>
//               <div className="text-xs sm:text-sm text-muted-foreground">Total Quantity</div>
//             </div>
//             <TrendingDown className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
//           </div>
//         </Card>
//         <Card className="p-3 sm:p-4 bg-gradient-card border-0 shadow-soft">
//           <div className="flex items-center justify-between">
//             <div>
//               <div className="text-lg sm:text-2xl font-bold text-destructive">{lowStockItems.length}</div>
//               <div className="text-xs sm:text-sm text-muted-foreground">Low Stock Alerts</div>
//             </div>
//             <AlertTriangle className="h-6 w-6 sm:h-8 sm:w-8 text-destructive" />
//           </div>
//         </Card>
//         <Card className="p-3 sm:p-4 bg-gradient-card border-0 shadow-soft">
//           <div className="flex items-center justify-between">
//             <div>
//               <div className="text-lg sm:text-2xl font-bold text-success">{inventory.length - lowStockItems.length}</div>
//               <div className="text-xs sm:text-sm text-muted-foreground">Well Stocked</div>
//             </div>
//             <Package className="h-6 w-6 sm:h-8 sm:w-8 text-success" />
//           </div>
//         </Card>
//       </div>

//       {/* Low Stock Alerts */}
//       {lowStockItems.length > 0 && (
//         <Card className="p-3 sm:p-4 bg-destructive/5 border border-destructive/20">
//           <div className="flex items-center space-x-2 mb-3">
//             <AlertTriangle className="h-4 w-4 sm:h-5 sm:w-5 text-destructive" />
//             <h3 className="font-semibold text-destructive text-sm sm:text-base">Low Stock Alerts</h3>
//           </div>
//           <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
//             {lowStockItems.map((item) => (
//               <div key={item.id} className="text-xs sm:text-sm text-foreground">
//                 <span className="font-medium">{item.name}</span> - Only {item.quantity} {item.unit} left
//               </div>
//             ))}
//           </div>
//         </Card>
//       )}

//       {/* Search */}
//       <Card className="p-3 sm:p-4 bg-gradient-card border-0 shadow-soft">
//         <div className="relative">
//           <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
//           <Input
//             placeholder="Search inventory..."
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//             className="pl-10"
//           />
//         </div>
//       </Card>

//       {/* Inventory Grid */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
//         {filteredInventory.map((item) => {
//           const stockStatus = getStockStatus(item);
//           return (
//             <Card key={item.id} className="p-4 sm:p-6 bg-gradient-card border-0 shadow-soft hover:shadow-medium transition-all duration-300">
//               <div className="flex items-start justify-between mb-4">
//                 <div className="flex-1 min-w-0">
//                   <h3 className="font-semibold text-foreground mb-1 text-sm sm:text-base truncate">{item.name}</h3>
//                   <p className="text-xs sm:text-sm text-muted-foreground">{item.category}</p>
//                 </div>
//                 <Badge className={`${stockStatus.color} text-xs ml-2 flex-shrink-0`}>{stockStatus.status}</Badge>
//               </div>
              
//               <div className="space-y-3">
//                 <div className="flex justify-between items-center">
//                   <span className="text-xs sm:text-sm text-muted-foreground">Current Stock:</span>
//                   <span className="font-medium text-foreground text-sm sm:text-base">{item.quantity} {item.unit}</span>
//                 </div>
                
//                 <div className="flex justify-between items-center">
//                   <span className="text-xs sm:text-sm text-muted-foreground">Min Stock:</span>
//                   <span className="text-xs sm:text-sm text-muted-foreground">{item.minStock} {item.unit}</span>
//                 </div>
                
//                 <div className="w-full bg-muted rounded-full h-2">
//                   <div 
//                     className={`h-2 rounded-full transition-all duration-300 ${
//                       item.quantity <= item.minStock ? "bg-destructive" :
//                       item.quantity <= item.minStock * 1.5 ? "bg-warning" :
//                       "bg-success"
//                     }`}
//                     style={{ 
//                       width: `${Math.min((item.quantity / (item.minStock * 2)) * 100, 100)}%` 
//                     }}
//                   />
//                 </div>
                
//                 <div className="text-xs text-muted-foreground">
//                   Last updated: {item.lastUpdated}
//                 </div>
//               </div>
              
//               <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 mt-4">
//                 <Button size="sm" variant="outline" className="flex-1 text-xs sm:text-sm">Update</Button>
//                 <Button size="sm" className="bg-gradient-primary hover:opacity-90 flex-1 text-xs sm:text-sm">Restock</Button>
//               </div>
//             </Card>
//           );
//         })}
//       </div>
//     </div>
//   );
// }

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
} from "lucide-react";
import GradientText from "../ui/GradientText";

interface InventoryItem {
  id: number;
  name: string;
  category: string;
  quantity: number;
  minStock: number;
  unit: string;
  purchasePrice: number;
  sellingPrice: number;
  supplier?: string;
  lastUpdated: string;
}

interface FormData {
  name: string;
  category: string;
  unit: string;
  quantity: string;
  minStock: string;
  purchasePrice: string;
  sellingPrice: string;
  supplier: string;
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
  const [formData, setFormData] = useState<FormData>({
    name: "",
    category: "",
    unit: "",
    quantity: "",
    minStock: "",
    purchasePrice: "",
    sellingPrice: "",
    supplier: "",
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
      minStock: "",
      purchasePrice: "",
      sellingPrice: "",
      supplier: "",
    });
  };

  const handleAddItem = () => {
    if (
      !formData.name ||
      !formData.category ||
      !formData.unit ||
      !formData.quantity ||
      !formData.minStock ||
      !formData.purchasePrice ||
      !formData.sellingPrice
    ) {
      alert("Please fill in all required fields");
      return;
    }

    const newItem: InventoryItem = {
      id: Date.now(),
      name: formData.name,
      category: formData.category,
      unit: formData.unit,
      quantity: parseInt(formData.quantity),
      minStock: parseInt(formData.minStock),
      purchasePrice: parseFloat(formData.purchasePrice),
      sellingPrice: parseFloat(formData.sellingPrice),
      supplier: formData.supplier,
      lastUpdated: getCurrentDate(),
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
    setInventory((prev) =>
      prev.map((invItem) =>
        invItem.id === item.id
          ? { ...invItem, quantity: newQuantity, lastUpdated: getCurrentDate() }
          : invItem
      )
    );

    checkStockAlert({ ...item, quantity: newQuantity });
    setEditingItem(null);
    setShowUpdateForm(false);
    setUpdateQuantity("");
  };

  // Step 2: Fixed restock functionality
  const handleRestock = (item: InventoryItem, additionalQuantity: number) => {
    if (additionalQuantity <= 0) {
      alert("Please enter a valid quantity to add");
      return;
    }

    setInventory((prev) =>
      prev.map((invItem) =>
        invItem.id === item.id
          ? {
              ...invItem,
              quantity: invItem.quantity + additionalQuantity,
              lastUpdated: getCurrentDate(),
            }
          : invItem
      )
    );
    setEditingItem(null);
    setShowUpdateForm(false);
    setUpdateQuantity("");
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
            <GradientText
              colors={["#00cc77", "#0044cc", "#00cc77", "#0044cc", "#00cc77"]}
              animationSpeed={3}
              showBorder={false}
              className="custom-class"
            >
              Inventory Management
            </GradientText>
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
                      Min Stock Level <span className="text-red-500">*</span>
                    </label>
                    <Input
                      type="number"
                      value={formData.minStock}
                      onChange={(e) =>
                        handleFormChange("minStock", e.target.value)
                      }
                      placeholder="0"
                      min="0"
                      required
                      className="no-spinner"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
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

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Supplier/Vendor
                  </label>
                  <Input
                    value={formData.supplier}
                    onChange={(e) => {
                      const value = e.target.value;
                      // Allow only letters, spaces, &, and -
                      if (/^[A-Za-z\s&-]*$/.test(value)) {
                        handleFormChange("supplier", value);
                      }
                    }}
                    placeholder="Optional"
                  />
                  {formData.supplier &&
                    !/^[A-Za-z\s&-]+$/.test(formData.supplier) && (
                      <p className="text-red-500 text-sm mt-1">
                        Supplier/Vendor name should not contain numbers.
                      </p>
                    )}
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
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white disabled:bg-gray-400 disabled:cursor-not-allowed"
                  onClick={() =>
                    handleRestock(
                      editingItem,
                      parseInt(updateQuantity) - editingItem.quantity
                    )
                  }
                  disabled={
                    !updateQuantity ||
                    parseInt(updateQuantity) <= editingItem.quantity ||
                    isRestockDisabled(editingItem.quantity)
                  }
                >
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Restock
                </Button>
                <Button
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                  onClick={() =>
                    handleUpdateStock(editingItem, parseInt(updateQuantity))
                  }
                  disabled={!updateQuantity || parseInt(updateQuantity) < 0}
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Update
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Inventory Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
        {filteredInventory.map((item) => {
          const stockStatus = getStockStatus(item);
          return (
            <Card
              key={item.id}
              className="p-4 sm:p-6 bg-white border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 mb-1 text-sm sm:text-base truncate">
                    {item.name}
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-600">
                    {item.category}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge
                    className={`${stockStatus.color} text-xs flex-shrink-0`}
                  >
                    {stockStatus.status}
                  </Badge>
                  {/* Step 4: Added delete button */}
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-red-600 hover:bg-red-50 hover:text-foreground p-1 h-6 w-6"
                    onClick={() => handleDeleteItem(item.id, item.name)}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-xs sm:text-sm text-gray-600">
                    Current Stock:
                  </span>
                  <span className="font-medium text-gray-900 text-sm sm:text-base">
                    {item.quantity} 
                    {/* {item.quantity} {item.unit} */}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-xs sm:text-sm text-gray-600">
                    Min Stock:
                  </span>
                  <span className="text-xs sm:text-sm text-gray-600">
                    {/* {item.minStock} {item.unit} */}
                    {item.minStock} 
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-xs sm:text-sm text-gray-600">
                    Purchase Price:
                  </span>
                  <span className="text-xs sm:text-sm text-gray-900">
                    ₹{item.purchasePrice}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-xs sm:text-sm text-gray-600">
                    Selling Price:
                  </span>
                  <span className="text-xs sm:text-sm text-gray-900">
                    ₹{item.sellingPrice}
                  </span>
                </div>

                {item.supplier && (
                  <div className="flex justify-between items-center">
                    <span className="text-xs sm:text-sm text-gray-600">
                      Supplier:
                    </span>
                    <span className="text-xs sm:text-sm text-gray-900">
                      {item.supplier}
                    </span>
                  </div>
                )}

                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all duration-300 ${
                      item.quantity <= item.minStock
                        ? "bg-red-500"
                        : item.quantity <= item.minStock * 1.5
                        ? "bg-yellow-500"
                        : "bg-green-500"
                    }`}
                    style={{
                      width: `${Math.min(
                        (item.quantity / (item.minStock * 2)) * 100,
                        100
                      )}%`,
                    }}
                  />
                </div>

                <div className="text-xs text-gray-500">
                  Last updated: {item.lastUpdated}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 mt-4">
                <Button
                  size="sm"
                  variant="outline"
                  className="flex-1 text-xs sm:text-sm"
                  onClick={() => openUpdateForm(item)}
                >
                  <Edit className="h-3 w-3 mr-1" />
                  Update
                </Button>
                {/* Step 3: Restock button disabled when stock >= 5 */}
                <Button
                  size="sm"
                  className={`text-white flex-1 text-xs sm:text-sm ${
                    isRestockDisabled(item.quantity)
                      ? "bg-gray-400 hover:bg-gray-400 cursor-not-allowed"
                      : "bg-blue-600 hover:bg-blue-700"
                  }`}
                  onClick={() => openUpdateForm(item)}
                  disabled={isRestockDisabled(item.quantity)}
                >
                  <ShoppingCart className="h-3 w-3 mr-1" />
                  Restock
                </Button>
              </div>
            </Card>
          );
        })}
      </div>

      {filteredInventory.length === 0 && (
        <Card className="p-8 text-center">
          <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No items found
          </h3>
          <p className="text-gray-600 mb-4">
            {searchTerm
              ? "No items match your search criteria."
              : "Start by adding your first inventory item."}
          </p>
          {!searchTerm && (
            <Button
              onClick={() => setShowAddForm(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add First Item
            </Button>
          )}
        </Card>
      )}
    </div>
  );
}
