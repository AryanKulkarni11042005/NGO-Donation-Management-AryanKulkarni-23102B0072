import PDFDocument from "pdfkit";
import { Response } from "express";
import { env } from "../config/env";
import { CertificateDetails } from "../services/certificate.service";

export function streamCertificatePdf(res: Response, details: CertificateDetails) {
  const doc = new PDFDocument({ size: "A4", margin: 50 });

  res.setHeader("Content-Type", "application/pdf");
  res.setHeader(
    "Content-Disposition",
    `attachment; filename="certificate-${details.certificate.certificate_code}.pdf"`
  );

  doc.pipe(res);

  doc.fontSize(20).text("NGO Donation Certificate", { align: "center" });
  doc.moveDown(2);

  doc.fontSize(12);
  doc.text(`Certificate ID: ${details.certificate.certificate_code}`);
  doc.text(`Verification ID: ${details.certificate.verification_id}`);
  doc.moveDown();
  doc.text(`Donor Name: ${details.donorName}`);
  doc.text(`Campaign: ${details.campaignTitle}`);
  doc.text(`Donation Amount: ${details.amount}`);
  doc.text(`Transaction ID: ${details.transactionId}`);
  doc.text(`Date: ${details.donationDate.toDateString()}`);
  doc.moveDown();
  doc.text(`NGO Name: ${env.ngoName}`);

  doc.moveDown(3);
  doc.fontSize(11).text("Thank you for supporting our mission.", { align: "center" });

  doc.end();
}
