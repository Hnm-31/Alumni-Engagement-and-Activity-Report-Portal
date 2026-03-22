import api from '../utils/api';

/**
 * Upload an activity report (faculty)
 * POST /api/reports/upload  (multipart/form-data)
 */
export const uploadReport = (formData, onUploadProgress) => {
  return api.post('/api/reports/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    onUploadProgress,
  });
};

/**
 * Get reports uploaded by the current faculty
 * (Uses admin endpoint temporarily – faculty-specific endpoint TBD)
 * GET /api/admin/reports?page=0&size=50
 */
export const getMyReports = (page = 0, size = 50) => {
  return api.get('/api/admin/reports', { params: { page, size } });
};

/**
 * Get files for a specific report
 * GET /api/admin/reports/{reportId}/files
 */
export const getReportFiles = (reportId) => {
  return api.get(`/api/admin/reports/${reportId}/files`);
};
