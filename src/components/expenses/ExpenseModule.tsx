import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, Calendar, TrendingUp, Receipt, DollarSign } from "lucide-react";

interface Expense {
  id: number;
  date: string;
  amount: number;
  category: string;
  description: string;
  notes?: string;
}

const expenseCategories = [
  "Materials",
  "Tools",
  "Rent",
  "Utilities",
  "Transportation",
  "Marketing",
  "Miscellaneous"
];

const sampleExpenses: Expense[] = [
  {
    id: 1,
    date: "2024-01-15",
    amount: 2500,
    category: "Materials",
    description: "Leather sheets and polish",
    notes: "Bulk purchase for January"
  },
  {
    id: 2,
    date: "2024-01-14",
    amount: 800,
    category: "Tools",
    description: "New stitching machine needles",
  },
  {
    id: 3,
    date: "2024-01-13",
    amount: 1200,
    category: "Rent",
    description: "Shop rent for January",
  },
  {
    id: 4,
    date: "2024-01-12",
    amount: 300,
    category: "Transportation",
    description: "Fuel for pickup deliveries",
  }
];

export function ExpenseModule() {
  const [expenses, setExpenses] = useState<Expense[]>(sampleExpenses);
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("2024-01");
  const [formData, setFormData] = useState({
    date: "",
    amount: "",
    category: "",
    description: "",
    notes: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newExpense: Expense = {
      id: expenses.length + 1,
      ...formData,
      amount: parseFloat(formData.amount),
    };
    setExpenses([newExpense, ...expenses]);
    setFormData({ date: "", amount: "", category: "", description: "", notes: "" });
    setShowForm(false);
  };

  const filteredExpenses = expenses.filter(expense => {
    const matchesSearch = expense.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         expense.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesMonth = expense.date.startsWith(selectedMonth);
    return matchesSearch && matchesMonth;
  });

  const monthlyTotal = filteredExpenses.reduce((sum, expense) => sum + expense.amount, 0);
  
  const categoryTotals = expenseCategories.map(category => ({
    category,
    amount: filteredExpenses
      .filter(expense => expense.category === category)
      .reduce((sum, expense) => sum + expense.amount, 0)
  })).filter(item => item.amount > 0);

  const getCategoryColor = (category: string) => {
    const colors = {
      "Materials": "bg-blue-500",
      "Tools": "bg-green-500",
      "Rent": "bg-purple-500",
      "Utilities": "bg-yellow-500",
      "Transportation": "bg-red-500",
      "Marketing": "bg-pink-500",
      "Miscellaneous": "bg-gray-500"
    };
    return colors[category as keyof typeof colors] || "bg-gray-500";
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Expense Management</h1>
          <p className="text-muted-foreground">Track and manage business expenses</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)} className="bg-gradient-primary hover:opacity-90">
          <Plus className="h-4 w-4 mr-0" />
          Add Expense
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4 bg-gradient-card border-0 shadow-soft">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-foreground">₹{monthlyTotal.toLocaleString()}</div>
              <div className="text-sm text-muted-foreground">Monthly Total</div>
            </div>
            <DollarSign className="h-8 w-8 text-primary" />
          </div>
        </Card>
        <Card className="p-4 bg-gradient-card border-0 shadow-soft">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-foreground">{filteredExpenses.length}</div>
              <div className="text-sm text-muted-foreground">Total Entries</div>
            </div>
            <Receipt className="h-8 w-8 text-primary" />
          </div>
        </Card>
        <Card className="p-4 bg-gradient-card border-0 shadow-soft">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-foreground">₹{Math.round(monthlyTotal / (filteredExpenses.length || 1)).toLocaleString()}</div>
              <div className="text-sm text-muted-foreground">Average Expense</div>
            </div>
            <TrendingUp className="h-8 w-8 text-primary" />
          </div>
        </Card>
        <Card className="p-4 bg-gradient-card border-0 shadow-soft">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-foreground">{categoryTotals.length}</div>
              <div className="text-sm text-muted-foreground">Categories Used</div>
            </div>
            <Calendar className="h-8 w-8 text-primary" />
          </div>
        </Card>
      </div>

      {/* Category Breakdown */}
      <Card className="p-6 bg-gradient-card border-0 shadow-soft">
        <h3 className="text-lg font-semibold text-foreground mb-4">Category Breakdown</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {categoryTotals.map((item) => (
            <div key={item.category} className="flex items-center space-x-3">
              <div className={`w-4 h-4 rounded-full ${getCategoryColor(item.category)}`} />
              <div className="flex-1">
                <div className="text-sm font-medium text-foreground">{item.category}</div>
                <div className="text-lg font-bold text-foreground">₹{item.amount.toLocaleString()}</div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Add Expense Form */}
      {showForm && (
        <Card className="p-6 bg-gradient-card border-0 shadow-medium">
          <h3 className="text-lg font-semibold text-foreground mb-4">Add New Expense</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="date">Date</Label>
                <Input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="amount">Amount (₹)</Label>
                <Input
                  id="amount"
                  type="number"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="category">Category</Label>
                <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {expenseCategories.map((category) => (
                      <SelectItem key={category} value={category}>{category}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Brief description of the expense"
                required
              />
            </div>
            <div>
              <Label htmlFor="notes">Notes (Optional)</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Additional notes..."
              />
            </div>
            <div className="flex space-x-2">
              <Button type="submit" className="bg-gradient-primary hover:opacity-90">
                Save Expense
              </Button>
              <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                Cancel
              </Button>
            </div>
          </form>
        </Card>
      )}

      {/* Filters */}
      <Card className="p-4 bg-gradient-card border-0 shadow-soft">
        <div className="flex items-center space-x-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search expenses..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="w-48">
            <Select value={selectedMonth} onValueChange={setSelectedMonth}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2024-01">January 2024</SelectItem>
                <SelectItem value="2023-12">December 2023</SelectItem>
                <SelectItem value="2023-11">November 2023</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </Card>

      {/* Expenses List */}
      <div className="space-y-4">
        {filteredExpenses.map((expense) => (
          <Card key={expense.id} className="p-6 bg-gradient-card border-0 shadow-soft hover:shadow-medium transition-all duration-300">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <h3 className="font-semibold text-foreground">{expense.description}</h3>
                  <Badge variant="outline">{expense.category}</Badge>
                  <span className="text-sm text-muted-foreground">{expense.date}</span>
                </div>
                {expense.notes && (
                  <p className="text-sm text-muted-foreground">{expense.notes}</p>
                )}
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-foreground">₹{expense.amount.toLocaleString()}</div>
                <div className="flex space-x-2 mt-2">
                  <Button size="sm" variant="outline">Edit</Button>
                  <Button size="sm" variant="outline">Delete</Button>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}