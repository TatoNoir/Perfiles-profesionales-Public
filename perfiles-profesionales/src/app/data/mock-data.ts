import { ProfessionalBasic } from '../pages/professionals/services/professionals-list.service';
import { ProfessionalDetail } from '../pages/professional-detail/services/professional-detail.service';

// Datos básicos para listas
export const BASIC_PROFESSIONALS_DATA: ProfessionalBasic[] = [
  {
    id: '1',
    name: 'María González',
    profession: 'Desarrolladora Full Stack',
    category: 'tecnologia',
    rating: 4.9,
    reviews: 127,
    location: 'Madrid, España',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
    pricePerHour: 45,
    isVerified: true,
    status: 'available',
    description: 'Especialista en desarrollo web con React y Node.js',
    skills: ['React', 'Node.js', 'TypeScript', 'MongoDB', 'AWS', 'Docker']
  },
  {
    id: '2',
    name: 'Carlos Rodríguez',
    profession: 'Diseñador UX/UI',
    category: 'diseno',
    rating: 4.8,
    reviews: 89,
    location: 'Barcelona, España',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    pricePerHour: 35,
    isVerified: true,
    status: 'available',
    description: 'Diseñador creativo con enfoque en experiencia de usuario',
    skills: ['Figma', 'Adobe XD', 'Sketch', 'Principle', 'InVision', 'Prototyping']
  },
  {
    id: '3',
    name: 'Ana Martínez',
    profession: 'Marketing Digital',
    category: 'marketing',
    rating: 4.7,
    reviews: 156,
    location: 'Valencia, España',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
    pricePerHour: 40,
    isVerified: true,
    status: 'busy',
    description: 'Experta en estrategias de marketing digital y redes sociales',
    skills: ['Google Ads', 'Facebook Ads', 'SEO', 'Analytics', 'Content Marketing', 'Social Media']
  },
  {
    id: '4',
    name: 'David López',
    profession: 'Consultor Financiero',
    category: 'finanzas',
    rating: 4.9,
    reviews: 203,
    location: 'Sevilla, España',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    pricePerHour: 60,
    isVerified: true,
    status: 'available',
    description: 'Asesor financiero especializado en inversiones y planificación',
    skills: ['Análisis Financiero', 'Inversiones', 'Planificación Fiscal', 'Excel Avanzado', 'Power BI', 'Risk Management']
  },
  {
    id: '5',
    name: 'Laura Sánchez',
    profession: 'Psicóloga Clínica',
    category: 'salud',
    rating: 4.8,
    reviews: 94,
    location: 'Bilbao, España',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face',
    pricePerHour: 50,
    isVerified: true,
    status: 'available',
    description: 'Psicóloga especializada en terapia cognitivo-conductual',
    skills: ['Terapia Cognitivo-Conductual', 'Psicología Clínica', 'Terapia de Pareja', 'Ansiedad', 'Depresión', 'Mindfulness']
  },
  {
    id: '6',
    name: 'Roberto García',
    profession: 'Abogado Corporativo',
    category: 'legal',
    rating: 4.6,
    reviews: 78,
    location: 'Málaga, España',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    pricePerHour: 80,
    isVerified: true,
    status: 'offline',
    description: 'Abogado especializado en derecho corporativo y contratos',
    skills: ['Derecho Corporativo', 'Contratos', 'Fusiones y Adquisiciones', 'Compliance', 'Derecho Laboral', 'Propiedad Intelectual']
  }
];

