import puppeteer from 'puppeteer';
import { IInspectionDocument } from "../models/inspection.model";
import { format } from "date-fns";
import { IInspector } from "../models/inspector.model";
import { IUsers } from "../models/user.model";
import { IVehicleDocument } from "../models/vehicle.model";
import appConfig from '../config/app.config';


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

        // Create HTML template (same template as before)
        const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <title>Vehicle Inspection Report</title>
            <style>
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');
                
                :root {
                    --primary: #3b82f6;
                    --primary-dark: #2563eb;
                    --primary-light: #dbeafe;
                    --primary-lighter: #eff6ff;
                    --success: #10b981;
                    --success-light: #dcfce7;
                    --warning: #f59e0b;
                    --warning-light: #fef3c7;
                    --danger: #ef4444;
                    --danger-light: #fee2e2;
                    --neutral: #6b7280;
                    --neutral-light: #f3f4f6;
                    --neutral-lighter: #f9fafb;
                    --border: #e5e7eb;
                    --text-primary: #1f2937;
                    --text-secondary: #4b5563;
                    --text-muted: #9ca3af;
                }
                
                * {
                    box-sizing: border-box;
                    margin: 0;
                    padding: 0;
                }
                
                @page {
                    size: A4;
                    margin: 10mm;
                }
                
                body {
                    font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
                    line-height: 1.6;
                    color: var(--text-primary);
                    background-color: white;
                    font-size: 11pt;
                    position: relative;
                }
                
                .watermark {
                    position: fixed;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%) rotate(-45deg);
                    font-size: 120px;
                    font-weight: 800;
                    color: rgba(59, 130, 246, 0.05);
                    z-index: -1;
                    letter-spacing: 20px;
                }
                
                .container {
                    max-width: 100%;
                    padding: 20px;
                    position: relative;
                }
                
                /* Header Section */
                .header {
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-start;
                    margin-bottom: 30px;
                    padding-bottom: 20px;
                    border-bottom: 2px solid var(--primary);
                    position: relative;
                }
                
                .header::after {
                    content: '';
                    position: absolute;
                    bottom: -2px;
                    left: 0;
                    width: 100px;
                    height: 2px;
                    background: linear-gradient(90deg, var(--primary-dark), transparent);
                }
                
                .logo-area {
                    display: flex;
                    flex-direction: column;
                }
                
                .logo-title {
                    font-size: 28px;
                    font-weight: 800;
                    background: linear-gradient(135deg, var(--primary), var(--primary-dark));
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                    margin-bottom: 2px;
                }
                
                .logo-subtitle {
                    font-size: 12px;
                    color: var(--text-secondary);
                    font-weight: 500;
                    letter-spacing: 0.5px;
                }
                
                .report-meta {
                    text-align: right;
                    display: flex;
                    flex-direction: column;
                    gap: 8px;
                }
                
                .report-id {
                    font-size: 14px;
                    font-weight: 700;
                    color: var(--text-primary);
                    background: var(--neutral-light);
                    padding: 4px 12px;
                    border-radius: 6px;
                }
                
                .report-date {
                    color: var(--text-secondary);
                    font-size: 12px;
                    font-weight: 500;
                }
                
                .status-badge {
                    display: inline-block;
                    padding: 6px 16px;
                    border-radius: 20px;
                    font-weight: 600;
                    font-size: 11px;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                }
                
                .status-completed {
                    background: linear-gradient(135deg, var(--success-light), #bbf7d0);
                    color: #065f46;
                    border: 1px solid #86efac;
                }
                
                .status-pending {
                    background: linear-gradient(135deg, var(--warning-light), #fed7aa);
                    color: #78350f;
                    border: 1px solid #fbbf24;
                }
                
                /* Quick Summary Bar */
                .quick-summary {
                    background: linear-gradient(135deg, var(--primary-lighter), var(--primary-light));
                    border-radius: 12px;
                    padding: 20px;
                    margin-bottom: 25px;
                    border: 1px solid var(--primary-light);
                }
                
                .summary-grid {
                    display: flex;
                    justify-content: space-between;
                    gap: 20px;
                }
                
                .summary-item {
                    flex: 1;
                    text-align: center;
                }
                
                .summary-value {
                    font-size: 20px;
                    font-weight: 700;
                    color: var(--primary-dark);
                    display: block;
                    margin-bottom: 4px;
                }
                
                .summary-label {
                    font-size: 11px;
                    color: var(--text-secondary);
                    font-weight: 500;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                }
                
                /* Main Content Grid */
                .grid {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 20px;
                    margin-bottom: 25px;
                }
                
                .col-6 {
                    flex: 0 0 calc(50% - 10px);
                }
                
                .col-12 {
                    flex: 0 0 100%;
                }
                
                .card {
                    background-color: white;
                    border-radius: 10px;
                    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06);
                    padding: 18px;
                    height: 100%;
                    border: 1px solid var(--border);
                    transition: all 0.3s ease;
                }
                
                .card-title {
                    font-size: 14px;
                    font-weight: 700;
                    margin-bottom: 15px;
                    color: var(--text-primary);
                    display: flex;
                    align-items: center;
                    padding-bottom: 10px;
                    border-bottom: 1px solid var(--neutral-light);
                }
                
                .card-icon {
                    display: inline-block;
                    width: 28px;
                    height: 28px;
                    background: var(--primary-light);
                    border-radius: 6px;
                    margin-right: 10px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 14px;
                    color: var(--primary);
                }
                
                .info-grid {
                    display: grid;
                    grid-template-columns: minmax(120px, auto) 1fr;
                    gap: 10px 15px;
                    font-size: 11pt;
                }
                
                .info-label {
                    color: var(--text-secondary);
                    font-weight: 500;
                    font-size: 11px;
                    text-transform: uppercase;
                    letter-spacing: 0.3px;
                }
                
                .info-value {
                    font-weight: 600;
                    color: var(--text-primary);
                    word-break: break-word;
                }
                
                /* Condition Assessment Table */
                .condition-table {
                    width: 100%;
                    border-collapse: separate;
                    border-spacing: 0;
                    margin-top: 5px;
                    overflow: hidden;
                    border-radius: 8px;
                    border: 1px solid var(--border);
                }
                
                .condition-table th,
                .condition-table td {
                    padding: 10px 12px;
                    text-align: left;
                    border-bottom: 1px solid var(--border);
                }
                
                .condition-table thead {
                    background: var(--neutral-lighter);
                }
                
                .condition-table th {
                    font-weight: 600;
                    color: var(--text-secondary);
                    font-size: 11px;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                }
                
                .condition-table tbody tr:hover {
                    background: var(--neutral-lighter);
                }
                
                .condition-table tbody tr:last-child td {
                    border-bottom: none;
                }
                
                .condition-item {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                }
                
                .condition-icon {
                    width: 20px;
                    height: 20px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 10px;
                    font-weight: bold;
                }
                
                .condition-badge {
                    display: inline-block;
                    padding: 4px 10px;
                    border-radius: 6px;
                    font-weight: 600;
                    font-size: 11px;
                    text-transform: capitalize;
                    letter-spacing: 0.3px;
                }
                
                .condition-excellent {
                    background: var(--success-light);
                    color: #065f46;
                    border: 1px solid #86efac;
                }
                
                .condition-good {
                    background: var(--primary-light);
                    color: #1e40af;
                    border: 1px solid #93c5fd;
                }
                
                .condition-fair {
                    background: var(--warning-light);
                    color: #78350f;
                    border: 1px solid #fbbf24;
                }
                
                .condition-poor {
                    background: var(--danger-light);
                    color: #7f1d1d;
                    border: 1px solid #fca5a5;
                }
                
                /* Result Card */
                .result-card {
                    background: linear-gradient(135deg, var(--primary-lighter), var(--primary-light));
                    border: 2px solid var(--primary);
                    position: relative;
                    overflow: hidden;
                }
                
                .result-card::before {
                    content: '';
                    position: absolute;
                    top: -50%;
                    right: -50%;
                    width: 200%;
                    height: 200%;
                    background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%);
                }
                
                .result-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 20px;
                }
                
                .result-title {
                    font-weight: 600;
                    font-size: 13px;
                    color: var(--text-secondary);
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                }
                
                .result-value {
                    font-size: 24px;
                    font-weight: 800;
                    letter-spacing: 1px;
                }
                
                .result-pass {
                    color: var(--success);
                }
                
                .result-fail {
                    color: var(--danger);
                }
                
                .rating-display {
                    display: flex;
                    align-items: center;
                    gap: 15px;
                    padding: 15px;
                    background: white;
                    border-radius: 8px;
                    margin-top: 15px;
                }
                
                .rating-score {
                    font-size: 32px;
                    font-weight: 800;
                    color: var(--primary);
                }
                
                .rating-details {
                    flex: 1;
                }
                
                .rating-label {
                    font-size: 11px;
                    color: var(--text-secondary);
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                }
                
                .rating-text {
                    font-size: 16px;
                    font-weight: 700;
                    color: var(--text-primary);
                }
                
                /* Notes and Recommendations */
                .notes-section {
                    background: var(--neutral-lighter);
                    padding: 15px;
                    border-radius: 8px;
                    margin-top: 15px;
                    border-left: 4px solid var(--primary);
                }
                
                .notes-title {
                    font-size: 12px;
                    font-weight: 600;
                    color: var(--text-secondary);
                    margin-bottom: 8px;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                }
                
                .notes-content {
                    color: var(--text-primary);
                    line-height: 1.6;
                    font-size: 11pt;
                }
                
                /* QR Code Section */
                .qr-section {
                    display: flex;
                    align-items: center;
                    gap: 20px;
                    padding: 15px;
                    background: var(--neutral-lighter);
                    border-radius: 8px;
                    margin-top: 20px;
                }
                
                .qr-code {
                    flex-shrink: 0;
                }
                
                .qr-info {
                    flex: 1;
                }
                
                .qr-title {
                    font-size: 13px;
                    font-weight: 600;
                    color: var(--text-primary);
                    margin-bottom: 4px;
                }
                
                .qr-description {
                    font-size: 11px;
                    color: var(--text-secondary);
                    line-height: 1.4;
                }
                
                .qr-link {
                    color: var(--primary);
                    text-decoration: none;
                    font-weight: 500;
                    word-break: break-all;
                }
                
                /* Inspector Signature */
                .signature-section {
                    margin-top: 30px;
                    padding: 20px;
                    background: var(--neutral-lighter);
                    border-radius: 8px;
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-end;
                }
                
                .signature-box {
                    flex: 1;
                    max-width: 300px;
                }
                
                .signature-label {
                    font-size: 11px;
                    color: var(--text-secondary);
                    margin-bottom: 8px;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                }
                
                .signature-line {
                    border-bottom: 2px solid var(--text-secondary);
                    margin-bottom: 5px;
                    min-height: 40px;
                    display: flex;
                    align-items: flex-end;
                    justify-content: center;
                }
                
                .signature-name {
                    font-size: 12px;
                    color: var(--text-primary);
                    font-weight: 600;
                }
                
                .stamp-area {
                    width: 100px;
                    height: 100px;
                    border: 2px dashed var(--border);
                    border-radius: 8px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: var(--text-muted);
                    font-size: 10px;
                    text-align: center;
                }
                
                /* Footer */
                .footer {
                    margin-top: 40px;
                    padding-top: 20px;
                    border-top: 2px solid var(--border);
                }
                
                .footer-content {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 20px;
                }
                
                .footer-logo {
                    font-size: 16px;
                    font-weight: 700;
                    color: var(--primary);
                }
                
                .footer-info {
                    text-align: right;
                    font-size: 10px;
                    color: var(--text-secondary);
                    line-height: 1.4;
                }
                
                .disclaimer {
                    background: var(--neutral-lighter);
                    padding: 12px;
                    border-radius: 6px;
                    font-size: 9px;
                    color: var(--text-muted);
                    line-height: 1.5;
                    text-align: justify;
                }
                
                .disclaimer-title {
                    font-weight: 600;
                    color: var(--text-secondary);
                    margin-bottom: 4px;
                    text-transform: uppercase;
                }
                
                /* Page Break Control */
                .page-break {
                    page-break-after: always;
                }
                
                @media print {
                    body {
                        print-color-adjust: exact;
                        -webkit-print-color-adjust: exact;
                    }
                    
                    .card {
                        break-inside: avoid;
                    }
                    
                    .condition-table {
                        break-inside: avoid;
                    }
                }
                
                /* Responsive adjustments for smaller viewports */
                @media (max-width: 768px) {
                    .grid {
                        display: block;
                    }
                    
                    .col-6 {
                        flex: 0 0 100%;
                        margin-bottom: 15px;
                    }
                    
                    .summary-grid {
                        flex-direction: column;
                        gap: 10px;
                    }
                    
                    .header {
                        flex-direction: column;
                        gap: 15px;
                    }
                    
                    .report-meta {
                        text-align: left;
                    }
                }
            </style>
        </head>
        <body>
        <div class="watermark">INSPECTO</div>
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
                        <div class="status-badge">${inspection.status}</div>
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

                    <div class="quick-summary">
                    <div class="summary-grid">
                        <div class="summary-item">
                            <span class="summary-value">${format(new Date(inspection.date), 'MMM dd')}</span>
                            <span class="summary-label">Inspection Date</span>
                        </div>
                        <div class="summary-item">
                            <span class="summary-value">${vehicle?.type?.toUpperCase() || 'N/A'}</span>
                            <span class="summary-label">Vehicle Type</span>
                        </div>
                        <div class="summary-item">
                            <span class="summary-value">${inspection.report?.mileage || 'N/A'}</span>
                            <span class="summary-label">Mileage</span>
                        </div>
                    </div>
                </div>
                    
                    <div class="col-6">
                        <div class="card">
                            <div class="card-title">
                                <span class="card-icon">👤</span>
                                Contact Details
                            </div>
                            <div class="info-grid">
                                <div class="info-label">Owner Name</div>
                                <div class="info-value">${user?.firstName || ''} ${user?.lastName || ''}</div>
                                
                                <div class="info-label">Email</div>
                                <div class="info-value">${user?.email || 'N/A'}</div>
                                
                                <div class="info-label">Phone</div>
                                <div class="info-value">${inspection.phone || 'N/A'}</div>
                                
                                <div class="info-label">Location</div>
                                <div class="info-value">${inspection.location || 'N/A'}</div>
                                
                                <div class="info-label">Inspector</div>
                                <div class="info-value">${inspector?.firstName || ''} ${inspector?.lastName || ''}</div>
                                
                                <div class="info-label">Experience</div>
                                <div class="info-value">${inspector?.yearOfExp || 'N/A'} years</div>
                                
                                <div class="info-label">Specialization</div>
                                <div class="info-value">${inspector?.specialization?.join(', ') || 'N/A'}</div>
                            </div>
                        </div>
                    </div>

                     <div class="col-6">
                        <div class="card">
                            <div class="card-title">
                                <span class="card-icon">🚗</span>
                                Vehicle Information
                            </div>
                            <div class="info-grid">
                                <div class="info-label">Make & Model</div>
                                <div class="info-value">${vehicle?.make || 'N/A'} ${vehicle?.vehicleModel || 'N/A'}</div>
                                
                                <div class="info-label">Year</div>
                                <div class="info-value">${vehicle?.year || 'N/A'}</div>
                                
                                <div class="info-label">Registration</div>
                                <div class="info-value">${vehicle?.registrationNumber || 'N/A'}</div>
                                
                                <div class="info-label">VIN/Chassis</div>
                                <div class="info-value">${vehicle?.chassisNumber || 'N/A'}</div>
                                
                                <div class="info-label">Fuel Type</div>
                                <div class="info-value">${vehicle?.fuelType ? vehicle.fuelType.charAt(0).toUpperCase() + vehicle.fuelType.slice(1) : 'N/A'}</div>
                                
                                <div class="info-label">Transmission</div>
                                <div class="info-value">${vehicle?.transmission ? vehicle.transmission.charAt(0).toUpperCase() + vehicle.transmission.slice(1) : 'N/A'}</div>
                                
                                <div class="info-label">Insurance Expiry</div>
                                <div class="info-value">${vehicle?.insuranceExpiry ? format(new Date(vehicle.insuranceExpiry), 'MMM dd, yyyy') : 'N/A'}</div>
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
                                <div class="report-link">
                                <a href="${appConfig.frontEndUrl}/user/dashboard/report/${inspection._id}" target="_blank" style="color: var(--primary); text-decoration: none; font-weight: 500;">View Full Report Online</a>
                                </div>
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

        // Launch a headless browser
        const browser = await puppeteer.launch({
            headless: true,
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-dev-shm-usage',
                '--disable-gpu'
            ]
        });

        // Create a new page
        const page = await browser.newPage();

        // Set the content of the page
        await page.setContent(htmlContent, {
            waitUntil: 'networkidle0' // Wait until the network is idle (no more than 0 connections for at least 500ms)
        });

        // Generate PDF
        const pdfBuffer = await page.pdf({
            format: 'A4',
            printBackground: true,
            margin: {
                top: '10mm',
                right: '10mm',
                bottom: '10mm',
                left: '10mm'
            }
        });

        // Close the browser
        await browser.close();

        return Buffer.from(pdfBuffer);
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

