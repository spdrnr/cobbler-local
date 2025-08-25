import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from "recharts";
import { CalendarDays, TrendingUp, DollarSign, Package, Users, Download, FileText, BarChart3 } from "lucide-react";

const monthlyRevenue = [
  { month: "Jan", revenue: 15000, orders: 45 },
  { month: "Feb", revenue: 18000, orders: 52 },
  { month: "Mar", revenue: 22000, orders: 68 },
  { month: "Apr", revenue: 19000, orders: 58 },
  { month: "May", revenue: 25000, orders: 75 },
  { month: "Jun", revenue: 28000, orders: 82 },
];

const serviceTypes = [
  { name: "Shoe Repair", value: 45, color: "hsl(var(--primary))" },
  { name: "Bag Repair", value: 30, color: "hsl(var(--secondary))" },
  { name: "Cleaning", value: 15, color: "hsl(var(--accent))" },
  { name: "Polish", value: 10, color: "hsl(var(--muted))" },
];

const topCustomers = [
  { name: "Rajesh Kumar", orders: 12, revenue: 4500 },
  { name: "Priya Sharma", orders: 8, revenue: 3200 },
  { name: "Amit Patel", orders: 6, revenue: 2800 },
  { name: "Sunita Devi", orders: 5, revenue: 2100 },
  { name: "Manoj Singh", orders: 4, revenue: 1800 },
];

const dailyStats = [
  { day: "Mon", orders: 12, revenue: 3200 },
  { day: "Tue", orders: 15, revenue: 4100 },
  { day: "Wed", orders: 18, revenue: 4800 },
  { day: "Thu", orders: 14, revenue: 3900 },
  { day: "Fri", orders: 20, revenue: 5500 },
  { day: "Sat", orders: 25, revenue: 6200 },
  { day: "Sun", orders: 8, revenue: 2100 },
];

