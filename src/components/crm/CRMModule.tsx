import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { 
  Plus, 
  Search, 
  Filter, 
  Instagram, 
  Facebook, 
  MessageCircle, 
  Briefcase, 
  ShoppingBag, 
  Edit, 
  Save, 
  X, 
  Phone, 
  PhoneCall, 
  CheckCircle, 
  ArrowRight, 
  Loader2,
  // New product-specific icons
  Wallet,
  AlarmSmoke,
  Sofa,
  Package,
  Footprints,
  Trash2
} from "lucide-react";import { useToast } from "@/hooks/use-toast";
import { Enquiry } from "@/types";
import { useEnquiriesWithPolling, useCrmStats } from "@/services/enquiryApiService";

// Helper function to get business-appropriate stage display
const getStageDisplay = (stage: string): string => {
  switch (stage) {
    case "enquiry":
      return "New Enquiry";
    case "pickup":
      return "Pickup Stage";
    case "service":
      return "In Service";
    case "delivery":
      return "Ready for Delivery";
    case "completed":
      return "Completed";
    default:
      return stage;
  }
};

// Helper function to get stage badge color
const getStageBadgeColor = (stage: string): string => {
  switch (stage) {
    case "enquiry":
      return "bg-blue-100 text-blue-800 border-blue-200";
    case "pickup":
      return "bg-yellow-100 text-yellow-800 border-yellow-200";
    case "service":
      return "bg-purple-100 text-purple-800 border-purple-200";
    case "delivery":
      return "bg-orange-100 text-orange-800 border-orange-200";
    case "completed":
      return "bg-green-100 text-green-800 border-green-200";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200";
  }
};


interface CRMModuleProps {
  activeAction?: string | null;
}

