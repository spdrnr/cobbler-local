import { 
  Enquiry, 
  InventoryItem, 
  Expense, 
  StaffMember 
} from "@/types";

import {
  sampleEnquiries,
  sampleInventory,
  sampleExpenses,
  sampleStaff
} from "@/data/dummyData";

// Storage keys - Removed separate pickup/service orders as they're now part of enquiries
export const STORAGE_KEYS = {
  ENQUIRIES: 'cobbler_enquiries',
  INVENTORY: 'cobbler_inventory',
  EXPENSES: 'cobbler_expenses',
  STAFF: 'cobbler_staff',
  INITIALIZED: 'cobbler_initialized'
} as const;

// Generic localStorage utilities
export const storage = {
  get: <T>(key: string, defaultValue: T): T => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.error(`Error reading from localStorage key "${key}":`, error);
      return defaultValue;
    }
  },

  set: <T>(key: string, value: T): void => {
    try {
      // Try to save normally first
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.warn(`Storage quota exceeded for key "${key}". Attempting cleanup...`);
      
      // If quota exceeded, try to clean up old data
      try {
        // Clear old data to free space
        localStorage.removeItem('cobbler_service_orders');
        localStorage.removeItem('cobbler_pickup_orders');
        
        // Try saving again
        localStorage.setItem(key, JSON.stringify(value));
        console.log('Successfully saved after cleanup');
      } catch (cleanupError) {
        console.error(`Failed to save even after cleanup:`, cleanupError);
        
        // If still failing, try to compress the data
        try {
          const compressedValue = JSON.stringify(value).replace(/data:image\/[^;]+;base64,[^"]+/g, '[IMAGE_DATA]');
          localStorage.setItem(key, compressedValue);
          console.log('Saved compressed data (images removed)');
        } catch (compressionError) {
          console.error('Failed to save even compressed data:', compressionError);
        }
      }
    }
  },

  remove: (key: string): void => {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error(`Error removing localStorage key "${key}":`, error);
    }
  },

  clear: (): void => {
    try {
      // Only clear our app's data, not all localStorage
      Object.values(STORAGE_KEYS).forEach(key => {
        localStorage.removeItem(key);
      });
    } catch (error) {
      console.error('Error clearing localStorage:', error);
    }
  }
};

// Initialize data in localStorage if not present
export const initializeData = (): void => {
  const isInitialized = storage.get(STORAGE_KEYS.INITIALIZED, false);
  
  // Force reinitialize with new schema (remove this check after migration)
  const currentVersion = storage.get<string>('cobbler_schema_version', '1.0');
  const newVersion = '2.6'; // Force refresh to implement corrected workflow
  
  if (!isInitialized || currentVersion !== newVersion) {
    console.log('Initializing localStorage with new integrated workflow data...');
    
    // Clear any old fragmented data
    localStorage.removeItem('cobbler_service_orders');
    localStorage.removeItem('cobbler_pickup_orders');
    
    // Initialize with new integrated data structure
    storage.set(STORAGE_KEYS.ENQUIRIES, sampleEnquiries);
    storage.set(STORAGE_KEYS.INVENTORY, sampleInventory);
    storage.set(STORAGE_KEYS.EXPENSES, sampleExpenses);
    storage.set(STORAGE_KEYS.STAFF, sampleStaff);
    
    // Mark as initialized with new version
    storage.set(STORAGE_KEYS.INITIALIZED, true);
    storage.set('cobbler_schema_version', newVersion);
    
    console.log('New integrated workflow data initialized in localStorage');
  }
};

