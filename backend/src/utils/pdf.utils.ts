import PDFDocument from "pdfkit";
import { IInspectionDocument } from "../models/inspection.model";
import { format } from "date-fns";
import { IInspector } from "../models/inspector.model";
import { IUsers } from "../models/user.model";
import { IVehicleDocument } from "../models/vehicle.model";

export const generateInspectionPDF = async (inspection: IInspectionDocument): Promise<Buffer> => {
    return new Promise((resolve, reject) => {
        try {
            // Ensure inspection is populated with related data
            if (!inspection.vehicle || !inspection.user || !inspection.inspector) {
                throw new Error("Inspection data is not fully populated");
            }

            const doc = new PDFDocument({ margin: 50 });
            const buffers: Buffer[] = [];

            doc.on('data', buffers.push.bind(buffers));
            doc.on('end', () => {
                const pdfData = Buffer.concat(buffers);
                resolve(pdfData);
            });
            
            // Title and header
            // doc.image('path/to/logo.png', 50, 45, { width: 150 });
            doc.fontSize(20).text('Vehicle Inspection Report', { align: 'center' }).moveDown();
            
            // Inspection details
            doc.fontSize(12)
                .text(`Booking Reference: ${inspection.bookingReference}`, { align: 'left' })
                .text(`Inspection Date: ${format(new Date(inspection.date), 'MM/dd/yyyy')}`, { align: 'left' })
                .text(`Inspection Type: ${inspection.inspectionType.toUpperCase()}`, { align: 'left' })
                .text(`Location: ${inspection.location || 'N/A'}`, { align: 'left' })
                .text(`Status: ${inspection.status.toUpperCase()}`, { align: 'left' })
                .moveDown();

            // Vehicle Information
            doc.fontSize(16)
                .text('Vehicle Information', { underline: true })
                .moveDown(0.5);

            // Access vehicle as any to handle potential type issues with populated documents
            const vehicle = inspection.vehicle as unknown as IVehicleDocument;
            
            doc.fontSize(12)
                .text(`Registration Number: ${vehicle?.registrationNumber || 'N/A'}`)
                .text(`Make & Model: ${vehicle?.make || 'N/A'} ${vehicle?.vehicleModel || 'N/A'}`)
                .text(`Year: ${vehicle?.year || 'N/A'}`)
                .text(`VIN: ${vehicle?.chassisNumber || 'N/A'}`)
                .text(`Mileage: ${inspection.report?.mileage || 'N/A'}`)
                .moveDown();

            // User Information
            doc.fontSize(16)
                .text('Vehicle Owner Information', { underline: true })
                .moveDown(0.5);

            const user = inspection.user as unknown as IUsers;
            
            doc.fontSize(12)
                .text(`Name: ${user?.firstName || ''} ${user?.lastName || ''}`)
                .text(`Email: ${user?.email || 'N/A'}`)
                .text(`Phone: ${inspection.phone || 'N/A'}`)
                .moveDown();

            // Inspector Information
            doc.fontSize(16)
                .text('Inspector Information', { underline: true })
                .moveDown(0.5);

            const inspector = inspection.inspector as unknown as  IInspector;
            
            doc.fontSize(12)
                .text(`Name: ${inspector?.firstName || ''} ${inspector?.lastName || ''}`)
                .text(`Email: ${inspector?.email || 'N/A'}`)
                .text(`Phone: ${inspector?.phone || 'N/A'}`)
                .text(`Years of Experience: ${inspector?.yearOfExp || 'N/A'}`)
                .text(`Specialization: ${inspector?.specialization?.join(', ') || 'N/A'}`)
                .moveDown();

            // Condition Assessment
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

            // Additional Notes
            if (inspection.report?.additionalNotes) {
                doc.fontSize(16)
                    .text('Additional Notes', { underline: true })
                    .moveDown(0.5);

                doc.fontSize(12)
                    .text(inspection.report.additionalNotes)
                    .moveDown();
            }

            // Recommendations
            if (inspection.report?.recommendations) {
                doc.fontSize(16)
                    .text('Recommendations', { underline: true })
                    .moveDown(0.5);

                doc.fontSize(12)
                    .text(inspection.report.recommendations)
                    .moveDown();
            }

            // Inspection Result
            doc.fontSize(16)
                .text('Inspection Result', { underline: true })
                .moveDown(0.5);

            doc.fontSize(12)
                .text(`Passed Inspection: ${inspection.report?.passedInspection ? 'Yes' : 'No'}`)
                .moveDown();

            // Photos section (reference only, can't embed in PDF directly)
            if (inspection.report?.photos && inspection.report.photos.length > 0) {
                doc.fontSize(16)
                    .text('Inspection Photos', { underline: true })
                    .moveDown(0.5);

                doc.fontSize(12)
                    .text(`${inspection.report.photos.length} photos were taken during this inspection.`)
                    .text('Please refer to the online report to view all photos.')
                    .moveDown();
            }

            // Payment Information (if applicable)
            if (inspection.status === 'payment_completed') {
                doc.fontSize(16)
                    .text('Payment Information', { underline: true })
                    .moveDown(0.5);

                doc.fontSize(12)
                    .text(`Payment Status: Completed`)
                    .text(`Payment Date: , 'MM/dd/yyyy') : 'N/A'}`)
                    .moveDown();
            }

            // Footer with signature
            doc.fontSize(10)
                .text(`Report generated on ${format(new Date(), 'MM/dd/yyyy HH:mm')}`, {
                    align: 'center',
                }).moveDown();

            // Add inspector signature if available
            if (inspector?.signature) {
                doc.fontSize(12)
                    .text('Inspector Signature:', { align: 'left' })
                    .moveDown(0.5);
                
                // If you have the signature as an image URL, you could add it here
                // doc.image(inspector.signature, { width: 150 });
                
                doc.moveDown();
            }

            // Legal disclaimer
            doc.fontSize(8)
                .text('DISCLAIMER: This inspection report provides a general assessment of the vehicle condition at the time of inspection. ' +
                      'It is not a guarantee or warranty. Inspecto is not liable for any issues that may arise after the inspection.', {
                    align: 'center',
                });

            doc.end();
        } catch (error) {
            console.error('Error generating PDF:', error);
            reject(error);
        }
    });
};

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