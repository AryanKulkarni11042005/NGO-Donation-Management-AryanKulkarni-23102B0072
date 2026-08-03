import { Router } from "express";
import { downloadCertificateHandler, verifyCertificateHandler } from "../controllers/certificate.controller";

const router = Router();

router.get("/verify/:verificationId", verifyCertificateHandler);
router.get("/:donationId/download", downloadCertificateHandler);

export default router;