export function CRMModule({ activeAction }: CRMModuleProps = {}) {
  const { toast } = useToast();
  
  // Use API hooks with 30-second polling
  const { 
    enquiries, 
    loading: enquiriesLoading, 
    error: enquiriesError, 
    addEnquiry, 
    updateEnquiry,
    deleteEnquiry
  } = useEnquiriesWithPolling(30000);
  
  const { 
    stats, 
    loading: statsLoading, 
    error: statsError 
  } = useCrmStats();
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editData, setEditData] = useState<Partial<Enquiry>>({});
  
  // Convert dialog state
  const [showConvertDialog, setShowConvertDialog] = useState(false);
  const [convertingEnquiry, setConvertingEnquiry] = useState<Enquiry | null>(null);
  const [quotedAmount, setQuotedAmount] = useState<string>("");
  
  const [formData, setFormData] = useState({
    name: "",
    number: "",
    location: "",
    message: "",
    inquiryType: "",
    product: "",
    quantity: "1"
  });
  const [formErrors, setFormErrors] = useState<{[key: string]: string}>({});
  const [showSuccess, setShowSuccess] = useState(false);

  // Use stats from API instead of calculating locally
  const calculatedStats = stats || {
    totalCurrentMonth: 0,
    newThisWeek: 0,
    converted: 0,
    pendingFollowUp: 0
  };

  // Handle active action from quick actions
  useEffect(() => {
    if (activeAction === "add-enquiry") {
      setShowForm(true);
    }
  }, [activeAction]);

  // Individual field validation functions
  const validateField = (fieldName: string, value: string): string => {
    switch (fieldName) {
      case 'name':
        if (!value.trim()) {
          return "Customer name is required";
        } else if (value.trim().length < 2) {
          return "Name must be at least 2 characters long";
        }
        break;
      
      case 'number':
        if (!value.trim()) {
          return "Phone number is required";
        } else {
          // Remove all spaces and hyphens for validation
          const cleanNumber = value.replace(/[\s-]/g, '');
          // Indian phone number: optional +91 followed by exactly 10 digits
          const phoneRegex = /^(\+91)?[0-9]{10}$/;
          if (!phoneRegex.test(cleanNumber)) {
            return "Please enter valid phone number (10 digits, +91 optional)";
          }
        }
        break;
      
      case 'location':
        if (!value.trim()) {
          return "Address is required";
        } else if (value.trim().length < 10) {
          return "Please provide a complete address (at least 10 characters)";
        }
        break;
      
      case 'message':
        if (!value.trim()) {
          return "Message is required";
        } else if (value.trim().length < 10) {
          return "Message must be at least 10 characters long";
        }
        break;
      
      case 'inquiryType':
        if (!value) {
          return "Please select an inquiry source";
        }
        break;
      
      case 'product':
        if (!value) {
          return "Please select a product type";
        }
        break;
      
      case 'quantity': {
        const numValue = parseInt(value);
        if (!value || value.trim() === "") {
          return "Quantity is required";
        } else if (isNaN(numValue)) {
          return "Quantity must be a valid number";
        } else if (numValue < 1) {
          return "Quantity must be at least 1";
        } else if (numValue > 100) {
          return "Quantity cannot exceed 100";
        }
        break;
      }
    }
    return "";
  };

  const validateForm = () => {
    const errors: {[key: string]: string} = {};
    
    // Validate all fields
    const fields = ['name', 'number', 'location', 'message', 'inquiryType', 'product', 'quantity'];
    fields.forEach(field => {
      const error = validateField(field, formData[field as keyof typeof formData]);
      if (error) {
        errors[field] = error;
      }
    });
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      // Get fresh validation errors after validateForm() runs
      const errors: {[key: string]: string} = {};
      const fields = ['name', 'number', 'location', 'message', 'inquiryType', 'product', 'quantity'];
      fields.forEach(field => {
        const error = validateField(field, formData[field as keyof typeof formData]);
        if (error) {
          errors[field] = error;
        }
      });

      // Show toast with all validation errors
      if (Object.keys(errors).length > 0) {
        const fieldLabels: {[key: string]: string} = {
          name: "Customer Name",
          number: "Phone Number", 
          location: "Address",
          message: "Message",
          inquiryType: "Inquiry Source",
          product: "Product Type",
          quantity: "Quantity"
        };
        
        const errorCount = Object.keys(errors).length;
        const errorList = Object.keys(errors).map(field => `• ${fieldLabels[field]}: ${errors[field]}`);
        
        toast({
          title: `Please fix ${errorCount} error${errorCount > 1 ? 's' : ''}`,
          description: (
            <div className="space-y-1">
              {errorList.map((error, index) => (
                <div key={index} className="text-sm">{error}</div>
              ))}
            </div>
          ),
          className: "max-w-md bg-orange-50 border-orange-200 text-orange-800",
        });
      }
      return;
    }
    
    const newEnquiry = await addEnquiry({
      customerName: formData.name,
      phone: formData.number.replace(/\D/g, ''), // Remove non-digits
      address: formData.location,
      message: formData.message,
      inquiryType: formData.inquiryType as "Instagram" | "Facebook" | "WhatsApp",
      product: formData.product as "Bag" | "Shoe" | "Wallet" | "Belt" | "All type furniture",
      quantity: parseInt(formData.quantity) || 1,
      date: new Date().toISOString().split('T')[0],
      status: "new",
      contacted: false,
      currentStage: "enquiry",

    });
    setFormData({ name: "", number: "", location: "", message: "", inquiryType: "", product: "", quantity: "1" });
    setFormErrors({});
    
    // Show success message in modal
    setShowSuccess(true);
    
    // Auto close modal after showing success
    setTimeout(() => {
      setShowSuccess(false);
      setShowForm(false);
    }, 2000);
  };

  const handleEdit = (enquiry: Enquiry) => {
    setEditingId(enquiry.id);
    setEditData(enquiry);
  };

  const handleSaveEdit = async (id: number) => {
    try {
      const updatedEnquiry = await updateEnquiry(id, editData);
      if (updatedEnquiry) {
        setEditingId(null);
        setEditData({});
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update enquiry",
        variant: "destructive",
      });
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditData({});
  };

  const handleDelete = async (enquiry: Enquiry) => {
    if (window.confirm(`Are you sure you want to delete the enquiry for ${enquiry.customerName}?`)) {
      try {
        await deleteEnquiry(enquiry.id);
        toast({
          title: "Enquiry Deleted",
          description: `${enquiry.customerName}'s enquiry has been deleted successfully.`,
          className: "bg-red-50 border-red-200 text-red-800",
        });
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to delete enquiry",
          variant: "destructive",
        });
      }
    }
  };

  const markAsConverted = (enquiry: Enquiry) => {
    setConvertingEnquiry(enquiry);
    setQuotedAmount(""); // Clear previous quoted amount
    setShowConvertDialog(true);
  };

  const schedulePickup = async (enquiry: Enquiry) => {
    try {
      const updatedEnquiry = await updateEnquiry(enquiry.id, {
        currentStage: "pickup" as const,
        status: "converted" as const,
      });
      
      if (updatedEnquiry) {
        toast({
          title: "Pickup Scheduled!",
          description: `${enquiry.customerName}'s item moved to pickup!`,
          className: "bg-green-50 border-green-200 text-green-800",
          duration: 1000,
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to schedule pickup",
        variant: "destructive",
      });
    }
  };

  const getInquiryIcon = (type: string) => {
    switch (type) {
      case "Instagram": return <Instagram className="h-4 w-4" />;
      case "Facebook": return <Facebook className="h-4 w-4" />;
      case "WhatsApp": return <MessageCircle className="h-4 w-4" />;
      default: return null;
    }
  };

  // const getProductIcon = (product: string) => {
  //   return product === "Bag" ? <Briefcase className="h-4 w-4" /> : <ShoppingBag className="h-4 w-4" />;
  // };

  const getProductIcon = (product: string) => {
  const iconMap = {
    "Bag": <Briefcase className="h-4 w-4" />,
    "Shoe": <Footprints className="h-4 w-4" />, // Using Package as closest match for shoes
    "Wallet": <Wallet className="h-4 w-4" />,
    "Belt": <AlarmSmoke className="h-4 w-4" />,
    "All type furniture": <Sofa className="h-4 w-4" />
  };

  return iconMap[product] || <ShoppingBag className="h-4 w-4" />; // Default fallback icon
};
const getProductIconAlternative = (product: string) => {
  const iconMap = {
    "Bag": <Briefcase className="h-4 w-4" />,
    "Shoe": <Footprints className="h-4 w-4" />, // Keep ShoppingBag for shoes if preferred
    "Wallet": <Wallet className="h-4 w-4" />,
    "Belt": <AlarmSmoke className="h-4 w-4" />,
    "All type furniture": <Sofa className="h-4 w-4" />
  };

  return iconMap[product] || <Package className="h-4 w-4" />; // Default fallback icon
};

  const getStatusColor = (status: string) => {
    switch (status) {
      case "new": return "bg-blue-100 text-blue-800 border-blue-200";
      case "contacted": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "converted": return "bg-green-100 text-green-800 border-green-200";
      case "closed": return "bg-gray-100 text-gray-800 border-gray-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getContactStatus = (enquiry: Enquiry) => {
    if (enquiry.contacted) {
      return (
        <div className="flex items-center space-x-1 text-green-600">
          <PhoneCall className="h-4 w-4" />
          <span className="text-sm font-medium">Contacted</span>
          {enquiry.contactedAt && <span className="text-xs text-gray-500">({enquiry.contactedAt})</span>}
        </div>
      );
    } else {
      return (
        <div className="flex items-center space-x-1 text-gray-400">
          <Phone className="h-4 w-4" />
          <span className="text-sm">Not Contacted</span>
        </div>
      );
    }
  };

  const filteredEnquiries = enquiries
    .filter(enquiry =>
      enquiry.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      enquiry.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
      enquiry.message.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      // Sort by creation date in descending order (newest first)
      // If dates are the same, sort by ID in descending order (higher ID = newer)
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      
      if (dateA.getTime() === dateB.getTime()) {
        return b.id - a.id; // Higher ID first if dates are same
      }
      
      return dateB.getTime() - dateA.getTime(); // Newer date first
    });

  const showReviewSection = formData.product && parseInt(formData.quantity) > 0;

  return (
    <div className="space-y-4 sm:space-y-6 animate-fade-in p-2 sm:p-0">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">CRM Module</h1>
          <p className="text-sm sm:text-base text-muted-foreground">Manage customer enquiries and leads</p>
        </div>
        <Button onClick={() => {
          setShowForm(!showForm);
          if (!showForm) {
            setFormErrors({});
            setShowSuccess(false);
          }
        }} className="bg-blue-600 hover:bg-blue-700 text-white w-full sm:w-auto">
          <Plus className="h-4 w-4 mr-0" />
          Add Enquiry
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <Card className="p-3 sm:p-4 bg-white border shadow-sm">
          <div className="text-lg sm:text-2xl font-bold text-gray-900">
            {statsLoading ? <Loader2 className="h-6 w-6 animate-spin" /> : calculatedStats.totalCurrentMonth}
          </div>
          <div className="text-xs sm:text-sm text-gray-500">This Month</div>
        </Card>
        <Card className="p-3 sm:p-4 bg-white border shadow-sm">
          <div className="text-lg sm:text-2xl font-bold text-blue-600">
            {statsLoading ? <Loader2 className="h-6 w-6 animate-spin" /> : calculatedStats.newThisWeek}
          </div>
          <div className="text-xs sm:text-sm text-gray-500">This Week</div>
        </Card>
        <Card className="p-3 sm:p-4 bg-white border shadow-sm">
          <div className="text-lg sm:text-2xl font-bold text-green-600">
            {statsLoading ? <Loader2 className="h-6 w-6 animate-spin" /> : calculatedStats.converted}
          </div>
          <div className="text-xs sm:text-sm text-gray-500">Converted</div>
        </Card>
        <Card className="p-3 sm:p-4 bg-white border shadow-sm">
          <div className="text-lg sm:text-2xl font-bold text-yellow-600">
            {statsLoading ? <Loader2 className="h-6 w-6 animate-spin" /> : calculatedStats.pendingFollowUp}
          </div>
          <div className="text-xs sm:text-sm text-gray-500">Pending Follow-up</div>
        </Card>
      </div>

      {/* Add Enquiry Modal */}
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-white border shadow-lg">
          <DialogHeader className="pb-4">
            <DialogTitle className="text-xl font-semibold text-gray-900">Add New Enquiry</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 text-gray-700">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name" className="text-sm font-medium text-gray-700">Customer Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => {
                    setFormData({ ...formData, name: e.target.value });
                    if (formErrors.name) {
                      setFormErrors({ ...formErrors, name: "" });
                    }
                  }}
                  onBlur={(e) => {
                    const error = validateField('name', e.target.value);
                    if (error) {
                      setFormErrors({ ...formErrors, name: error });
                    }
                  }}
                  className={`mt-1 ${formErrors.name ? 'border-red-500 focus:border-red-500' : ''}`}
                />
                {formErrors.name && <p className="text-red-500 text-xs mt-1">{formErrors.name}</p>}
              </div>
              <div>
                <Label htmlFor="number" className="text-sm font-medium text-gray-700">Phone Number *</Label>
                <Input
                  id="number"
                  value={formData.number}
                  onChange={(e) => {
                    setFormData({ ...formData, number: e.target.value });
                    if (formErrors.number) {
                      setFormErrors({ ...formErrors, number: "" });
                    }
                  }}
                  onBlur={(e) => {
                    const error = validateField('number', e.target.value);
                    if (error) {
                      setFormErrors({ ...formErrors, number: error });
                    }
                  }}
                  className={`mt-1 ${formErrors.number ? 'border-red-500 focus:border-red-500' : ''}`}
                />
                {formErrors.number && <p className="text-red-500 text-xs mt-1">{formErrors.number}</p>}
              </div>
              <div>
                <Label htmlFor="inquiryType" className="text-sm font-medium text-gray-700">Inquiry Source *</Label>
                <Select 
                  value={formData.inquiryType} 
                  onValueChange={(value) => {
                    setFormData({ ...formData, inquiryType: value });
                    if (formErrors.inquiryType) {
                      setFormErrors({ ...formErrors, inquiryType: "" });
                    }
                    // Validate on change for select fields
                    const error = validateField('inquiryType', value);
                    if (error) {
                      setFormErrors({ ...formErrors, inquiryType: error });
                    }
                  }}
                >
                  <SelectTrigger className={`mt-1 ${formErrors.inquiryType ? 'border-red-500 focus:border-red-500' : ''}`}>
                    <SelectValue placeholder="Select source" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Instagram">Instagram</SelectItem>
                    <SelectItem value="Facebook">Facebook</SelectItem>
                    <SelectItem value="WhatsApp">WhatsApp</SelectItem>
                  </SelectContent>
                </Select>
                {formErrors.inquiryType && <p className="text-red-500 text-xs mt-1">{formErrors.inquiryType}</p>}
              </div>
              <div>
                <Label htmlFor="product" className="text-sm font-medium text-gray-700">Product Type *</Label>
                <Select 
                  value={formData.product} 
                  onValueChange={(value) => {
                    setFormData({ ...formData, product: value });
                    if (formErrors.product) {
                      setFormErrors({ ...formErrors, product: "" });
                    }
                    // Validate on change for select fields
                    const error = validateField('product', value);
                    if (error) {
                      setFormErrors({ ...formErrors, product: error });
                    }
                  }}
                >
                  <SelectTrigger className={`mt-1 ${formErrors.product ? 'border-red-500 focus:border-red-500' : ''}`}>
                    <SelectValue placeholder="Select product" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Bag">Bag</SelectItem>
                    <SelectItem value="Shoe">Shoe</SelectItem>
                    <SelectItem value="Wallet">Wallet</SelectItem>
                    <SelectItem value="Belt">Belt</SelectItem>
                    <SelectItem value="All type furniture">All type furniture</SelectItem>
                  </SelectContent>
                </Select>
                {formErrors.product && <p className="text-red-500 text-xs mt-1">{formErrors.product}</p>}
              </div>
            </div>
            
            {/* Product Quantity */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="quantity" className="text-sm font-medium text-gray-700">Product Quantity *</Label>
                <Input
                  id="quantity"
                  type="text"
                  value={formData.quantity}
                  onChange={(e) => {
                    // Only allow numbers
                    const value = e.target.value.replace(/[^0-9]/g, '');
                    setFormData({ ...formData, quantity: value });
                    if (formErrors.quantity) {
                      setFormErrors({ ...formErrors, quantity: "" });
                    }
                  }}
                  onBlur={(e) => {
                    const error = validateField('quantity', e.target.value);
                    if (error) {
                      setFormErrors({ ...formErrors, quantity: error });
                    }
                  }}
                  placeholder="Enter quantity (e.g., 2)"
                  className={`mt-1 ${formErrors.quantity ? 'border-red-500 focus:border-red-500' : ''}`}
                />
                {formErrors.quantity && <p className="text-red-500 text-xs mt-1">{formErrors.quantity}</p>}
              </div>
            </div>

            {/* Address Field - Full Width */}
            <div>
              <Label htmlFor="location" className="text-sm font-medium text-gray-700">Address *</Label>
              <Textarea
                id="location"
                value={formData.location}
                onChange={(e) => {
                  setFormData({ ...formData, location: e.target.value });
                  if (formErrors.location) {
                    setFormErrors({ ...formErrors, location: "" });
                  }
                }}
                                 onBlur={(e) => {
                   const error = validateField('location', e.target.value);
                   if (error) {
                     setFormErrors({ ...formErrors, location: error });
                   }
                 }}
                placeholder="Enter complete address..."
                className={`mt-1 min-h-[80px] ${formErrors.location ? 'border-red-500 focus:border-red-500' : ''}`}
                rows={3}
              />
              {formErrors.location && <p className="text-red-500 text-xs mt-1">{formErrors.location}</p>}
            </div>
            
            <div>
              <Label htmlFor="message" className="text-sm font-medium text-gray-700">Message *</Label>
              <Textarea
                id="message"
                value={formData.message}
                onChange={(e) => {
                  setFormData({ ...formData, message: e.target.value });
                  if (formErrors.message) {
                    setFormErrors({ ...formErrors, message: "" });
                  }
                }}
                                 onBlur={(e) => {
                   const error = validateField('message', e.target.value);
                   if (error) {
                     setFormErrors({ ...formErrors, message: error });
                   }
                 }}
                placeholder="Customer's inquiry details..."
                className={`mt-1 min-h-[100px] ${formErrors.message ? 'border-red-500 focus:border-red-500' : ''}`}
                rows={4}
              />
              {formErrors.message && <p className="text-red-500 text-xs mt-1">{formErrors.message}</p>}
            </div>

            {/* Review Section */}
            {showReviewSection && (
              <Card className="p-4 bg-blue-50 border border-blue-200">
                <h4 className="text-sm font-semibold text-gray-900 mb-3">Review Selection</h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                  <div className="flex items-center space-x-2">
                    {getProductIcon(formData.product)}
                    <span className="font-medium text-gray-700">Product:</span>
                    <span className="text-gray-900">{formData.product}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="font-medium text-gray-700">Quantity:</span>
                    <span className="text-gray-900 bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
                      {formData.quantity}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    {getInquiryIcon(formData.inquiryType)}
                    <span className="font-medium text-gray-700">Source:</span>
                    <span className="text-gray-900">{formData.inquiryType}</span>
                  </div>
                </div>
              </Card>
            )}

            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 pt-4">
              <Button onClick={handleSubmit} className="bg-blue-600 hover:bg-blue-700 text-white w-full sm:w-auto">
                Save Enquiry
              </Button>
              <Button variant="outline" onClick={() => {
                setShowForm(false);
                setFormErrors({});
                setShowSuccess(false);
              }} className="w-full sm:w-auto">
                Cancel
              </Button>
            </div>

            {/* Success Message */}
            {showSuccess && (
              <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-green-100 border border-green-300 text-green-800 px-6 py-3 rounded-lg shadow-lg flex items-center space-x-2 z-50">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <span className="font-medium">Enquiry added successfully!</span>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Search and Filter */}
      <Card className="p-3 sm:p-4 bg-white border shadow-sm">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search enquiries..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          {/* <Button variant="outline" size="sm" className="w-full sm:w-auto">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button> */}
        </div>
      </Card>

      {/* Enquiries List */}
      <div className="space-y-3 sm:space-y-4">
        {enquiriesLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            <span className="ml-2 text-gray-600">Loading enquiries...</span>
          </div>
        ) : enquiriesError ? (
          <div className="flex items-center justify-center py-8">
            <div className="text-center">
              <p className="text-red-600 mb-2">Error loading enquiries</p>
              <p className="text-sm text-gray-500">{enquiriesError}</p>
            </div>
          </div>
        ) : filteredEnquiries.length === 0 ? (
          <div className="flex items-center justify-center py-8">
            <div className="text-center">
              <p className="text-gray-600 mb-2">No enquiries found</p>
              <p className="text-sm text-gray-500">Try adjusting your search or add a new enquiry</p>
            </div>
          </div>
        ) : (
          filteredEnquiries.map((enquiry) => (
          <Card key={enquiry.id} className="p-4 sm:p-6 bg-white border shadow-sm hover:shadow-md transition-all duration-300">
            {editingId === enquiry.id ? (
              // Edit Mode
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-gray-900 text-lg">Edit Enquiry</h3>
                  <div className="flex space-x-2">
                    <Button size="sm" onClick={() => handleSaveEdit(enquiry.id)} className="bg-green-600 hover:bg-green-700 text-white">
                      <Save className="h-4 w-4 mr-1" />
                      Save
                    </Button>
                    <Button size="sm" variant="outline" onClick={handleCancelEdit}>
                      <X className="h-4 w-4 mr-1" />
                      Cancel
                    </Button>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-700">Name</Label>
                                         <Input
                       value={editData.customerName || enquiry.customerName}
                       onChange={(e) => setEditData({ ...editData, customerName: e.target.value })}
                       className="mt-1"
                     />
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-700">Phone</Label>
                                         <Input
                       value={editData.phone || enquiry.phone}
                       onChange={(e) => setEditData({ ...editData, phone: e.target.value })}
                       className="mt-1"
                     />
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-700">Product</Label>
                    <Select value={editData.product || enquiry.product} onValueChange={(value) => setEditData({ ...editData, product: value as "Bag" | "Shoe" | "Wallet" | "Belt" | "All type furniture" })}>
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Bag">Bag</SelectItem>
                        <SelectItem value="Shoe">Shoe</SelectItem>
                        <SelectItem value="Wallet">Wallet</SelectItem>
                        <SelectItem value="Belt">Belt</SelectItem>
                        <SelectItem value="All type furniture">All type furniture</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-700">Quantity</Label>
                    <Input
                      type="number"
                      min="1"
                      value={editData.quantity || enquiry.quantity}
                      onChange={(e) => setEditData({ ...editData, quantity: parseInt(e.target.value) || 1 })}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-700">Status</Label>
                    <Select value={editData.status || enquiry.status} onValueChange={(value) => setEditData({ ...editData, status: value as Enquiry['status'] })}>
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="new">New</SelectItem>
                        <SelectItem value="contacted">Contacted</SelectItem>
                        <SelectItem value="converted">Converted</SelectItem>
                        <SelectItem value="closed">Closed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-700">Contacted</Label>
                    <Select 
                      value={editData.contacted !== undefined ? editData.contacted.toString() : enquiry.contacted.toString()} 
                      onValueChange={(value) => setEditData({ ...editData, contacted: value === 'true' })}
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="false">Not Contacted</SelectItem>
                        <SelectItem value="true">Contacted</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div>
                  <Label className="text-sm font-medium text-gray-700">Address</Label>
                                     <Textarea
                     value={editData.address || enquiry.address}
                     onChange={(e) => setEditData({ ...editData, address: e.target.value })}
                     className="mt-1"
                     rows={2}
                   />
                </div>
                
                <div>
                  <Label className="text-sm font-medium text-gray-700">Message</Label>
                  <Textarea
                    value={editData.message || enquiry.message}
                    onChange={(e) => setEditData({ ...editData, message: e.target.value })}
                    className="mt-1"
                    rows={3}
                  />
                </div>
              </div>
            ) : (
              // View Mode
              <div className="flex flex-col lg:flex-row lg:items-start justify-between space-y-4 lg:space-y-0">
                <div className="flex-1">
                                     <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-3 mb-3">
                     <h3 className="font-semibold text-gray-900 text-lg">{enquiry.customerName}</h3>
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge className={`${getStatusColor(enquiry.status)} text-xs px-2 py-1 rounded-full font-medium`}>
                        {enquiry.status}
                      </Badge>
                      <div className="flex items-center space-x-1 text-gray-500">
                        {getInquiryIcon(enquiry.inquiryType)}
                        <span className="text-sm">{enquiry.inquiryType}</span>
                      </div>
                      <div className="flex items-center space-x-1 text-gray-500">
                        {getProductIcon(enquiry.product)}
                        <span className="text-sm">{enquiry.product}</span>
                      </div>
                      <div className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
                        Qty: {enquiry.quantity}
                      </div>
                    </div>
                  </div>
                                     <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 text-sm text-gray-600 mb-3">
                     <div className="flex items-center">📞 {enquiry.phone}</div>
                     <div className="flex items-center">📍 {enquiry.address}</div>
                                           <div className="flex items-center">📅 {new Date(enquiry.date).toLocaleDateString()}</div>
                   </div>
                  <p className="text-gray-700 text-sm sm:text-base mb-3">{enquiry.message}</p>
                  {/* Contact Status Display */}
                  <div className="mt-3">
                    {getContactStatus(enquiry)}
                  </div>
                  
                  {/* Quoted Amount Display */}
                  {enquiry.status === "converted" && enquiry.quotedAmount && (
                    <div className="mt-2 flex items-center space-x-1 text-green-600">
                      <span className="text-sm font-medium">₹{enquiry.quotedAmount}</span>
                      <span className="text-xs text-gray-500">(Approx)</span>
                    </div>
                  )}
                </div>
                <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-3 lg:ml-4 min-w-fit">
                  {/* Status/Stage Badge - Left Side */}
                  {enquiry.currentStage !== "enquiry" && (
                    <Badge className={`${getStageBadgeColor(enquiry.currentStage)} text-xs px-2 py-1 rounded-full font-medium`}>
                      {getStageDisplay(enquiry.currentStage)}
                    </Badge>
                  )}
                  
                  {/* Action Buttons - Center */}
                  {enquiry.currentStage === "enquiry" && enquiry.status === "new" && (
                    <Button 
                      size="sm" 
                      onClick={() => markAsConverted(enquiry)} 
                      className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Mark as Converted
                    </Button>
                  )}
                  
                  {enquiry.currentStage === "enquiry" && enquiry.status === "converted" && (
                    <Button 
                      size="sm" 
                      onClick={() => schedulePickup(enquiry)} 
                      className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white"
                    >
                      <ArrowRight className="h-4 w-4 mr-1" />
                      Schedule Pickup
                    </Button>
                  )}
                  
                  {/* Edit Button - Right Side */}
                  <Button size="sm" variant="outline" onClick={() => handleEdit(enquiry)} className="w-full sm:w-auto">
                    <Edit className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                  
                  {/* Delete Button */}
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={() => handleDelete(enquiry)} 
                    className="w-full sm:w-auto text-red-600 border-red-200 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    Delete
                  </Button>
                </div>
              </div>
            )}
          </Card>
        ))
        )}
      </div>
      
      {/* Convert Enquiry Dialog */}
      <Dialog open={showConvertDialog} onOpenChange={setShowConvertDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Convert Enquiry</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {convertingEnquiry && (
              <div className="space-y-3">
                <div className="p-3 bg-gray-50 rounded-lg">
                  <h4 className="font-medium text-gray-900">{convertingEnquiry.customerName}</h4>
                  <p className="text-sm text-gray-600">{convertingEnquiry.message}</p>
                  <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
                    <span>{convertingEnquiry.product}</span>
                    <span>•</span>
                    <span>Qty: {convertingEnquiry.quantity}</span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="quotedAmount" className="text-sm font-medium text-gray-700">
                    Approx Amount (₹)
                  </Label>
                  <Input
                    id="quotedAmount"
                    type="text"
                    placeholder="0.00"
                    value={quotedAmount}
                    onChange={(e) => {
                      const value = e.target.value;
                      // Allow only valid currency format: numbers with optional decimal and up to 2 decimal places
                      if (value === '' || /^\d*\.?\d{0,2}$/.test(value)) {
                        setQuotedAmount(value);
                      }
                    }}
                    className="w-full"
                  />
                  <p className="text-xs text-gray-500">
                    Enter amount in format: 0.00 (minimum 0.00)
                  </p>
                </div>
              </div>
            )}
          </div>
          
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowConvertDialog(false);
                setConvertingEnquiry(null);
                setQuotedAmount("");
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={async () => {
                if (convertingEnquiry && quotedAmount.trim()) {
                  const amount = parseFloat(quotedAmount);
                  if (isNaN(amount) || amount < 0) {
                    toast({
                      title: "Invalid Amount",
                      description: "Please enter a valid quoted amount (0.00 or greater).",
                      variant: "destructive",
                    });
                    return;
                  }
                  
                  const updatedEnquiry = {
                    ...convertingEnquiry,
                    status: "converted" as const,
                    contacted: true,
                    contactedAt: new Date().toISOString(),
                    quotedAmount: amount
                  };
                  
                  const result = await updateEnquiry(convertingEnquiry.id, updatedEnquiry);
                  if (result) {
                    toast({
                      title: "Enquiry Converted!",
                      description: `${convertingEnquiry.customerName} has been marked as converted with quoted amount ₹${amount}.`,
                      className: "bg-blue-50 border-blue-200 text-blue-800",
                    });
                  }
                  
                  setShowConvertDialog(false);
                  setConvertingEnquiry(null);
                  setQuotedAmount("");
                } else {
                  toast({
                    title: "Missing Information",
                    description: "Please enter a quoted amount (0.00 or greater) to convert this enquiry.",
                    variant: "destructive",
                  });
                }
              }}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              Convert Enquiry
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}