// Helper function to clean image data to prevent quota issues
const cleanImageData = (enquiries: Enquiry[]): Enquiry[] => {
  return enquiries.map(enquiry => ({
    ...enquiry,
    pickupDetails: enquiry.pickupDetails ? {
      ...enquiry.pickupDetails,
      photos: {
        beforePhoto: enquiry.pickupDetails.photos?.beforePhoto ? '[IMAGE_DATA]' : undefined,
        afterPhoto: enquiry.pickupDetails.photos?.afterPhoto ? '[IMAGE_DATA]' : undefined,
      }
    } : undefined,
    serviceDetails: enquiry.serviceDetails ? {
      ...enquiry.serviceDetails,
      serviceTypes: enquiry.serviceDetails.serviceTypes?.map(serviceType => ({
        ...serviceType,
        photos: {
          beforePhoto: serviceType.photos?.beforePhoto ? '[IMAGE_DATA]' : undefined,
          afterPhoto: serviceType.photos?.afterPhoto ? '[IMAGE_DATA]' : undefined,
        }
      })) || []
    } : undefined,
    deliveryDetails: enquiry.deliveryDetails ? {
      ...enquiry.deliveryDetails,
      photos: {
        beforePhoto: enquiry.deliveryDetails.photos?.beforePhoto ? '[IMAGE_DATA]' : undefined,
        afterPhoto: enquiry.deliveryDetails.photos?.afterPhoto ? '[IMAGE_DATA]' : undefined,
      }
    } : undefined,
  }));
};

// Enquiries data management
export const enquiriesStorage = {
  getAll: (): Enquiry[] => storage.get(STORAGE_KEYS.ENQUIRIES, []),
  
  save: (enquiries: Enquiry[]): void => {
    // Clean image data before saving to prevent quota issues
    const cleanedEnquiries = cleanImageData(enquiries);
    storage.set(STORAGE_KEYS.ENQUIRIES, cleanedEnquiries);
  },
  
  add: (enquiry: Omit<Enquiry, 'id'>): Enquiry => {
    const enquiries = enquiriesStorage.getAll();
    const newId = Math.max(0, ...enquiries.map(e => e.id)) + 1;
    const newEnquiry: Enquiry = { ...enquiry, id: newId };
    enquiries.push(newEnquiry);
    enquiriesStorage.save(enquiries);
    return newEnquiry;
  },
  
  update: (id: number, updates: Partial<Enquiry>): Enquiry | null => {
    const enquiries = enquiriesStorage.getAll();
    const index = enquiries.findIndex(e => e.id === id);
    if (index === -1) return null;
    
    enquiries[index] = { ...enquiries[index], ...updates };
    enquiriesStorage.save(enquiries);
    return enquiries[index];
  },
  
  delete: (id: number): boolean => {
    const enquiries = enquiriesStorage.getAll();
    const index = enquiries.findIndex(e => e.id === id);
    if (index === -1) return false;
    
    enquiries.splice(index, 1);
    enquiriesStorage.save(enquiries);
    return true;
  }
};

// Pickup Orders and Service Orders are now integrated into Enquiries
// Use enquiriesStorage for all workflow management

// Helper functions for workflow management
export const workflowHelpers = {
  // Get enquiries by current stage
  getByStage: (stage: string): Enquiry[] => {
    const enquiries = enquiriesStorage.getAll();
    return enquiries.filter(e => e.currentStage === stage);
  },
  
  // Get pickup stage enquiries
  getPickupEnquiries: (): Enquiry[] => {
    return workflowHelpers.getByStage('pickup');
  },
  
  // Get service stage enquiries  
  getServiceEnquiries: (): Enquiry[] => {
    return workflowHelpers.getByStage('service');
  },
  
  // Get work-done stage enquiries
  getWorkDoneEnquiries: (): Enquiry[] => {
    return workflowHelpers.getByStage('work-done');
  },
  
  // Get delivery stage enquiries
  getDeliveryEnquiries: (): Enquiry[] => {
    return workflowHelpers.getByStage('delivery');
  },
  
  // Get completed stage enquiries
  getCompletedEnquiries: (): Enquiry[] => {
    return workflowHelpers.getByStage('completed');
  },
  
  // Transition enquiry to next stage
  transitionToStage: (enquiryId: number, newStage: string): boolean => {
    const enquiries = enquiriesStorage.getAll();
    const index = enquiries.findIndex(e => e.id === enquiryId);
    if (index === -1) return false;
    
    enquiries[index] = { ...enquiries[index], currentStage: newStage as any };
    enquiriesStorage.save(enquiries);
    return true;
  }
};