export function ReportsModule() {
  const [selectedPeriod, setSelectedPeriod] = useState("month");
  const [selectedReport, setSelectedReport] = useState("overview");

  const totalRevenue = monthlyRevenue.reduce((sum, item) => sum + item.revenue, 0);
  const totalOrders = monthlyRevenue.reduce((sum, item) => sum + item.orders, 0);
  const avgOrderValue = totalRevenue / totalOrders;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Reports & Analytics</h1>
          <p className="text-muted-foreground">View detailed business reports and analytics</p>
        </div>
        <div className="flex space-x-2">
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
              <SelectItem value="quarter">This Quarter</SelectItem>
              <SelectItem value="year">This Year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4 bg-gradient-card border-0 shadow-soft">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-foreground">₹{totalRevenue.toLocaleString()}</div>
              <div className="text-sm text-muted-foreground">Total Revenue</div>
              <div className="text-xs text-success flex items-center mt-1">
                <TrendingUp className="h-3 w-3 mr-1" />
                +12.5% from last month
              </div>
            </div>
            <DollarSign className="h-8 w-8 text-primary" />
          </div>
        </Card>
        <Card className="p-4 bg-gradient-card border-0 shadow-soft">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-foreground">{totalOrders}</div>
              <div className="text-sm text-muted-foreground">Total Orders</div>
              <div className="text-xs text-success flex items-center mt-1">
                <TrendingUp className="h-3 w-3 mr-1" />
                +8.2% from last month
              </div>
            </div>
            <Package className="h-8 w-8 text-primary" />
          </div>
        </Card>
        <Card className="p-4 bg-gradient-card border-0 shadow-soft">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-foreground">₹{Math.round(avgOrderValue)}</div>
              <div className="text-sm text-muted-foreground">Avg Order Value</div>
              <div className="text-xs text-success flex items-center mt-1">
                <TrendingUp className="h-3 w-3 mr-1" />
                +4.1% from last month
              </div>
            </div>
            <BarChart3 className="h-8 w-8 text-primary" />
          </div>
        </Card>
        <Card className="p-4 bg-gradient-card border-0 shadow-soft">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-foreground">89</div>
              <div className="text-sm text-muted-foreground">Active Customers</div>
              <div className="text-xs text-success flex items-center mt-1">
                <TrendingUp className="h-3 w-3 mr-1" />
                +15.3% from last month
              </div>
            </div>
            <Users className="h-8 w-8 text-primary" />
          </div>
        </Card>
      </div>

      {/* Report Type Selector */}
      <Card className="p-4 bg-gradient-card border-0 shadow-soft">
        <div className="flex space-x-2">
          <Button 
            variant={selectedReport === "overview" ? "default" : "outline"}
            onClick={() => setSelectedReport("overview")}
            className={selectedReport === "overview" ? "bg-gradient-primary hover:opacity-90" : ""}
          >
            Overview
          </Button>
          <Button 
            variant={selectedReport === "revenue" ? "default" : "outline"}
            onClick={() => setSelectedReport("revenue")}
            className={selectedReport === "revenue" ? "bg-gradient-primary hover:opacity-90" : ""}
          >
            Revenue Analysis
          </Button>
          <Button 
            variant={selectedReport === "customers" ? "default" : "outline"}
            onClick={() => setSelectedReport("customers")}
            className={selectedReport === "customers" ? "bg-gradient-primary hover:opacity-90" : ""}
          >
            Customer Reports
          </Button>
          <Button 
            variant={selectedReport === "services" ? "default" : "outline"}
            onClick={() => setSelectedReport("services")}
            className={selectedReport === "services" ? "bg-gradient-primary hover:opacity-90" : ""}
          >
            Service Analysis
          </Button>
        </div>
      </Card>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Revenue Chart */}
        <Card className="p-6 bg-gradient-card border-0 shadow-soft">
          <h3 className="text-lg font-semibold text-foreground mb-4">Monthly Revenue Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlyRevenue}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted-foreground))" opacity={0.3} />
              <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
              <YAxis stroke="hsl(var(--muted-foreground))" />
              <Tooltip 
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px"
                }}
              />
              <Bar dataKey="revenue" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* Service Types Distribution */}
        <Card className="p-6 bg-gradient-card border-0 shadow-soft">
          <h3 className="text-lg font-semibold text-foreground mb-4">Service Types Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={serviceTypes}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={120}
                paddingAngle={5}
                dataKey="value"
              >
                {serviceTypes.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px"
                }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex flex-wrap gap-2 mt-4">
            {serviceTypes.map((type, index) => (
              <div key={index} className="flex items-center space-x-2">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: type.color }}
                />
                <span className="text-sm text-muted-foreground">
                  {type.name} ({type.value}%)
                </span>
              </div>
            ))}
          </div>
        </Card>

        {/* Daily Performance */}
        <Card className="p-6 bg-gradient-card border-0 shadow-soft">
          <h3 className="text-lg font-semibold text-foreground mb-4">Daily Performance</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={dailyStats}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted-foreground))" opacity={0.3} />
              <XAxis dataKey="day" stroke="hsl(var(--muted-foreground))" />
              <YAxis stroke="hsl(var(--muted-foreground))" />
              <Tooltip 
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px"
                }}
              />
              <Line 
                type="monotone" 
                dataKey="orders" 
                stroke="hsl(var(--primary))" 
                strokeWidth={3}
                dot={{ fill: "hsl(var(--primary))" }}
              />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        {/* Top Customers */}
        <Card className="p-6 bg-gradient-card border-0 shadow-soft">
          <h3 className="text-lg font-semibold text-foreground mb-4">Top Customers</h3>
          <div className="space-y-4">
            {topCustomers.map((customer, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-semibold text-sm">
                    {index + 1}
                  </div>
                  <div>
                    <div className="font-medium text-foreground">{customer.name}</div>
                    <div className="text-sm text-muted-foreground">{customer.orders} orders</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-foreground">₹{customer.revenue.toLocaleString()}</div>
                  <div className="text-sm text-muted-foreground">revenue</div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Export Options */}
      <Card className="p-6 bg-gradient-card border-0 shadow-soft">
        <h3 className="text-lg font-semibold text-foreground mb-4">Export Reports</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Button variant="outline" className="justify-start">
            <FileText className="h-4 w-4 mr-2" />
            Revenue Report (PDF)
          </Button>
          <Button variant="outline" className="justify-start">
            <FileText className="h-4 w-4 mr-2" />
            Customer List (Excel)
          </Button>
          <Button variant="outline" className="justify-start">
            <FileText className="h-4 w-4 mr-2" />
            Service Analytics (PDF)
          </Button>
        </div>
      </Card>
    </div>
  );
}