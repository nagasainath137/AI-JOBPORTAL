import api from "./api";

export const jobsService = {
  list: (params) => api.get("/api/jobs", { params }),
  get: (id) => api.get(`/api/jobs/${id}`),
  create: (data) => api.post("/api/jobs", data),
  update: (id, data) => api.put(`/api/jobs/${id}`, data),
  remove: (id) => api.delete(`/api/jobs/${id}`),
};

export const applicationsService = {
  apply: (jobId, data) => api.post(`/api/apply/${jobId}`, data),
  myApplications: () => api.get("/api/applications/my"),
  forJob: (jobId) => api.get(`/api/applications/job/${jobId}`),
  updateStatus: (appId, status) =>
    api.patch(`/api/applications/${appId}/status`, { status }),
};

export const profileService = {
  get: () => api.get("/api/profile"),
  update: (data) => api.patch("/api/profile", data),
  uploadResume: (file) => {
    const form = new FormData();
    form.append("file", file);
    return api.post("/api/profile/resume", form);
  },
  getSkills: () => api.get("/api/profile/skills"),
  addSkill: (skill_name) => api.post("/api/profile/skills", { skill_name }),
  removeSkill: (name) => api.delete(`/api/profile/skills/${name}`),
};

export const aiService = {
  matchResume: (data) => api.post("/api/ai/match-resume", data),
  coverLetter: (data) => api.post("/api/ai/cover-letter", data),
  skillGap: (data) => api.post("/api/ai/skill-gap", data),
};

export const dashboardService = {
  recruiter: () => api.get("/api/dashboard/recruiter"),
  candidate: () => api.get("/api/dashboard/candidate"),
};
