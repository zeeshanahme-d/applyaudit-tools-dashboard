import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import DashboardLayout from '../pages/layouts/DashboardLayout';
import Dashboard from '../pages/dashboard/Dashboard';
import ResumeAnalyzer from '../pages/resume-analyzer/ResumeAnalyzer';
import {
    AtsChecker,
    CareerAudit,
    LinkedInAnalyzer,
    LinkedInJobMatch,
    ResumeJobMatch,
    ResumeLinkedInAnalysis,
} from '../pages/upcoming/UpcomingTools';

function AppRoutes() {
    return (
        <BrowserRouter>
            <Routes>
                <Route element={<DashboardLayout />}>
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/resume-analyzer" element={<ResumeAnalyzer />} />
                    <Route path="/ats-analyzer" element={<AtsChecker />} />
                    <Route path="/linkedin-analyzer" element={<LinkedInAnalyzer />} />
                    <Route path="/job-match" element={<ResumeJobMatch />} />
                    <Route path="/compare/resume-linkedin" element={<ResumeLinkedInAnalysis />} />
                    <Route path="/compare/resume-job" element={<ResumeJobMatch />} />
                    <Route path="/compare/linkedin-job" element={<LinkedInJobMatch />} />
                    <Route path="/career-audit" element={<CareerAudit />} />
                </Route>
                <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
        </BrowserRouter>
    );
}

export default AppRoutes;
