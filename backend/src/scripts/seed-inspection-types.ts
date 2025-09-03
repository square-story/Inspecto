import mongoose from 'mongoose';
import { InspectionTypeModel } from '../models/inspection-type.model';
import appConfig from '../config/app.config';
import { Admin } from '../models/admin.model';

const seedInspectionTypes = async () => {
    try {
        await mongoose.connect(appConfig.databaseUrl as string);
        console.log('Connected to MongoDB');

        const adminCount = await Admin.countDocuments();
        if (adminCount === 0) {
            await Admin.create({
                email: 'admin@gmail.com',
                password: 'admin@123',
                role: 'admin'
            }).then(() => {
                console.log('Admin seeded successfully');
            }).catch((err) => {
                console.log('Error seeding admin:', err);
            })
        }

        // Check if inspection types already exist
        const count = await InspectionTypeModel.countDocuments();
        if (count > 0) {
            console.log('Inspection types already exist. Skipping seeding.');
            await mongoose.disconnect();
            return;
        }

        

        // Seed data
        const inspectionTypes = [
            {
                id: 'basic',
                name: 'Basic Inspection',
                price: 200,
                platformFee: 50,
                duration: '45-60 mins',
                features: [
                    'External visual inspection',
                    'Basic engine diagnostics',
                    'Tire condition check',
                    'Brake system check'
                ],
                fields: [],
                isActive: true
            },
            {
                id: 'full',
                name: 'Full Inspection',
                price: 250,
                platformFee: 50,
                duration: '90-120 mins',
                fields: [],
                features: [
                    'Complete external & internal inspection',
                    'Advanced computer diagnostics',
                    'Suspension system check',
                    'Electrical systems check',
                    'Test drive evaluation',
                    'Detailed report with photos'
                ],
                isActive: true
            }
        ];

        await InspectionTypeModel.insertMany(inspectionTypes);
        console.log('Inspection types seeded successfully');

        await mongoose.disconnect();
    } catch (error) {
        console.error('Error seeding inspection types:', error);
        process.exit(1);
    }
};

seedInspectionTypes();