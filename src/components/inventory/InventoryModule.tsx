import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, AlertTriangle, Package, TrendingDown } from "lucide-react";

interface InventoryItem {
  id: number;
  name: string;
  category: string;
  quantity: number;
  minStock: number;
  unit: string;
  lastUpdated: string;
}

const sampleInventory: InventoryItem[] = [
  {
    id: 1,
    name: "Leather Polish - Brown",
    category: "Polish",
    quantity: 15,
    minStock: 10,
    unit: "bottles",
    lastUpdated: "2024-01-15"
  },
  {
    id: 2,
    name: "Shoe Sole - Rubber",
    category: "Soles",
    quantity: 3,
    minStock: 5,
    unit: "pairs",
    lastUpdated: "2024-01-14"
  },
  {
    id: 3,
    name: "Thread - Heavy Duty",
    category: "Thread",
    quantity: 8,
    minStock: 3,
    unit: "spools",
    lastUpdated: "2024-01-13"
  },
  {
    id: 4,
    name: "Bag Zipper - Metal",
    category: "Hardware",
    quantity: 25,
    minStock: 15,
    unit: "pieces",
    lastUpdated: "2024-01-12"
  }
];

export function InventoryModule() {
  const [inventory, setInventory] = useState<InventoryItem[]>(sampleInventory);
  const [searchTerm, setSearchTerm] = useState("");

  const lowStockItems = inventory.filter(item => item.quantity <= item.minStock);
  const totalItems = inventory.reduce((sum, item) => sum + item.quantity, 0);

  const filteredInventory = inventory.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStockStatus = (item: InventoryItem) => {
    if (item.quantity <= item.minStock) {
      return { status: "Low Stock", color: "bg-destructive text-destructive-foreground" };
    }
    if (item.quantity <= item.minStock * 1.5) {
      return { status: "Medium", color: "bg-warning text-warning-foreground" };
    }
    return { status: "Good", color: "bg-success text-success-foreground" };
  };

  return (
    <div className="space-y-4 sm:space-y-6 animate-fade-in p-2 sm:p-0">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Inventory Management</h1>
          <p className="text-sm sm:text-base text-muted-foreground">Track materials and stock levels</p>
        </div>
        <Button className="bg-gradient-primary hover:opacity-90 w-full sm:w-auto">
          <Plus className="h-4 w-4 mr-0" />
          Add Item
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <Card className="p-3 sm:p-4 bg-gradient-card border-0 shadow-soft">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-lg sm:text-2xl font-bold text-foreground">{inventory.length}</div>
              <div className="text-xs sm:text-sm text-muted-foreground">Total Items</div>
            </div>
            <Package className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
          </div>
        </Card>
        <Card className="p-3 sm:p-4 bg-gradient-card border-0 shadow-soft">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-lg sm:text-2xl font-bold text-foreground">{totalItems}</div>
              <div className="text-xs sm:text-sm text-muted-foreground">Total Quantity</div>
            </div>
            <TrendingDown className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
          </div>
        </Card>
        <Card className="p-3 sm:p-4 bg-gradient-card border-0 shadow-soft">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-lg sm:text-2xl font-bold text-destructive">{lowStockItems.length}</div>
              <div className="text-xs sm:text-sm text-muted-foreground">Low Stock Alerts</div>
            </div>
            <AlertTriangle className="h-6 w-6 sm:h-8 sm:w-8 text-destructive" />
          </div>
        </Card>
        <Card className="p-3 sm:p-4 bg-gradient-card border-0 shadow-soft">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-lg sm:text-2xl font-bold text-success">{inventory.length - lowStockItems.length}</div>
              <div className="text-xs sm:text-sm text-muted-foreground">Well Stocked</div>
            </div>
            <Package className="h-6 w-6 sm:h-8 sm:w-8 text-success" />
          </div>
        </Card>
      </div>

      {/* Low Stock Alerts */}
      {lowStockItems.length > 0 && (
        <Card className="p-3 sm:p-4 bg-destructive/5 border border-destructive/20">
          <div className="flex items-center space-x-2 mb-3">
            <AlertTriangle className="h-4 w-4 sm:h-5 sm:w-5 text-destructive" />
            <h3 className="font-semibold text-destructive text-sm sm:text-base">Low Stock Alerts</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {lowStockItems.map((item) => (
              <div key={item.id} className="text-xs sm:text-sm text-foreground">
                <span className="font-medium">{item.name}</span> - Only {item.quantity} {item.unit} left
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Search */}
      <Card className="p-3 sm:p-4 bg-gradient-card border-0 shadow-soft">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search inventory..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </Card>

      {/* Inventory Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
        {filteredInventory.map((item) => {
          const stockStatus = getStockStatus(item);
          return (
            <Card key={item.id} className="p-4 sm:p-6 bg-gradient-card border-0 shadow-soft hover:shadow-medium transition-all duration-300">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-foreground mb-1 text-sm sm:text-base truncate">{item.name}</h3>
                  <p className="text-xs sm:text-sm text-muted-foreground">{item.category}</p>
                </div>
                <Badge className={`${stockStatus.color} text-xs ml-2 flex-shrink-0`}>{stockStatus.status}</Badge>
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-xs sm:text-sm text-muted-foreground">Current Stock:</span>
                  <span className="font-medium text-foreground text-sm sm:text-base">{item.quantity} {item.unit}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-xs sm:text-sm text-muted-foreground">Min Stock:</span>
                  <span className="text-xs sm:text-sm text-muted-foreground">{item.minStock} {item.unit}</span>
                </div>
                
                <div className="w-full bg-muted rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full transition-all duration-300 ${
                      item.quantity <= item.minStock ? "bg-destructive" :
                      item.quantity <= item.minStock * 1.5 ? "bg-warning" :
                      "bg-success"
                    }`}
                    style={{ 
                      width: `${Math.min((item.quantity / (item.minStock * 2)) * 100, 100)}%` 
                    }}
                  />
                </div>
                
                <div className="text-xs text-muted-foreground">
                  Last updated: {item.lastUpdated}
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 mt-4">
                <Button size="sm" variant="outline" className="flex-1 text-xs sm:text-sm">Update</Button>
                <Button size="sm" className="bg-gradient-primary hover:opacity-90 flex-1 text-xs sm:text-sm">Restock</Button>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
