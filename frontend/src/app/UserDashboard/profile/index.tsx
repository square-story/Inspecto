import ContentSection from '@/components/content-section'
import ProfileForm from './ProfileForm'
import PasswordManagement from '@/app/InspectorSettings/PasswordManagment'

export default function SettingsProfile() {

    return (
        <ContentSection
            title='Profile'
            desc='This is how others will see you on the site.'
        >
            <div className="grid gap-5">
                <PasswordManagement />
                <ProfileForm />
            </div>
        </ContentSection>
    )
}