// Inventory data management
export const inventoryStorage = {
  getAll: (): InventoryItem[] => storage.get(STORAGE_KEYS.INVENTORY, []),
  
  save: (items: InventoryItem[]): void => storage.set(STORAGE_KEYS.INVENTORY, items),
  
  add: (item: Omit<InventoryItem, 'id'>): InventoryItem => {
    const items = inventoryStorage.getAll();
    const newId = Math.max(0, ...items.map(i => i.id)) + 1;
    const newItem: InventoryItem = { ...item, id: newId };
    items.push(newItem);
    inventoryStorage.save(items);
    return newItem;
  },
  
  update: (id: number, updates: Partial<InventoryItem>): InventoryItem | null => {
    const items = inventoryStorage.getAll();
    const index = items.findIndex(i => i.id === id);
    if (index === -1) return null;
    
    items[index] = { ...items[index], ...updates };
    inventoryStorage.save(items);
    return items[index];
  },
  
  delete: (id: number): boolean => {
    const items = inventoryStorage.getAll();
    const index = items.findIndex(i => i.id === id);
    if (index === -1) return false;
    
    items.splice(index, 1);
    inventoryStorage.save(items);
    return true;
  }
};

// Expenses data management
export const expensesStorage = {
  getAll: (): Expense[] => storage.get(STORAGE_KEYS.EXPENSES, []),
  
  save: (expenses: Expense[]): void => storage.set(STORAGE_KEYS.EXPENSES, expenses),
  
  add: (expense: Omit<Expense, 'id'>): Expense => {
    const expenses = expensesStorage.getAll();
    const newId = Math.max(0, ...expenses.map(e => e.id)) + 1;
    const newExpense: Expense = { ...expense, id: newId };
    expenses.push(newExpense);
    expensesStorage.save(expenses);
    return newExpense;
  },
  
  update: (id: number, updates: Partial<Expense>): Expense | null => {
    const expenses = expensesStorage.getAll();
    const index = expenses.findIndex(e => e.id === id);
    if (index === -1) return null;
    
    expenses[index] = { ...expenses[index], ...updates };
    expensesStorage.save(expenses);
    return expenses[index];
  },
  
  delete: (id: number): boolean => {
    const expenses = expensesStorage.getAll();
    const index = expenses.findIndex(e => e.id === id);
    if (index === -1) return false;
    
    expenses.splice(index, 1);
    expensesStorage.save(expenses);
    return true;
  }
};

// Staff data management
export const staffStorage = {
  getAll: (): StaffMember[] => storage.get(STORAGE_KEYS.STAFF, []),
  
  save: (staff: StaffMember[]): void => storage.set(STORAGE_KEYS.STAFF, staff),
  
  add: (member: Omit<StaffMember, 'id'>): StaffMember => {
    const staff = staffStorage.getAll();
    const newId = Math.max(0, ...staff.map(s => s.id)) + 1;
    const newMember: StaffMember = { ...member, id: newId };
    staff.push(newMember);
    staffStorage.save(staff);
    return newMember;
  },
  
  update: (id: number, updates: Partial<StaffMember>): StaffMember | null => {
    const staff = staffStorage.getAll();
    const index = staff.findIndex(s => s.id === id);
    if (index === -1) return null;
    
    staff[index] = { ...staff[index], ...updates };
    staffStorage.save(staff);
    return staff[index];
  },
  
  delete: (id: number): boolean => {
    const staff = staffStorage.getAll();
    const index = staff.findIndex(s => s.id === id);
    if (index === -1) return false;
    
    staff.splice(index, 1);
    staffStorage.save(staff);
    return true;
  }
};

// Utility to reset all data to sample data
export const resetToSampleData = (): void => {
  console.log('Resetting all data to sample data...');
  storage.clear();
  initializeData();
  console.log('Data reset completed');
};

// Utility to export all data
export const exportAllData = () => {
  return {
    enquiries: enquiriesStorage.getAll(),
    inventory: inventoryStorage.getAll(),
    expenses: expensesStorage.getAll(),
    staff: staffStorage.getAll(),
    exportedAt: new Date().toISOString()
  };
};

// Utility to import all data
export const importAllData = (data: ReturnType<typeof exportAllData>): void => {
  if (data.enquiries) storage.set(STORAGE_KEYS.ENQUIRIES, data.enquiries);
  if (data.inventory) storage.set(STORAGE_KEYS.INVENTORY, data.inventory);
  if (data.expenses) storage.set(STORAGE_KEYS.EXPENSES, data.expenses);
  if (data.staff) storage.set(STORAGE_KEYS.STAFF, data.staff);
  
  console.log('Data import completed');
};