// Datos detallados para perfiles completos
export const DETAIL_PROFESSIONALS_DATA: ProfessionalDetail[] = [
  {
    id: '1',
    skills: ['React', 'Node.js', 'TypeScript', 'MongoDB', 'AWS', 'Docker'],
    aboutMe: 'Desarrolladora apasionada por crear soluciones web innovadoras. Con más de 5 años de experiencia en desarrollo full-stack, he trabajado en proyectos desde startups hasta grandes corporaciones.',
    workZones: ['Madrid', 'Barcelona', 'Valencia', 'Sevilla'],
    completedProjects: 45,
    responseRate: 98,
    responseTime: '2 horas',
    contactInfo: {
      email: 'maria.gonzalez@email.com',
      whatsapp: '+34 600 123 456',
      instagram: '@maria_dev',
      facebook: 'MariaGonzalezDev',
      linkedin: 'maria-gonzalez-dev'
    },
    experience: {
      years: 5,
      description: 'Especializada en desarrollo mobile con un historial comprobado de proyectos exitosos y clientes satisfechos.'
    },
    reviewData: {
      averageRating: 4.9,
      totalReviews: 127,
      hasReviews: true
    },
    qa: {
      hasQuestions: true,
      totalQuestions: 23
    }
  },
  {
    id: '2',
    skills: ['Figma', 'Adobe XD', 'Sketch', 'Principle', 'InVision', 'User Research'],
    aboutMe: 'Diseñador UX/UI con enfoque en crear experiencias digitales que conecten emocionalmente con los usuarios. Mi pasión es entender las necesidades del usuario y traducirlas en diseños intuitivos y atractivos.',
    workZones: ['Barcelona', 'Madrid', 'Valencia'],
    completedProjects: 32,
    responseRate: 95,
    responseTime: '3 horas',
    contactInfo: {
      email: 'carlos.rodriguez@email.com',
      whatsapp: '+34 600 234 567',
      instagram: '@carlos_ux',
      facebook: 'CarlosRodriguezUX',
      linkedin: 'carlos-rodriguez-ux'
    },
    experience: {
      years: 4,
      description: 'Especializado en diseño de interfaces y experiencia de usuario para aplicaciones móviles y web.'
    },
    reviewData: {
      averageRating: 4.8,
      totalReviews: 89,
      hasReviews: true
    },
    qa: {
      hasQuestions: true,
      totalQuestions: 15
    }
  },
  {
    id: '3',
    skills: ['Google Ads', 'Facebook Ads', 'SEO', 'Analytics', 'Content Marketing', 'Social Media'],
    aboutMe: 'Especialista en marketing digital con más de 6 años ayudando a empresas a crecer online. Mi enfoque se centra en estrategias data-driven que generan resultados medibles.',
    workZones: ['Valencia', 'Madrid', 'Barcelona', 'Alicante'],
    completedProjects: 67,
    responseRate: 92,
    responseTime: '4 horas',
    contactInfo: {
      email: 'ana.martinez@email.com',
      whatsapp: '+34 600 345 678',
      instagram: '@ana_marketing',
      facebook: 'AnaMartinezMarketing',
      linkedin: 'ana-martinez-marketing'
    },
    experience: {
      years: 6,
      description: 'Experta en estrategias de marketing digital y gestión de campañas publicitarias online.'
    },
    reviewData: {
      averageRating: 4.7,
      totalReviews: 156,
      hasReviews: true
    },
    qa: {
      hasQuestions: true,
      totalQuestions: 31
    }
  },
  {
    id: '4',
    skills: ['Análisis Financiero', 'Inversiones', 'Planificación Fiscal', 'Gestión de Riesgos', 'Excel Avanzado', 'Power BI'],
    aboutMe: 'Consultor financiero con más de 8 años de experiencia ayudando a personas y empresas a optimizar sus finanzas. Mi objetivo es simplificar conceptos financieros complejos.',
    workZones: ['Sevilla', 'Madrid', 'Málaga', 'Córdoba'],
    completedProjects: 89,
    responseRate: 99,
    responseTime: '1 hora',
    contactInfo: {
      email: 'david.lopez@email.com',
      whatsapp: '+34 600 456 789',
      instagram: '@david_finanzas',
      facebook: 'DavidLopezFinanzas',
      linkedin: 'david-lopez-finanzas'
    },
    experience: {
      years: 8,
      description: 'Especializado en asesoramiento financiero personal y empresarial con enfoque en inversiones y planificación.'
    },
    reviewData: {
      averageRating: 4.9,
      totalReviews: 203,
      hasReviews: true
    },
    qa: {
      hasQuestions: true,
      totalQuestions: 42
    }
  },
  {
    id: '5',
    skills: ['Terapia Cognitivo-Conductual', 'Terapia de Pareja', 'Ansiedad', 'Depresión', 'Mindfulness', 'Psicología Positiva'],
    aboutMe: 'Psicóloga clínica con enfoque humanista y cognitivo-conductual. Mi misión es acompañar a las personas en su proceso de crecimiento personal y bienestar emocional.',
    workZones: ['Bilbao', 'San Sebastián', 'Vitoria', 'Pamplona'],
    completedProjects: 156,
    responseRate: 97,
    responseTime: '2 horas',
    contactInfo: {
      email: 'laura.sanchez@email.com',
      whatsapp: '+34 600 567 890',
      instagram: '@laura_psicologia',
      facebook: 'LauraSanchezPsicologia',
      linkedin: 'laura-sanchez-psicologia'
    },
    experience: {
      years: 7,
      description: 'Especializada en terapia individual y de pareja con enfoque en técnicas de tercera generación.'
    },
    reviewData: {
      averageRating: 4.8,
      totalReviews: 94,
      hasReviews: true
    },
    qa: {
      hasQuestions: true,
      totalQuestions: 28
    }
  },
  {
    id: '6',
    skills: ['Derecho Corporativo', 'Contratos', 'Fusiones y Adquisiciones', 'Compliance', 'Derecho Laboral', 'Negociación'],
    aboutMe: 'Abogado corporativo con más de 10 años de experiencia en derecho empresarial. Mi especialidad es asesorar a empresas en operaciones complejas y cumplimiento normativo.',
    workZones: ['Málaga', 'Madrid', 'Sevilla', 'Granada'],
    completedProjects: 234,
    responseRate: 94,
    responseTime: '6 horas',
    contactInfo: {
      email: 'roberto.garcia@email.com',
      whatsapp: '+34 600 678 901',
      instagram: '@roberto_abogado',
      facebook: 'RobertoGarciaAbogado',
      linkedin: 'roberto-garcia-abogado'
    },
    experience: {
      years: 10,
      description: 'Especializado en derecho corporativo y asesoramiento legal empresarial con amplia experiencia en operaciones internacionales.'
    },
    reviewData: {
      averageRating: 4.6,
      totalReviews: 78,
      hasReviews: true
    },
    qa: {
      hasQuestions: true,
      totalQuestions: 19
    }
  }
];
