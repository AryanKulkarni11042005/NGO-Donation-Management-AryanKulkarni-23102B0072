import { NextFunction, Request, Response } from "express";
import * as certificateService from "../services/certificate.service";
import { streamCertificatePdf } from "../utils/pdf.util";

export async function downloadCertificateHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const details = await certificateService.getCertificateForDonation(Number(req.params.donationId));
    streamCertificatePdf(res, details);
  } catch (err) {
    next(err);
  }
}

export async function verifyCertificateHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const details = await certificateService.getCertificateByVerificationId(req.params.verificationId);
    res.json({
      certificateId: details.certificate.certificate_code,
      verificationId: details.certificate.verification_id,
      donorName: details.donorName,
      campaignTitle: details.campaignTitle,
      amount: details.amount,
      transactionId: details.transactionId,
      date: details.donationDate,
    });
  } catch (err) {
    next(err);
  }
}
