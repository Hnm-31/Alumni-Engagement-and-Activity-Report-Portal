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
 * Get paginated reports uploaded by the currently logged-in faculty
 * GET /api/faculty/reports?page=0&size=10
 */
export const getMyReports = (page = 0, size = 10) => {
  return api.get('/api/faculty/reports', { params: { page, size } });
};

/**
 * Get a single report by ID (only if owned by current faculty)
 * GET /api/faculty/reports/{id}
 */
export const getMyReportById = (id) => {
  return api.get(`/api/faculty/reports/${id}`);
};

/**
 * Update report metadata (alumni name, session title, etc.)
 * PUT /api/faculty/reports/{id}
 */
export const updateMyReport = (id, data) => {
  return api.put(`/api/faculty/reports/${id}`, data);
};

/**
 * Replace a file attached to a report
 * PUT /api/faculty/reports/{reportId}/files/{fileId}  (multipart/form-data)
 */
export const replaceReportFile = (reportId, fileId, file) => {
  const formData = new FormData();
  formData.append('file', file);
  return api.put(`/api/faculty/reports/${reportId}/files/${fileId}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

/**
 * Get files for a specific report (admin endpoint, used in ReportTable for admin view)
 * GET /api/admin/reports/{reportId}/files
 */
export const getReportFiles = (reportId) => {
  return api.get(`/api/admin/reports/${reportId}/files`);
};

/**
 * Returns the URL to trigger a file download for faculty.
 * GET /api/faculty/files/{fileId}/download
 */
export const getFacultyDownloadUrl = (fileId) => {
  return api.get(`/api/faculty/files/${fileId}/download`, {
    responseType: 'blob'
  });
};

