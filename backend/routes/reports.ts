import { Router, Request, Response } from 'express';
import { auditCSRReport, CSRReportAuditInput } from '../services/greenwashingEngine';

const router = Router();

// POST /api/reports/audit - Audit CSR report text claims
router.post('/audit', (req: Request, res: Response) => {
  const input: CSRReportAuditInput = req.body;

  if (!input.reportTitle || !input.extractedClaimsText || !Array.isArray(input.extractedClaimsText)) {
    return res.status(400).json({
      success: false,
      error: 'Missing required audit parameters (reportTitle, extractedClaimsText array)'
    });
  }

  const auditResult = auditCSRReport(input);

  res.json({
    success: true,
    auditResult
  });
});

export default router;
