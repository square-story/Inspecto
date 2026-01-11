import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import { Admin } from '../models/admin.model';
import appConfig from '../config/app.config';

const seedAdmin = async () => {
    try {
        await mongoose.connect(appConfig.databaseUrl);
        console.log('Connected to MongoDB');

        const adminEmail = appConfig.adminEmail;
        const adminPassword = appConfig.adminPassword;

        if (!adminEmail || !adminPassword) {
            console.error('ADMIN_EMAIL and ADMIN_PASSWORD must be set in environment variables');
            process.exit(1);
        }

        const existingAdmin = await Admin.findOne({ email: adminEmail });
        const hashedPassword = await bcrypt.hash(adminPassword, 10);

        if (existingAdmin) {
            console.log('Admin user already exists. Updating password...');
            existingAdmin.password = hashedPassword;
            await existingAdmin.save();
            console.log('Admin password updated successfully');
        } else {
            const newAdmin = new Admin({
                email: adminEmail,
                password: hashedPassword,
                role: 'admin'
            });
            await newAdmin.save();
            console.log('Admin user created successfully');
        }

        await mongoose.disconnect();
    } catch (error) {
        console.error('Error seeding admin:', error);
        process.exit(1);
    }
};

seedAdmin();
