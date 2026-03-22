import api from '../utils/api';

/**
 * Get paginated list of all reports
 * GET /api/admin/reports?page=0&size=10
 */
export const getAllReports = (page = 0, size = 10) => {
  return api.get('/api/admin/reports', { params: { page, size } });
};

/**
 * Get files belonging to a report
 * GET /api/admin/reports/{reportId}/files
 */
export const getReportFiles = (reportId) => {
  return api.get(`/api/admin/reports/${reportId}/files`);
};

/**
 * Returns the URL to trigger a file download.
 * The backend responds with 302 redirect to Cloudinary.
 * We open it in a new tab so the browser handles the redirect naturally.
 */
export const getDownloadUrl = (fileId) => {
  return `http://localhost:8080/api/admin/files/${fileId}/download`;
};

/**
 * Delete a file by id
 * DELETE /api/admin/files/{fileId}  (endpoint to be added to backend)
 */
export const deleteFile = (fileId) => {
  return api.delete(`/api/admin/files/${fileId}`);
};
