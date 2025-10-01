// Default/dummy data for reset functionality
export const defaultConfig: WebConfig = {
  basicDetails: {
    storeName: "Your Store Name",
    description: "Premium quality products with exceptional customer service",
    whatsappNumber: "+1 (555) 123-4567",
    email: "contact@yourstore.com",
    logo: "https://i.imghippo.com/files/RXA1166Gck.jpg",
  },
  contactInfo: {
    getInTouchContent:
      "Our customer support team is here to help you with any questions, concerns, or feedback. We're committed to providing you with the best shopping experience possible.",
    phoneSupport: "+1 (555) 123-4567",
    available24_7: true,
    emailSupport: "support@yourstore.com",
    responseTime: "Response within 24 hours",
    businessHours: {
      monday: { enabled: true, hours: "9:00 AM - 6:00 PM" },
      tuesday: { enabled: true, hours: "9:00 AM - 6:00 PM" },
      wednesday: { enabled: true, hours: "9:00 AM - 6:00 PM" },
      thursday: { enabled: true, hours: "9:00 AM - 6:00 PM" },
      friday: { enabled: true, hours: "9:00 AM - 6:00 PM" },
      saturday: { enabled: true, hours: "10:00 AM - 4:00 PM" },
      sunday: { enabled: false, hours: "Closed" },
    },
    quickHelpOptions: ["live_chat", "technical_support"],
  },
  aboutUs: {
    ourStory:
      "Founded with a passion for quality and customer satisfaction, we've been serving customers worldwide with premium products and exceptional service. Our journey began with a simple mission: to make online shopping a delightful experience for everyone.",
    ourMission:
      "To provide high-quality products at competitive prices while delivering exceptional customer service that exceeds expectations. We strive to build lasting relationships with our customers through trust, reliability, and innovation.",
    ourVision:
      "To become the world's most trusted online marketplace, where customers can find everything they need with confidence. We envision a future where shopping is seamless, sustainable, and accessible to everyone.",
    ourValues: {
      trust:
        "We build trust through transparency, reliability, and consistent quality in everything we do.",
      excellence:
        "We strive for excellence in our products, services, and customer relationships.",
      sustainability:
        "We're committed to sustainable practices and environmental responsibility.",
      community:
        "We believe in building strong communities and giving back to society.",
    },
    whyChooseUs: {
      secureShopping:
        "Your data and transactions are protected with industry-leading security measures.",
      fastDelivery:
        "Quick and reliable shipping options to get your products delivered on time.",
      customerFirst:
        "Our dedicated support team is always ready to help you with any questions or concerns.",
    },
    stats: {
      happyCustomers: "10K+",
      products: "500+",
      countriesServed: "50+",
      uptime: "99.9%",
    },
    ourTeam:
      "We're a passionate team of professionals dedicated to making your shopping experience exceptional. From our customer service representatives to our logistics experts, everyone works together to ensure your satisfaction.",
  },
};

export interface BasicDetails {
  storeName: string;
  description: string;
  whatsappNumber: string;
  email: string;
  logo: string;
}

export interface ContactInfo {
  getInTouchContent: string;
  phoneSupport: string;
  available24_7: boolean;
  emailSupport: string;
  responseTime: string;
  businessHours: {
    monday: { enabled: boolean; hours: string };
    tuesday: { enabled: boolean; hours: string };
    wednesday: { enabled: boolean; hours: string };
    thursday: { enabled: boolean; hours: string };
    friday: { enabled: boolean; hours: string };
    saturday: { enabled: boolean; hours: string };
    sunday: { enabled: boolean; hours: string };
  };
  quickHelpOptions: string[];
}

export interface AboutUsContent {
  ourStory: string;
  ourMission: string;
  ourVision: string;
  ourValues: {
    trust: string;
    excellence: string;
    sustainability: string;
    community: string;
  };
  whyChooseUs: {
    secureShopping: string;
    fastDelivery: string;
    customerFirst: string;
  };
  stats: {
    happyCustomers: string;
    products: string;
    countriesServed: string;
    uptime: string;
  };
  ourTeam: string;
}

export interface WebConfig {
  basicDetails: BasicDetails;
  contactInfo: ContactInfo;
  aboutUs: AboutUsContent;
}

// Helper function to convert quickHelp object to array
export const convertQuickHelpToArray = (quickHelp: any): string[] => {
  if (!quickHelp || typeof quickHelp !== "object") {
    return [];
  }

  const helpOptions: string[] = [];
  if (quickHelp.liveChatSupport) helpOptions.push("live_chat");
  if (quickHelp.technicalSupport) helpOptions.push("technical_support");
  if (quickHelp.accountHelp) helpOptions.push("account_help");

  return helpOptions;
};

// Helper function to convert quickHelp array to object for API
export const convertQuickHelpToObject = (quickHelpArray: string[]) => {
  return {
    liveChatSupport: quickHelpArray.includes("live_chat"),
    technicalSupport: quickHelpArray.includes("technical_support"),
    accountHelp: quickHelpArray.includes("account_help"),
  };
};

// Helper function to convert business hours from API format to component format
export const convertBusinessHoursFromAPI = (businessHours: any[]) => {
  const hours: any = {
    monday: { enabled: false, hours: "Closed" },
    tuesday: { enabled: false, hours: "Closed" },
    wednesday: { enabled: false, hours: "Closed" },
    thursday: { enabled: false, hours: "Closed" },
    friday: { enabled: false, hours: "Closed" },
    saturday: { enabled: false, hours: "Closed" },
    sunday: { enabled: false, hours: "Closed" },
  };

  if (Array.isArray(businessHours)) {
    businessHours.forEach((dayData) => {
      const dayKey = dayData.day.toLowerCase();
      if (hours.hasOwnProperty(dayKey)) {
        hours[dayKey] = {
          enabled: dayData.isOpen,
        };
      }
    });
  }

  return hours;
};

// Helper function to convert business hours from component format to API format
export const convertBusinessHoursToAPI = (businessHours: any) => {
  const apiFormat: any[] = [];

  Object.entries(businessHours).forEach(([day, data]: [string, any]) => {
    const capitalizedDay = day.charAt(0).toUpperCase() + day.slice(1);

    if (data.enabled) {
      apiFormat.push({
        day: capitalizedDay,
        isOpen: true,
      });
    } else {
      apiFormat.push({
        day: capitalizedDay,
        isOpen: false,
      });
    }
  });

  return apiFormat;
};
