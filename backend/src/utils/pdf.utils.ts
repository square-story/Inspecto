import PDFDocument from "pdfkit";
import { IInspectionDocument } from "../models/inspection.model";
import { format } from "date-fns";

export const generateInspectionPDF = async (inspection: IInspectionDocument): Promise<Buffer> => {
    return new Promise((resolve, reject) => {
        try {
            const doc = new PDFDocument({ margin: 50 });
            const buffers: Buffer[] = [];

            doc.on('data', buffers.push.bind(buffers));
            doc.on('end', () => {
                const pdfData = Buffer.concat(buffers);
                resolve(pdfData);
            });
            // doc.image('path/to/logo.png', 50, 45, { width: 150 });
            doc.fontSize(20).text('Inspection Report', { align: 'center' }).moveDown();
            doc.fontSize(12)
                .text(`Booking Reference: ${inspection.bookingReference}`, { align: 'left' })
                .text(`Inspection Date: ${format(new Date(inspection.date), 'MM/dd/yyyy')}`, { align: 'left' })
                .text(`Location: ${inspection.location || 'N/A'}`, { align: 'left' })
                .moveDown();

            doc.fontSize(16)
                .text('Vehicle Information', { underline: true })
                .moveDown(0.5);

            doc.fontSize(12)
                .text(`Registration Number:  'N/A'}`)
                .text(`Make & Model:  'N/A'} 'N/A'}`)
                .text(`Year:  'N/A'}`)
                .text(`Color: 'N/A'}`)
                .text(`Mileage: 'N/A'}`)
                .moveDown();

            doc.fontSize(16)
                .text('Condition Assessment', { underline: true })
                .moveDown(0.5);

            doc.fontSize(12)
                .text(`Exterior Condition: ${formatCondition(inspection.report?.exteriorCondition)}`)
                .text(`Interior Condition: ${formatCondition(inspection.report?.interiorCondition)}`)
                .text(`Engine Condition: ${formatCondition(inspection.report?.engineCondition)}`)
                .text(`Tires Condition: ${formatCondition(inspection.report?.tiresCondition)}`)
                .text(`Lights Condition: ${formatCondition(inspection.report?.lightsCondition)}`)
                .text(`Brakes Condition: ${formatCondition(inspection.report?.brakesCondition)}`)
                .text(`Suspension Condition: ${formatCondition(inspection.report?.suspensionCondition)}`)
                .text(`Fuel Level: ${formatFuelLevel(inspection.report?.fuelLevel)}`)
                .moveDown();

            if (inspection.report?.additionalNotes) {
                doc.fontSize(16)
                    .text('Additional Notes', { underline: true })
                    .moveDown(0.5);

                doc.fontSize(12)
                    .text(inspection.report.additionalNotes)
                    .moveDown();
            }

            if (inspection.report?.recommendations) {
                doc.fontSize(16)
                    .text('Recommendations', { underline: true })
                    .moveDown(0.5);

                doc.fontSize(12)
                    .text(inspection.report.recommendations)
                    .moveDown();
            }


            doc.fontSize(16)
                .text('Inspection Result', { underline: true })
                .moveDown(0.5);

            doc.fontSize(12)
                .text(`Passed Inspection: ${inspection.report?.passedInspection ? 'Yes' : 'No'}`)
                .moveDown();

            // Add inspector information
            doc.fontSize(16)
                .text('Inspector Information', { underline: true })
                .moveDown(0.5);

            // Add inspector details if available
            // doc.fontSize(12)
            //    .text(`Inspector: ${inspector.name}`)
            //    .text(`License: ${inspector.license}`)
            //    .moveDown();

            // Add footer
            doc.fontSize(10)
                .text(`Report generated on ${format(new Date(), 'MM/dd/yyyy HH:mm')}`, {
                    align: 'center',
                }).moveDown();

            doc.end();
        } catch (error) {
            reject(error);
        }
    })
}


function formatCondition(condition?: string): string {
    if (!condition) return 'Not Assessed';
    
    return condition.charAt(0).toUpperCase() + condition.slice(1);
  }

  function formatFuelLevel(level?: string): string {
    if (!level) return 'Not Assessed';
    
    const fuelLevels: Record<string, string> = {
      empty: 'Empty',
      quarter: '1/4',
      half: '1/2',
      threequarters: '3/4',
      full: 'Full'
    };
    
    return fuelLevels[level] || level;
  }