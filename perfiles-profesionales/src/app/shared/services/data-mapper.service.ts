import { Injectable } from '@angular/core';
import { ApiUser, ApiProfessionalsResponse, ApiUserDetail, ApiProfessionalDetailResponse } from '../interfaces/api-response.interface';
import { ProfessionalBasic } from '../../features/professionals/pages/professionals-list/services/professionals-list.service';
import { ProfessionalDetail } from '../../features/professionals/pages/professional-detail/services/professional-detail.service';

@Injectable({
  providedIn: 'root'
})
export class DataMapperService {

  constructor() { }

  /**
   * Mapea la respuesta del API a nuestro formato de ProfessionalBasic
   */
  mapApiUserToProfessionalBasic(apiUser: ApiUser): ProfessionalBasic {

    // Combinar first_name y last_name
    const fullName = `${apiUser.first_name} ${apiUser.last_name}`.trim();

    // Obtener la primera actividad como profesión principal
    const primaryActivity = apiUser.activities.length > 0 ? apiUser.activities[0] : null;
    const profession = primaryActivity?.name || 'Profesional';

    // Para el listado, usar los nombres de las actividades como skills
    const skills = apiUser.activities.map(activity => activity.name);

    // Obtener la ubicación
    const location = apiUser.locality?.name || 'Ubicación no disponible';
    const province = apiUser.locality?.state?.name || undefined;

    // Convertir rating a número
    const rating = parseFloat(apiUser.reviews_avg_value) || 0;

    return {
      id: apiUser.id.toString(),
      name: fullName,
      profession: profession,
      category: apiUser.user_type?.name?.toLowerCase() || 'profesional',
      rating: rating,
      reviews: apiUser.reviews_count,
      location: location,
      province: province,
      profile_picture: apiUser.profile_picture || undefined,
      pricePerHour: 0, // Comentado por ahora
      isVerified: false, // Comentado por ahora
      status: 'available' as const, // Comentado por ahora
      description: apiUser.description,
      skills: skills
    };
  }

  /**
   * Mapea la respuesta completa del API
   */
  mapApiResponseToProfessionals(apiResponse: ApiProfessionalsResponse): ProfessionalBasic[] {
    return apiResponse.data
      .filter(apiUser => apiUser.is_active === true)
      .map(apiUser => this.mapApiUserToProfessionalBasic(apiUser));
  }

  /**
   * Mapea la respuesta del API de detalle a un objeto completo que incluye datos básicos y detallados
   */
  mapApiDetailResponseToProfessionalFull(apiResponse: ApiProfessionalDetailResponse): any {
    const apiUserDetail = apiResponse.data;

    // Obtener datos básicos
    const fullName = `${apiUserDetail.first_name} ${apiUserDetail.last_name}`.trim();
    const primaryActivity = apiUserDetail.activities.length > 0 ? apiUserDetail.activities[0] : null;
    const profession = primaryActivity?.name || 'Profesional';
    // En el detalle, las "habilidades" serán los nombres de las actividades
    const skills = apiUserDetail.activities.map(activity => activity.name);
    const location = apiUserDetail.locality?.name || 'Ubicación no disponible';
    const province = apiUserDetail.locality?.state?.name || undefined;
    const rating = parseFloat(apiUserDetail.reviews_avg_value) || 0;

    // Obtener datos detallados
    const workZones = apiUserDetail.locality ? [apiUserDetail.locality.name] : [];
    const reviews = apiUserDetail.reviews || [];
    const averageRating = reviews.length > 0
      ? reviews.reduce((sum, review) => sum + review.value, 0) / reviews.length
      : 0;
    const questions = apiUserDetail.questions || [];

    return {
      // Datos básicos
      id: apiUserDetail.id.toString(),
      name: fullName,
      profession: profession,
      category: apiUserDetail.user_type?.name?.toLowerCase() || 'profesional',
      rating: rating,
      reviews: apiUserDetail.reviews_count,
      location: location,
      // Provincia (si viene en el API dentro de locality.state)
      province: province,
      profile_picture: apiUserDetail.profile_picture || undefined,
      pricePerHour: 0,
      isVerified: false,
      status: 'available' as const,
      description: apiUserDetail.description,
      skills: skills,
      // Datos detallados
      aboutMe: apiUserDetail.description,
      workZones: workZones,
      completedProjects: 0,
      responseRate: 95,
      responseTime: '2-4 horas',
      contactInfo: {
        email: apiUserDetail.email,
        whatsapp: `${apiUserDetail.country_phone}${apiUserDetail.area_code}${apiUserDetail.phone_number}`,
        instagram: undefined,
        facebook: undefined,
        linkedin: undefined
      },
      experience: {
        years: 5,
        description: `Experiencia en ${apiUserDetail.activities.map(a => a.name).join(', ')}`
      },
      reviewData: {
        averageRating: averageRating,
        totalReviews: reviews.length,
        hasReviews: reviews.length > 0
      },
      qa: {
        hasQuestions: questions.length > 0,
        totalQuestions: questions.length
      },
      // Incluir las reviews directamente
      reviewsList: reviews,
      // Incluir las preguntas directamente
      questions: questions
    };
  }
}
