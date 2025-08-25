import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Camera, CheckCircle, Clock, DollarSign, FileText, Image, Search, Upload, Send, ArrowRight, CheckSquare, Wrench } from "lucide-react";
import { Enquiry, ServiceStatus, ServiceType, ServiceTypeStatus } from "@/types";
import { enquiriesStorage, workflowHelpers } from "@/utils/localStorage";

export function ServiceModule() {
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [workNotes, setWorkNotes] = useState("");
  const [actualCost, setActualCost] = useState<number>(0);
  const [selectedServiceTypes, setSelectedServiceTypes] = useState<ServiceType[]>([]);
  const [showServiceAssignment, setShowServiceAssignment] = useState<number | null>(null);

  // Load service stage enquiries from localStorage on component mount and refresh periodically
  useEffect(() => {
    const loadServiceEnquiries = () => {
      const serviceEnquiries = workflowHelpers.getServiceEnquiries();
      setEnquiries(serviceEnquiries);
    };
    
    loadServiceEnquiries();
    
    // Refresh data every 2 seconds to catch updates from other modules
    const interval = setInterval(loadServiceEnquiries, 2000);
    
    return () => clearInterval(interval);
  }, []);

  // Calculate stats based on new multi-service structure
  const calculateStats = () => {
    let pendingCount = 0;
    let inProgressCount = 0;
    let doneCount = 0;
    let totalServices = 0;

    enquiries.forEach(enquiry => {
      if (enquiry.serviceDetails?.serviceTypes) {
        enquiry.serviceDetails.serviceTypes.forEach(service => {
          totalServices++;
          switch (service.status) {
            case "pending":
              pendingCount++;
              break;
            case "in-progress":
              inProgressCount++;
              break;
            case "done":
              doneCount++;
              break;
          }
        });
      }
    });

    return { pendingCount, inProgressCount, doneCount, totalServices };
  };

  const stats = calculateStats();

  const filteredEnquiries = enquiries.filter(
    (enquiry) =>
      enquiry.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      enquiry.product.toLowerCase().includes(searchTerm.toLowerCase()) ||
      enquiry.serviceDetails?.serviceTypes?.some(service => 
        service.type.toLowerCase().includes(searchTerm.toLowerCase())
      )
  );

  const getStatusColor = (status: ServiceStatus) => {
    switch (status) {
      case "pending":
        return "bg-yellow-500 text-white";
      case "in-progress":
        return "bg-blue-500 text-white";
      case "done":
        return "bg-green-500 text-white";
      default:
        return "bg-gray-500 text-white";
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const startService = (enquiryId: number, serviceType: ServiceType, department: string) => {
    const allEnquiries = enquiriesStorage.getAll();
    const updatedEnquiries = allEnquiries.map((enquiry) =>
      enquiry.id === enquiryId
        ? {
            ...enquiry,
            serviceDetails: {
              ...enquiry.serviceDetails!,
              serviceTypes: enquiry.serviceDetails!.serviceTypes.map(service =>
                service.type === serviceType
                  ? {
                      ...service,
                      status: "in-progress" as ServiceStatus,
                      department,
                      assignedTo: "Technician",
                      startedAt: new Date().toISOString()
                    }
                  : service
              )
            },
          }
        : enquiry
    );
    
    enquiriesStorage.save(updatedEnquiries);
    
    // Refresh service enquiries
    const updatedServiceEnquiries = workflowHelpers.getServiceEnquiries();
    setEnquiries(updatedServiceEnquiries);

    // Send WhatsApp notification
    const enquiry = enquiries.find((e) => e.id === enquiryId);
    if (enquiry) {
      alert(
        `WhatsApp sent to ${enquiry.customerName}!\n"Your ${enquiry.product} has been sent to ${department} for ${serviceType} work."`
      );
    }
  };

  const markServiceDone = (enquiryId: number, serviceType: ServiceType) => {
    const allEnquiries = enquiriesStorage.getAll();
    const updatedEnquiries = allEnquiries.map((enquiry) =>
      enquiry.id === enquiryId
        ? {
            ...enquiry,
            serviceDetails: {
              ...enquiry.serviceDetails!,
              serviceTypes: enquiry.serviceDetails!.serviceTypes.map(service =>
                service.type === serviceType
                  ? {
                      ...service,
                      status: "done" as ServiceStatus,
                      completedAt: new Date().toISOString(),
                      photos: {
                        ...service.photos,
                        afterPhoto: selectedImage || undefined,
                      }
                    }
                  : service
              )
            },
          }
        : enquiry
    );
    
    enquiriesStorage.save(updatedEnquiries);
    
    // Refresh service enquiries
    const updatedServiceEnquiries = workflowHelpers.getServiceEnquiries();
    setEnquiries(updatedServiceEnquiries);

    // Reset form
    setSelectedImage(null);

    // Send WhatsApp notification
    const enquiry = enquiries.find((e) => e.id === enquiryId);
    if (enquiry) {
      alert(
        `WhatsApp sent to ${enquiry.customerName}!\n"Your ${serviceType} work on ${enquiry.product} has been completed."`
      );
    }
  };

  const serviceComplete = (enquiryId: number) => {
    const currentTime = new Date().toISOString();
    
    // Check if all services are done
    const enquiry = enquiries.find((e) => e.id === enquiryId);
    if (!enquiry?.serviceDetails?.serviceTypes) return;
    
    const allServicesDone = enquiry.serviceDetails.serviceTypes.every(service => service.status === "done");
    if (!allServicesDone) {
      alert("All services must be completed before moving to Work Done stage.");
      return;
    }
    
    // Update enquiry to transition to work-done stage
    const allEnquiries = enquiriesStorage.getAll();
    const updatedEnquiries = allEnquiries.map((enquiry) =>
      enquiry.id === enquiryId
        ? {
            ...enquiry,
            currentStage: "work-done" as const,
            serviceDetails: {
              ...enquiry.serviceDetails!,
              actualCost: actualCost || enquiry.serviceDetails?.estimatedCost || 0,
              completedAt: currentTime,
              workNotes: workNotes,
            },
          }
        : enquiry
    );
    
    enquiriesStorage.save(updatedEnquiries);
    
    // Refresh service enquiries (the item will disappear since it's now in work-done stage)
    const updatedServiceEnquiries = workflowHelpers.getServiceEnquiries();
    setEnquiries(updatedServiceEnquiries);

    // Reset form
    setSelectedImage(null);
    setWorkNotes("");
    setActualCost(0);

    // Send WhatsApp notification
    if (enquiry) {
      alert(
        `WhatsApp sent to ${enquiry.customerName}!\n"All services on your ${enquiry.product} have been completed and it's ready for delivery!"`
      );
    }
  };

  const sendInvoice = (enquiry: Enquiry) => {
    console.log(
      `Sending invoice to ${enquiry.customerName} at ${enquiry.phone}`
    );
    alert(`Invoice sent to ${enquiry.customerName}!`);
  };

  const assignServices = (enquiryId: number) => {
    if (selectedServiceTypes.length === 0) {
      alert("Please select at least one service type");
      return;
    }

    const allEnquiries = enquiriesStorage.getAll();
    const updatedEnquiries = allEnquiries.map((enquiry) =>
      enquiry.id === enquiryId
        ? {
            ...enquiry,
            serviceDetails: {
              ...enquiry.serviceDetails!,
              serviceTypes: selectedServiceTypes.map(type => ({
                type,
                status: "pending" as const,
              }))
            },
          }
        : enquiry
    );
    
    enquiriesStorage.save(updatedEnquiries);
    
    // Refresh service enquiries
    const updatedServiceEnquiries = workflowHelpers.getServiceEnquiries();
    setEnquiries(updatedServiceEnquiries);

    // Reset form
    setSelectedServiceTypes([]);
    setShowServiceAssignment(null);

    // Send WhatsApp notification
    const enquiry = enquiries.find((e) => e.id === enquiryId);
    if (enquiry) {
      alert(
        `WhatsApp sent to ${enquiry.customerName}!\n"Services have been assigned for your ${enquiry.product}."`
      );
    }
  };

  const handleServiceTypeToggle = (serviceType: ServiceType) => {
    setSelectedServiceTypes(prev => 
      prev.includes(serviceType)
        ? prev.filter(type => type !== serviceType)
        : [...prev, serviceType]
    );
  };

  const getProgressText = (serviceTypes: ServiceTypeStatus[]) => {
    if (!serviceTypes || serviceTypes.length === 0) {
      return "No services assigned";
    }
    const doneCount = serviceTypes.filter(service => service.status === "done").length;
    const totalCount = serviceTypes.length;
    return `${doneCount}/${totalCount} services completed`;
  };

  const getOverallStatus = (serviceTypes: ServiceTypeStatus[]) => {
    if (!serviceTypes || serviceTypes.length === 0) {
      return "Unassigned";
    } else if (serviceTypes.every(service => service.status === "done")) {
      return "All Done";
    } else if (serviceTypes.some(service => service.status === "in-progress")) {
      return "In Progress";
    } else {
      return "Pending";
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6 animate-fade-in p-2 sm:p-0">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
            Service Workflow
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            Manage multi-service work from received items
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <Card className="p-3 sm:p-4 bg-gradient-card border-0 shadow-soft">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-lg sm:text-2xl font-bold text-foreground">
                {stats.pendingCount}
              </div>
              <div className="text-xs sm:text-sm text-muted-foreground">
                Pending Services
              </div>
            </div>
            <Clock className="h-6 w-6 sm:h-8 sm:w-8 text-warning" />
          </div>
        </Card>
        <Card className="p-3 sm:p-4 bg-gradient-card border-0 shadow-soft">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-lg sm:text-2xl font-bold text-foreground">
                {stats.inProgressCount}
              </div>
              <div className="text-xs sm:text-sm text-muted-foreground">
                In Progress
              </div>
            </div>
            <Wrench className="h-6 w-6 sm:h-8 sm:w-8 text-blue-500" />
          </div>
        </Card>
        <Card className="p-3 sm:p-4 bg-gradient-card border-0 shadow-soft">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-lg sm:text-2xl font-bold text-foreground">
                {stats.doneCount}
              </div>
              <div className="text-xs sm:text-sm text-muted-foreground">
                Completed Services
              </div>
            </div>
            <CheckCircle className="h-6 w-6 sm:h-8 sm:w-8 text-success" />
          </div>
        </Card>
        <Card className="p-3 sm:p-4 bg-gradient-card border-0 shadow-soft">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-lg sm:text-2xl font-bold text-foreground">
                {stats.totalServices}
              </div>
              <div className="text-xs sm:text-sm text-muted-foreground">
                Total Services
              </div>
            </div>
            <FileText className="h-6 w-6 sm:h-8 sm:w-8 text-purple-500" />
          </div>
        </Card>
      </div>

      {/* Search */}
      <Card className="p-3 sm:p-4 bg-gradient-card border-0 shadow-soft">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search services by customer, product, service type..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </Card>

      {/* Service Items */}
      <div className="space-y-4">
        <h2 className="text-xl sm:text-2xl font-bold text-foreground">
          Service Queue
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
                <div className="flex flex-col items-end gap-2">
                  <Badge className={`${getStatusColor(getOverallStatus(enquiry.serviceDetails?.serviceTypes || []) as ServiceStatus)} text-xs px-2 py-1 rounded-full font-medium`}>
                    {getOverallStatus(enquiry.serviceDetails?.serviceTypes || [])}
                  </Badge>
                  <Badge className="bg-blue-100 text-blue-800 border-blue-200 text-xs px-2 py-1 rounded-full font-medium">
                    {getProgressText(enquiry.serviceDetails?.serviceTypes || [])}
                  </Badge>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Image className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                  <span className="text-sm text-foreground">
                    {enquiry.product} ({enquiry.quantity} items)
                  </span>
                </div>

                <div className="flex items-center space-x-2">
                  <DollarSign className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                  <span className="text-sm font-semibold text-foreground">
                    Estimated: ₹{enquiry.serviceDetails?.estimatedCost || 0}
                  </span>
                </div>

                {/* Service Types */}
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-foreground">Services:</h4>
                  {enquiry.serviceDetails?.serviceTypes && enquiry.serviceDetails.serviceTypes.length > 0 ? (
                    enquiry.serviceDetails.serviceTypes.map((service, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-muted/50 rounded">
                        <div className="flex items-center space-x-2">
                          <span className="text-sm text-foreground">{service.type}</span>
                          <Badge className={`${getStatusColor(service.status)} text-xs`}>
                            {service.status}
                          </Badge>
                        </div>
                        <div className="flex space-x-1">
                          {service.status === "pending" && (
                            <Button
                              size="sm"
                              className="bg-blue-600 hover:bg-blue-700 text-xs"
                              onClick={() => startService(enquiry.id, service.type, service.type.toLowerCase().replace(/\s+/g, '-'))}
                            >
                              <Clock className="h-3 w-3 mr-1" />
                              Start
                            </Button>
                          )}
                          {service.status === "in-progress" && (
                            <Button
                              size="sm"
                              className="bg-green-600 hover:bg-green-700 text-xs"
                              onClick={() => markServiceDone(enquiry.id, service.type)}
                            >
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Done
                            </Button>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-sm text-muted-foreground">
                      No services assigned yet
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-4">
                <Button
                  size="sm"
                  variant="outline"
                  className="text-xs sm:text-sm"
                  onClick={() => sendInvoice(enquiry)}
                >
                  <Send className="h-3 w-3 mr-1" />
                  Send Invoice
                </Button>

                {(!enquiry.serviceDetails?.serviceTypes || enquiry.serviceDetails.serviceTypes.length === 0) && (
                  <Button
                    size="sm"
                    className="bg-blue-600 hover:bg-blue-700 text-xs sm:text-sm"
                    onClick={() => setShowServiceAssignment(enquiry.id)}
                  >
                    <Wrench className="h-3 w-3 mr-1" />
                    Assign Services
                  </Button>
                )}

                {enquiry.serviceDetails?.serviceTypes && enquiry.serviceDetails.serviceTypes.length > 0 && 
                 enquiry.serviceDetails.serviceTypes.every(service => service.status === "done") && (
                  <Button
                    size="sm"
                    className="bg-green-600 hover:bg-green-700 text-xs sm:text-sm"
                    onClick={() => serviceComplete(enquiry.id)}
                  >
                    <ArrowRight className="h-3 w-3 mr-1" />
                    All Services Complete - Send to Work Done
                  </Button>
                )}
              </div>

              {/* Service Assignment Dialog */}
              {showServiceAssignment === enquiry.id && (
                <Dialog open={showServiceAssignment === enquiry.id} onOpenChange={() => setShowServiceAssignment(null)}>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle>Assign Services</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label>Select Service Types (Multi-select)</Label>
                        <div className="space-y-2">
                          {["Sole Replacement", "Zipper Repair", "Cleaning & Polish", "Stitching", "Leather Treatment", "Hardware Repair"].map((serviceType) => (
                            <div key={serviceType} className="flex items-center space-x-2">
                              <Checkbox
                                id={`service-${serviceType}`}
                                checked={selectedServiceTypes.includes(serviceType as ServiceType)}
                                onCheckedChange={() => handleServiceTypeToggle(serviceType as ServiceType)}
                              />
                              <Label htmlFor={`service-${serviceType}`} className="text-sm">
                                {serviceType}
                              </Label>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button
                          onClick={() => assignServices(enquiry.id)}
                          className="flex-1 bg-blue-600 hover:bg-blue-700"
                          disabled={selectedServiceTypes.length === 0}
                        >
                          Assign Services
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => setShowServiceAssignment(null)}
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              )}
            </Card>
          ))}
        </div>

        {filteredEnquiries.length === 0 && (
          <Card className="p-8 text-center">
            <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">
              No Service Items
            </h3>
            <p className="text-muted-foreground">
              Service items will appear here once items are received from pickup.
            </p>
          </Card>
        )}
      </div>
    </div>
  );
}