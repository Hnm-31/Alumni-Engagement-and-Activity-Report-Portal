import { useState, useRef } from 'react';
import { uploadReport } from '../services/reportService';
import toast from 'react-hot-toast';

const DEPARTMENTS = [
  'Computer Engineering',
  'Information Technology',
  'Electronics & Telecommunication',
  'Mechanical Engineering',
  'Civil Engineering',
];

const MAX_FILE_SIZE_MB = 10;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

const initialForm = {
  alumniName: '',
  sessionTitle: '',
  sessionObjective: '',
  academicYear: '',
  department: '',
  studentCount: '',
};

export default function UploadReport() {
  const [form, setForm] = useState(initialForm);
  const [mainFile, setMainFile] = useState(null);
  const [extraFile, setExtraFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const mainFileRef = useRef();
  const extraFileRef = useRef();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const validateFile = (file) => {
    if (!file) return true;
    if (file.size > MAX_FILE_SIZE_BYTES) {
      toast.error(`File "${file.name}" exceeds the 10 MB limit.`);
      return false;
    }
    return true;
  };

  const handleMainFile = (e) => {
    const file = e.target.files[0];
    if (file && validateFile(file)) setMainFile(file);
    else e.target.value = '';
  };

  const handleExtraFile = (e) => {
    const file = e.target.files[0];
    if (file && validateFile(file)) setExtraFile(file);
    else e.target.value = '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!mainFile) {
      toast.error('Please select the Main Activity Report file.');
      return;
    }

    const formData = new FormData();
    formData.append('alumniName', form.alumniName.trim());
    formData.append('sessionTitle', form.sessionTitle.trim());
    formData.append('sessionObjective', form.sessionObjective.trim());
    formData.append('academicYear', form.academicYear.trim());
    formData.append('department', form.department);
    if (form.studentCount) formData.append('studentCount', form.studentCount);
    formData.append('mainFile', mainFile);
    if (extraFile) formData.append('extraFile', extraFile);

    setIsUploading(true);
    setUploadProgress(0);

    const toastId = toast.loading('Uploading report...');
    try {
      await uploadReport(formData, (progressEvent) => {
        const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        setUploadProgress(percent);
      });

      toast.success('Report uploaded successfully! 🎉', { id: toastId });
      setForm(initialForm);
      setMainFile(null);
      setExtraFile(null);
      if (mainFileRef.current) mainFileRef.current.value = '';
      if (extraFileRef.current) extraFileRef.current.value = '';
      setUploadProgress(0);
    } catch (err) {
      const msg = err?.response?.data || 'Upload failed. Please try again.';
      toast.error(typeof msg === 'string' ? msg : 'Upload failed. Please try again.', { id: toastId });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      {/* Page Header */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800">Upload Activity Report</h2>
        <p className="text-gray-500 text-sm mt-1">Fill in the details below and attach the required documents.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Details Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-base font-semibold text-gray-700 mb-5 flex items-center gap-2">
            <span className="w-7 h-7 inline-flex items-center justify-center bg-blue-100 text-blue-600 rounded-lg text-sm">1</span>
            Session Details
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Alumni Name */}
            <div>
              <label className="form-label">Alumni Name <span className="text-red-500">*</span></label>
              <input
                className="form-input"
                name="alumniName"
                value={form.alumniName}
                onChange={handleChange}
                placeholder="e.g. Rahul Sharma"
                required
              />
            </div>

            {/* Session Title */}
            <div>
              <label className="form-label">Session Title <span className="text-red-500">*</span></label>
              <input
                className="form-input"
                name="sessionTitle"
                value={form.sessionTitle}
                onChange={handleChange}
                placeholder="e.g. Career in Data Science"
                required
              />
            </div>

            {/* Department */}
            <div>
              <label className="form-label">Department <span className="text-red-500">*</span></label>
              <select
                className="form-input"
                name="department"
                value={form.department}
                onChange={handleChange}
                required
              >
                <option value="">Select department</option>
                {DEPARTMENTS.map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>

            {/* Academic Year */}
            <div>
              <label className="form-label">Academic Year <span className="text-red-500">*</span></label>
              <input
                className="form-input"
                name="academicYear"
                value={form.academicYear}
                onChange={handleChange}
                placeholder="e.g. 2024-25"
                required
              />
            </div>

            {/* Student Count */}
            <div>
              <label className="form-label">Student Count</label>
              <input
                className="form-input"
                name="studentCount"
                type="number"
                min="0"
                value={form.studentCount}
                onChange={handleChange}
                placeholder="e.g. 120"
              />
            </div>
          </div>

          {/* Session Objective */}
          <div className="mt-5">
            <label className="form-label">Session Objective</label>
            <textarea
              className="form-input resize-none"
              name="sessionObjective"
              rows={4}
              value={form.sessionObjective}
              onChange={handleChange}
              placeholder="Describe the goals and outcomes of this alumni session..."
            />
          </div>
        </div>

        {/* File Upload Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-base font-semibold text-gray-700 mb-5 flex items-center gap-2">
            <span className="w-7 h-7 inline-flex items-center justify-center bg-blue-100 text-blue-600 rounded-lg text-sm">2</span>
            File Attachments
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Main File */}
            <div>
              <label className="form-label">Main Activity Report <span className="text-red-500">*</span></label>
              <div
                className={`border-2 border-dashed rounded-xl p-5 text-center cursor-pointer transition-all duration-200 ${
                  mainFile ? 'border-blue-400 bg-blue-50' : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
                }`}
                onClick={() => mainFileRef.current?.click()}
              >
                {mainFile ? (
                  <>
                    <p className="text-2xl mb-1">📄</p>
                    <p className="text-sm font-medium text-blue-700 truncate">{mainFile.name}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{(mainFile.size / 1024 / 1024).toFixed(2)} MB</p>
                  </>
                ) : (
                  <>
                    <svg className="w-8 h-8 mx-auto text-gray-300 mb-2" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                    </svg>
                    <p className="text-sm text-gray-500 font-medium">Click to select file</p>
                    <p className="text-xs text-gray-400">PDF, DOCX, CSV — Max 10 MB</p>
                  </>
                )}
              </div>
              <input ref={mainFileRef} type="file" className="hidden" accept=".pdf,.doc,.docx,.csv,.xls,.xlsx,.ppt,.pptx" onChange={handleMainFile} />
            </div>

            {/* Extra File */}
            <div>
              <label className="form-label">Additional Document <span className="text-gray-400 font-normal">(optional)</span></label>
              <div
                className={`border-2 border-dashed rounded-xl p-5 text-center cursor-pointer transition-all duration-200 ${
                  extraFile ? 'border-amber-400 bg-amber-50' : 'border-gray-200 hover:border-amber-300 hover:bg-gray-50'
                }`}
                onClick={() => extraFileRef.current?.click()}
              >
                {extraFile ? (
                  <>
                    <p className="text-2xl mb-1">📎</p>
                    <p className="text-sm font-medium text-amber-700 truncate">{extraFile.name}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{(extraFile.size / 1024 / 1024).toFixed(2)} MB</p>
                  </>
                ) : (
                  <>
                    <svg className="w-8 h-8 mx-auto text-gray-300 mb-2" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                    </svg>
                    <p className="text-sm text-gray-500 font-medium">Click to attach extra file</p>
                    <p className="text-xs text-gray-400">Any supported format — Max 10 MB</p>
                  </>
                )}
              </div>
              <input ref={extraFileRef} type="file" className="hidden" accept=".pdf,.doc,.docx,.csv,.xls,.xlsx,.ppt,.pptx,.jpg,.png" onChange={handleExtraFile} />
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        {isUploading && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Uploading...</span>
              <span className="text-sm font-bold text-blue-600">{uploadProgress}%</span>
            </div>
            <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          </div>
        )}

        {/* Submit */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isUploading}
            className="flex items-center gap-2 px-8 py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none text-sm"
          >
            {isUploading ? (
              <>
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                </svg>
                Upload Report
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
