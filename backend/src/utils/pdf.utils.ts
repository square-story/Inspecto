import html_to_pdf from 'html-pdf-node';
import { IInspectionDocument } from "../models/inspection.model";
import { format } from "date-fns";
import { IInspector } from "../models/inspector.model";
import { IUsers } from "../models/user.model";
import { IVehicleDocument } from "../models/vehicle.model";

export const generateInspectionPDF = async (inspection: IInspectionDocument): Promise<Buffer> => {
    try {
        // Ensure inspection is populated with related data
        if (!inspection.vehicle || !inspection.user || !inspection.inspector) {
            throw new Error("Inspection data is not fully populated");
        }

        // Cast to proper types
        const vehicle = inspection.vehicle as unknown as IVehicleDocument;
        const user = inspection.user as unknown as IUsers;
        const inspector = inspection.inspector as unknown as IInspector;

        // Create HTML template with modern, minimal design
        const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <title>Vehicle Inspection Report</title>
            <style>
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
                
                :root {
                    --primary: #3b82f6;
                    --primary-light: #dbeafe;
                    --success: #10b981;
                    --warning: #f59e0b;
                    --danger: #ef4444;
                    --neutral: #6b7280;
                    --neutral-light: #f3f4f6;
                }
                
                * {
                    box-sizing: border-box;
                    margin: 0;
                    padding: 0;
                }
                
                body {
                    font-family: 'Inter', sans-serif;
                    line-height: 1.5;
                    color: #1f2937;
                    background-color: white;
                    font-size: 14px;
                }
                
                .container {
                    max-width: 100%;
                    padding: 40px;
                }
                
                .header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 40px;
                    padding-bottom: 20px;
                    border-bottom: 1px solid #e5e7eb;
                }
                
                .logo-area {
                    display: flex;
                    flex-direction: column;
                }
                
                .logo-title {
                    font-size: 24px;
                    font-weight: 700;
                    color: var(--primary);
                    margin-bottom: 5px;
                }
                
                .logo-subtitle {
                    font-size: 14px;
                    color: var(--neutral);
                }
                
                .report-info {
                    text-align: right;
                }
                
                .report-id {
                    font-size: 16px;
                    font-weight: 600;
                    margin-bottom: 5px;
                }
                
                .report-date {
                    color: var(--neutral);
                    font-size: 14px;
                }
                
                .status-badge {
                    display: inline-block;
                    padding: 4px 12px;
                    border-radius: 9999px;
                    font-weight: 500;
                    font-size: 12px;
                    text-transform: uppercase;
                    margin-top: 8px;
                }
                
                .status-completed {
                    background-color: #dcfce7;
                    color: #166534;
                }
                
                .status-pending {
                    background-color: #fef3c7;
                    color: #92400e;
                }
                
                .grid {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 20px;
                    margin-bottom: 30px;
                }
                
                .col-6 {
                    flex: 0 0 calc(50% - 10px);
                }
                
                .card {
                    background-color: white;
                    border-radius: 8px;
                    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
                    padding: 20px;
                    height: 100%;
                    border: 1px solid #e5e7eb;
                }
                
                .card-title {
                    font-size: 16px;
                    font-weight: 600;
                    margin-bottom: 15px;
                    color: #111827;
                    display: flex;
                    align-items: center;
                }
                
                .card-title::before {
                    content: '';
                    display: inline-block;
                    width: 4px;
                    height: 16px;
                    background-color: var(--primary);
                    margin-right: 8px;
                    border-radius: 4px;
                }
                
                .info-grid {
                    display: grid;
                    grid-template-columns: auto 1fr;
                    gap: 8px 16px;
                }
                
                .info-label {
                    color: var(--neutral);
                    font-weight: 500;
                }
                
                .info-value {
                    font-weight: 400;
                }
                
                .condition-table {
                    width: 100%;
                    border-collapse: collapse;
                    margin-top: 10px;
                }
                
                .condition-table th,
                .condition-table td {
                    padding: 10px;
                    text-align: left;
                    border-bottom: 1px solid #e5e7eb;
                }
                
                .condition-table th {
                    font-weight: 500;
                    color: var(--neutral);
                    font-size: 13px;
                }
                
                .condition-badge {
                    display: inline-block;
                    padding: 2px 8px;
                    border-radius: 4px;
                    font-weight: 500;
                    font-size: 12px;
                }
                
                .condition-excellent {
                    background-color: #dcfce7;
                    color: #166534;
                }
                
                .condition-good {
                    background-color: #dbeafe;
                    color: #1e40af;
                }
                
                .condition-fair {
                    background-color: #fef3c7;
                    color: #92400e;
                }
                
                .condition-poor {
                    background-color: #fee2e2;
                    color: #b91c1c;
                }
                
                .result-card {
                    background-color: var(--primary-light);
                    border-left: 4px solid var(--primary);
                }
                
                .result-title {
                    font-weight: 600;
                    margin-bottom: 5px;
                }
                
                .result-value {
                    font-size: 18px;
                    font-weight: 700;
                }
                
                .result-pass {
                    color: var(--success);
                }
                
                .result-fail {
                    color: var(--danger);
                }
                
                .notes {
                    background-color: #f9fafb;
                    padding: 15px;
                    border-radius: 6px;
                    margin-top: 10px;
                }
                
                .footer {
                    margin-top: 40px;
                    padding-top: 20px;
                    border-top: 1px solid #e5e7eb;
                    text-align: center;
                    color: var(--neutral);
                    font-size: 12px;
                }
                
                .signature-area {
                    margin-top: 20px;
                    padding-top: 20px;
                    border-top: 1px dashed #e5e7eb;
                }
                
                .signature-label {
                    font-size: 12px;
                    color: var(--neutral);
                    margin-bottom: 10px;
                }
                
                .disclaimer {
                    margin-top: 20px;
                    font-size: 10px;
                    color: var(--neutral);
                }
            </style>
        </head>
        <body>
            <div class="container">
                <!-- Header with Logo and Report Info -->
                <div class="header">
                    <div class="logo-area">
                        <div class="logo-title">Inspecto</div>
                        <div class="logo-subtitle">Official Vehicle Inspection Report</div>
                    </div>
                    <div class="report-info">
                        <div class="report-id">Ref: ${inspection.bookingReference}</div>
                        <div class="report-date">${format(new Date(inspection.date), 'MMMM dd, yyyy')}</div>
                        <div class="status-badge status-${inspection.status === 'completed' ? 'completed' : 'pending'}">${inspection.status}</div>
                    </div>
                </div>
                
                <!-- Main Content Grid -->
                <div class="grid">
                    <!-- Vehicle Information -->
                    <div class="col-6">
                        <div class="card">
                            <div class="card-title">Vehicle Details</div>
                            <div class="info-grid">
                                <div class="info-label">Make & Model:</div>
                                <div class="info-value">${vehicle?.make || 'N/A'} ${vehicle?.vehicleModel || 'N/A'}</div>
                                
                                <div class="info-label">Year:</div>
                                <div class="info-value">${vehicle?.year || 'N/A'}</div>
                                
                                <div class="info-label">Registration:</div>
                                <div class="info-value">${vehicle?.registrationNumber || 'N/A'}</div>
                                
                                <div class="info-label">VIN:</div>
                                <div class="info-value">${vehicle?.chassisNumber || 'N/A'}</div>
                                
                                <div class="info-label">Mileage:</div>
                                <div class="info-value">${inspection.report?.mileage || 'N/A'}</div>
                                
                                <div class="info-label">Fuel Type:</div>
                                <div class="info-value">${vehicle?.fuelType ? vehicle.fuelType.charAt(0).toUpperCase() + vehicle.fuelType.slice(1) : 'N/A'}</div>
                                
                                <div class="info-label">Transmission:</div>
                                <div class="info-value">${vehicle?.transmission ? vehicle.transmission.charAt(0).toUpperCase() + vehicle.transmission.slice(1) : 'N/A'}</div>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Contact Information -->
                    <div class="col-6">
                        <div class="card">
                            <div class="card-title">Contact Information</div>
                            <div class="info-grid">
                                <div class="info-label">Owner:</div>
                                <div class="info-value">${user?.firstName || ''} ${user?.lastName || ''}</div>
                                
                                <div class="info-label">Email:</div>
                                <div class="info-value">${user?.email || 'N/A'}</div>
                                
                                <div class="info-label">Phone:</div>
                                <div class="info-value">${inspection.phone || 'N/A'}</div>
                                
                                <div class="info-label">Inspector:</div>
                                <div class="info-value">${inspector?.firstName || ''} ${inspector?.lastName || ''}</div>
                                
                                <div class="info-label">Experience:</div>
                                <div class="info-value">${inspector?.yearOfExp || 'N/A'} years</div>
                                
                                <div class="info-label">Specialization:</div>
                                <div class="info-value">${inspector?.specialization?.join(', ') || 'N/A'}</div>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Condition Assessment -->
                    <div class="col-6">
                        <div class="card">
                            <div class="card-title">Condition Assessment</div>
                            <table class="condition-table">
                                <tr>
                                    <th>Component</th>
                                    <th>Condition</th>
                                </tr>
                                <tr>
                                    <td>Exterior</td>
                                    <td>
                                        <span class="condition-badge condition-${inspection.report?.exteriorCondition || 'not-assessed'}">
                                            ${formatCondition(inspection.report?.exteriorCondition)}
                                        </span>
                                    </td>
                                </tr>
                                <tr>
                                    <td>Interior</td>
                                    <td>
                                        <span class="condition-badge condition-${inspection.report?.interiorCondition || 'not-assessed'}">
                                            ${formatCondition(inspection.report?.interiorCondition)}
                                        </span>
                                    </td>
                                </tr>
                                <tr>
                                    <td>Engine</td>
                                    <td>
                                        <span class="condition-badge condition-${inspection.report?.engineCondition || 'not-assessed'}">
                                            ${formatCondition(inspection.report?.engineCondition)}
                                        </span>
                                    </td>
                                </tr>
                                <tr>
                                    <td>Tires</td>
                                    <td>
                                        <span class="condition-badge condition-${inspection.report?.tiresCondition || 'not-assessed'}">
                                            ${formatCondition(inspection.report?.tiresCondition)}
                                        </span>
                                    </td>
                                </tr>
                                <tr>
                                    <td>Lights</td>
                                    <td>
                                        <span class="condition-badge condition-${inspection.report?.lightsCondition || 'not-assessed'}">
                                            ${formatCondition(inspection.report?.lightsCondition)}
                                        </span>
                                    </td>
                                </tr>
                                <tr>
                                    <td>Brakes</td>
                                    <td>
                                        <span class="condition-badge condition-${inspection.report?.brakesCondition || 'not-assessed'}">
                                            ${formatCondition(inspection.report?.brakesCondition)}
                                        </span>
                                    </td>
                                </tr>
                                <tr>
                                    <td>Suspension</td>
                                    <td>
                                        <span class="condition-badge condition-${inspection.report?.suspensionCondition || 'not-assessed'}">
                                            ${formatCondition(inspection.report?.suspensionCondition)}
                                        </span>
                                    </td>
                                </tr>
                                <tr>
                                    <td>Fuel Level</td>
                                    <td>${formatFuelLevel(inspection.report?.fuelLevel)}</td>
                                </tr>
                            </table>
                        </div>
                    </div>
                    
                    <!-- Inspection Result -->
                    <div class="col-6">
                        <div class="card result-card">
                            <div class="card-title">Inspection Result</div>
                            <div class="result-title">Overall Assessment:</div>
                            <div class="result-value ${inspection.report?.passedInspection ? 'result-pass' : 'result-fail'}">
                                ${inspection.report?.passedInspection ? 'PASSED' : 'FAILED'}
                            </div>
                            
                            ${inspection.report?.recommendations ? `
                            <div style="margin-top: 15px;">
                                <div class="info-label">Recommendations:</div>
                                <div class="notes">${inspection.report.recommendations}</div>
                            </div>
                            ` : ''}
                            
                            ${inspection.report?.additionalNotes ? `
                            <div style="margin-top: 15px;">
                                <div class="info-label">Additional Notes:</div>
                                <div class="notes">${inspection.report.additionalNotes}</div>
                            </div>
                            ` : ''}
                            
                            ${inspection.report?.photos && inspection.report.photos.length > 0 ? `
                            <div style="margin-top: 15px;">
                                <div class="info-label">Photos:</div>
                                <div class="notes">${inspection.report.photos.length} photos taken during inspection (available in online report)</div>
                            </div>
                            ` : ''}
                        </div>
                    </div>
                </div>
                
                <!-- Footer with Signature -->
                <div class="footer">
                    ${inspector?.signature ? `
                    <div class="signature-area">
                        <div class="signature-label">Inspector's Signature:</div>
                        <!-- Signature would be displayed here if available as an image -->
                    </div>
                    ` : ''}
                    
                    <p>Report generated on ${format(new Date(), 'MMMM dd, yyyy')}</p>
                    
                    <div class="disclaimer">
                        DISCLAIMER: This inspection report provides a general assessment of the vehicle condition at the time of inspection.
                        It is not a guarantee or warranty. The inspection service provider is not liable for any issues that may arise after the inspection.
                    </div>
                </div>
            </div>
        </body>
        </html>
        `;

        // Configure PDF options
        const options = {
            format: 'A4' as const,
            margin: {
                top: '10mm',
                right: '10mm',
                bottom: '10mm',
                left: '10mm'
            },
            printBackground: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        };

        // Generate PDF
        const file = { content: htmlContent };
        const pdfBuffer = await html_to_pdf.generatePdf(file, options) as unknown as Buffer;
        if (!pdfBuffer || pdfBuffer.length === 0) {
            throw new Error('Failed to generate PDF buffer');
        }
        return pdfBuffer;
    } catch (error) {
        console.error('PDF Generation Failed:', {
            inspectionId: inspection._id,
            error: error instanceof Error ? error.stack : error
        });
        throw new Error(`PDF generation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
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