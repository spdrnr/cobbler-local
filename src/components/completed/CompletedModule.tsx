import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  CheckCircle,
  Calendar,
  Package,
  User,
  MapPin,
  DollarSign,
  Archive,
  Eye,
} from "lucide-react";
import { Enquiry } from "@/types";
import { enquiriesStorage, workflowHelpers } from "@/utils/localStorage";

export function CompletedModule() {
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  // Load completed enquiries from localStorage on component mount and refresh periodically
  useEffect(() => {
    const loadCompletedEnquiries = () => {
      const completedEnquiries = workflowHelpers.getCompletedEnquiries();
      setEnquiries(completedEnquiries);
    };
    
    loadCompletedEnquiries();
    
    // Refresh data every 2 seconds to catch newly completed items
    const interval = setInterval(loadCompletedEnquiries, 2000);
    
    return () => clearInterval(interval);
  }, []);

  const totalCompleted = enquiries.length;
  const completedThisWeek = enquiries.filter((e) => {
    const completedDate = new Date(e.deliveryDetails?.deliveredAt || '');
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return completedDate >= weekAgo;
  }).length;
  const totalRevenue = enquiries.reduce((sum, e) => sum + (e.finalAmount || 0), 0);
  const avgCompletionTime = enquiries.length > 0 ? 
    Math.round(enquiries.reduce((sum, e) => {
      const startDate = new Date(e.date);
      const endDate = new Date(e.deliveryDetails?.deliveredAt || '');
      return sum + (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24);
    }, 0) / enquiries.length) : 0;

  const filteredEnquiries = enquiries.filter(
    (enquiry) =>
      enquiry.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      enquiry.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
      enquiry.product.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-4 sm:space-y-6 animate-fade-in p-2 sm:p-0">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
            Completed Orders
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            View all completed and delivered orders
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <Card className="p-3 sm:p-4 bg-gradient-card border-0 shadow-soft">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-lg sm:text-2xl font-bold text-foreground">
                {totalCompleted}
              </div>
              <div className="text-xs sm:text-sm text-muted-foreground">
                Total Completed
              </div>
            </div>
            <CheckCircle className="h-6 w-6 sm:h-8 sm:w-8 text-success" />
          </div>
        </Card>
        <Card className="p-3 sm:p-4 bg-gradient-card border-0 shadow-soft">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-lg sm:text-2xl font-bold text-foreground">
                {completedThisWeek}
              </div>
              <div className="text-xs sm:text-sm text-muted-foreground">
                This Week
              </div>
            </div>
            <Calendar className="h-6 w-6 sm:h-8 sm:w-8 text-blue-500" />
          </div>
        </Card>
        <Card className="p-3 sm:p-4 bg-gradient-card border-0 shadow-soft">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-lg sm:text-2xl font-bold text-foreground">
                ₹{totalRevenue.toLocaleString()}
              </div>
              <div className="text-xs sm:text-sm text-muted-foreground">
                Total Revenue
              </div>
            </div>
            <DollarSign className="h-6 w-6 sm:h-8 sm:w-8 text-green-500" />
          </div>
        </Card>
        <Card className="p-3 sm:p-4 bg-gradient-card border-0 shadow-soft">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-lg sm:text-2xl font-bold text-foreground">
                {avgCompletionTime}
              </div>
              <div className="text-xs sm:text-sm text-muted-foreground">
                Avg Days
              </div>
            </div>
            <Package className="h-6 w-6 sm:h-8 sm:w-8 text-purple-500" />
          </div>
        </Card>
      </div>

      {/* Search */}
      <Card className="p-3 sm:p-4 bg-gradient-card border-0 shadow-soft">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search completed orders by customer, address, product..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </Card>

      {/* Completed Items */}
      <div className="space-y-4">
        <h2 className="text-xl sm:text-2xl font-bold text-foreground">
          Completed Orders
        </h2>
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6">
          {filteredEnquiries.map((enquiry) => (
            <Card
              key={enquiry.id}
              className="p-4 sm:p-6 bg-gradient-card border-0 shadow-soft hover:shadow-medium transition-all duration-300"
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between mb-4 gap-3">
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-foreground text-base sm:text-lg">
                    {enquiry.customerName}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {enquiry.phone}
                  </p>
                </div>
                <Badge className="bg-green-100 text-green-800 border-green-200 text-xs px-2 py-1 rounded-full font-medium">
                  Completed
                </Badge>
              </div>

              <div className="space-y-3">
                <div className="flex items-start space-x-2">
                  <MapPin className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-foreground break-words">
                    {enquiry.address}
                  </span>
                </div>

                <div className="flex items-center space-x-2">
                  <Package className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                  <span className="text-sm text-foreground">
                    {enquiry.product} ({enquiry.quantity} items)
                  </span>
                </div>

                {enquiry.serviceDetails?.serviceType && (
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-foreground">
                      <strong>Service:</strong> {enquiry.serviceDetails.serviceType}
                    </span>
                  </div>
                )}

                <div className="flex items-center space-x-2">
                  <DollarSign className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                  <span className="text-sm font-semibold text-foreground">
                    Final Amount: ₹{enquiry.finalAmount || enquiry.quotedAmount || 0}
                  </span>
                </div>

                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                  <span className="text-sm text-foreground">
                    <strong>Ordered:</strong> {formatDate(enquiry.date)}
                  </span>
                </div>

                {enquiry.deliveryDetails?.deliveredAt && (
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                    <span className="text-sm text-foreground">
                      <strong>Delivered:</strong> {formatDateTime(enquiry.deliveryDetails.deliveredAt)}
                    </span>
                  </div>
                )}

                {enquiry.deliveryDetails?.deliveryMethod && (
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-foreground">
                      <strong>Delivery:</strong> {enquiry.deliveryDetails.deliveryMethod === 'customer-pickup' ? 'Customer Pickup' : 'Home Delivery'}
                    </span>
                  </div>
                )}

                {enquiry.deliveryDetails?.deliveryNotes && (
                  <div className="bg-muted/50 p-2 rounded">
                    <span className="text-sm text-foreground">
                      <strong>Notes:</strong> {enquiry.deliveryDetails.deliveryNotes}
                    </span>
                  </div>
                )}
              </div>

              <div className="flex justify-end mt-4">
                <Button
                  size="sm"
                  variant="outline"
                  className="text-xs sm:text-sm"
                >
                  <Eye className="h-3 w-3 mr-1" />
                  View Details
                </Button>
              </div>
            </Card>
          ))}
        </div>

        {filteredEnquiries.length === 0 && (
          <Card className="p-8 text-center">
            <Archive className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">
              No Completed Orders
            </h3>
            <p className="text-muted-foreground">
              Completed orders will appear here once items are delivered.
            </p>
          </Card>
        )}
      </div>
    </div>
  );
}
